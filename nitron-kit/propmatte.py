"""Nitron kit — presenter cut-out for every frame from key-frame mattes (BiRefNet-portrait every 6th frame) on a plain light backdrop.
python3 propmatte.py <work> <first> <last>      reads <work>/vfr_src/NNNNN.jpg + <work>/bt/kf/NNNNN.png → <work>/bt/p_raw/NNNNN.png (RGBA)

Why: the plugin's BiRefNet-portrait matte is the clean cut the client asked for, but it takes ~22 s a frame on this cloud CPU.
So it runs on key frames only, and every frame (key frames too, so nothing pops) is finished the same way:
  1. carry     the two nearest key-frame alphas are warped onto this frame by optical flow and blended by time
  2. plates    B = the cloth colour extended inward from outside him; P = his own colour extended outward from his core
  3. unmix     in the edge band alpha = how far the pixel sits between cloth and him, a = (I−B)·(P−B)/|P−B|² (exact for
               hair, skin, dark cloth). Anything strongly unlike the cloth is solid (a hand that moved since the key frame).
               Where he is as light as the cloth (white stripe, grey sleeve) the unmix is blind: the carried alpha is used
  4. clean     F = (I − (1−a)·B)/a takes the white of the cloth out of the edge pixels: no halo on a dark set
"""
import sys, os, glob, numpy as np, cv2
W = sys.argv[1]; A0, A1 = int(sys.argv[2]), int(sys.argv[3]); OUT = W + "/bt/p_raw"; os.makedirs(OUT, exist_ok=True)
KF = sorted(int(os.path.basename(f)[:5]) for f in glob.glob(W + "/bt/kf/*.png")); KF = [k for k in KF if A0 <= k <= A1]
E = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
rd = lambda i: cv2.imread(f"{W}/vfr_src/{i:05d}.jpg")
al = lambda k: cv2.imread(f"{W}/bt/kf/{k:05d}.png", 0).astype(np.float32) / 255
def small(im): return cv2.cvtColor(cv2.resize(im, (540, 960), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
gx, gy = np.meshgrid(np.arange(1080, dtype=np.float32), np.arange(1920, dtype=np.float32))
def carry(gi, k):
    """alpha of key frame k as seen in the current frame (backward flow at half size)"""
    fl = dis.calc(gi, small(rd(k)), None); fl = cv2.resize(fl, (1080, 1920), interpolation=cv2.INTER_LINEAR) * 2
    return cv2.remap(al(k), gx + fl[..., 0], gy + fl[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
def nblur(I, w, s):
    num = cv2.GaussianBlur(I * w[..., None], (0, 0), s); den = cv2.GaussianBlur(w, (0, 0), s)[..., None]
    return num / np.maximum(den, 1e-4), den[..., 0]
n = 0
for i in range(A0, A1 + 1):
    if os.path.exists(f"{OUT}/{i:05d}.png"): continue
    k0 = max([k for k in KF if k <= i], default=None); k1 = min([k for k in KF if k >= i], default=None)
    if k0 is None or k1 is None: continue
    im = rd(i); I = im.astype(np.float32) / 255; gi = small(im)
    if k0 == k1: K = al(k0)
    else: u = (i - k0) / (k1 - k0); K = (1 - u) * carry(gi, k0) + u * carry(gi, k1)
    hard = (K > 0.5).astype(np.uint8)
    core = cv2.erode(hard, E(9)).astype(np.float32)
    bgm = 1 - cv2.dilate(hard, E(34)).astype(np.float32)
    B, bden = nblur(I, bgm, 22); B = np.where(bden[..., None] > 0.01, B, np.median(I[bgm > 0.5], axis=0) if bgm.sum() > 100 else 0.9)
    dist = np.sqrt(((I - B) ** 2).sum(2))
    mx, mn = I.max(2), I.min(2); sat = (mx - mn) / (mx + 1e-3); lum = I.mean(2)
    unlike = (dist > 0.24) & ((sat > 0.20) | (lum < 0.32))                                    # skin or dark cloth, never a grey fold of the sheet
    strong = (unlike & (cv2.dilate(hard, E(60)) > 0)).astype(np.uint8)                        # e.g. a hand that moved since the key frame
    outer = np.maximum(cv2.dilate(hard, E(7)), cv2.dilate(strong, E(2))).astype(np.float32)
    P, pden = nblur(I, core, 10); P = np.where(pden[..., None] > 0.01, P, I)
    d, pb = I - B, P - B; c2 = (pb * pb).sum(2)
    a_un = np.clip((d * pb).sum(2) / np.maximum(c2, 1e-4), 0, 1); a_un = np.clip((a_un - 0.14) / 0.74, 0, 1)
    a_un = np.maximum(a_un, np.where(unlike, np.clip((dist - 0.24) / 0.14, 0, 1), 0))
    rel = np.clip((np.sqrt(c2) - 0.16) / 0.16, 0, 1)                                           # is he unlike the cloth here?
    a_band = rel * a_un + (1 - rel) * np.clip((K - 0.06) / 0.88, 0, 1)
    a = np.where(core > 0.5, 1.0, np.where(outer > 0.5, a_band, 0.0)).astype(np.float32)
    support = np.clip(cv2.GaussianBlur(np.maximum(K, strong.astype(np.float32)), (0, 0), 2.5) * 5, 0, 1)   # only where the key-frame matte (or a moved hand) backs it
    a = np.minimum(a, support).clip(0, 1)
    F = np.clip((I - (1 - a[..., None]) * B) / np.maximum(a[..., None], 0.10), 0, 1)
    edge = cv2.GaussianBlur(((a > 0.01) & (a < 0.99)).astype(np.float32), (0, 0), 1.0)[..., None]
    F = I * (1 - edge) + F * edge
    cv2.imwrite(f"{OUT}/{i:05d}.png", np.dstack([(F * 255 + 0.5).astype(np.uint8), (a * 255 + 0.5).astype(np.uint8)]), [cv2.IMWRITE_PNG_COMPRESSION, 3]); n += 1
print(n, "frames →", OUT)
