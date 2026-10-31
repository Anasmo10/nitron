# Reel #3 v2.1: push in on his hands while he wraps the wrist (cut time 3.40–4.86, «مهمته يثبّت المعصم»).
# Run after build_cut.py: python3 hands_r3.py <work>  (keeps the untouched frames in <work>/vfr_orig)
# 1.45× close-up, bottom-aligned on the hands, lifted 200 px so the wrap sits above Instagram's bottom bar;
# the lifted strip is filled with a frosted reflection of the bottom edge (inside Instagram's own bar).
import sys, os, shutil, numpy as np, cv2
W = sys.argv[1]
if not os.path.isdir(W + "/vfr_orig"): shutil.copytree(W + "/vfr", W + "/vfr_orig")
def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
Z = 1.45; HW, HH = 1080 / Z, 1920 / Z; HAND = (470 - HW / 2, 1920 - HH, HW, HH); LIFT = 200
def k_of(t):
    if t < 3.40 or t > 4.86: return 0
    return ease((t - 3.40) / 0.24) if t < 4.52 else 1 - ease((t - 4.52) / 0.32)
for n in range(int(3.40 * 30) + 1, int(4.86 * 30) + 2):
    t = (n - 1) / 30; k = k_of(t)
    if k <= 0: continue
    zf = np.exp(np.log(Z) * k); w = 1080 / zf; h = 1920 / zf
    cx = 540 + (HAND[0] + HW / 2 - 540) * k; cy = 960 + (HAND[1] + HH / 2 - 960) * k
    x = min(max(cx - w / 2, 0), 1080 - w); y = min(max(cy - h / 2, 0), 1920 - h)
    im = cv2.imread(f"{W}/vfr_orig/{n:05d}.jpg"); sx = 1080 / w; sy = 1920 / h; L = LIFT * k
    out = cv2.warpAffine(im, np.float32([[sx, 0, -x * sx], [0, sy, -y * sy - L]]), (1080, 1920), flags=cv2.INTER_LANCZOS4)
    out = cv2.addWeighted(out, 1.0 + 0.35 * k, cv2.GaussianBlur(out, (0, 0), 1.2), -0.35 * k, 0)
    b = int(round(L))
    if b > 0:
        src = out[1920 - 2 * b:1920 - b][::-1]; refl = cv2.GaussianBlur(src, (0, 0), 22)
        refl = (refl * 0.62 + np.array([22, 6, 26]) * 0.38).astype(np.uint8)
        g = np.linspace(0, 1, b)[:, None, None]; out[1920 - b:] = (refl * (0.55 + 0.45 * g)).astype(np.uint8)
        cv2.line(out, (0, 1920 - b), (1080, 1920 - b), (235, 235, 240), 2, cv2.LINE_AA)
    cv2.imwrite(f"{W}/vfr/{n:05d}.jpg", out, [cv2.IMWRITE_JPEG_QUALITY, 95])
print("hands close-up written")
