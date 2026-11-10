"""Nitron kit — relight a cut-out presenter (the DaVinci lighting pass, done on the person layer).
python3 relight.py <in dir of RGBA person PNGs> <out dir> [first] [last] [--preview out.png]

Client, 8 Nov: «a lot of adjustments to the lighting». His footage is lit flat from the front, so on the series' white
backdrop he looks dim and pasted on. Per frame, inside his alpha only:
  1. base grade   exposure +, gentle S-curve, warm skin midtones, cool lilac shadows (the series look)
  2. key light    a soft pool of light from camera left on his face, the far side of the face a touch darker (shape)
  3. clarity      local contrast on the face and sweater, kept off the cut-out edge (no halo)
  4. rim light    a lilac edge light from behind, strongest on the right and on his hair: it ties him to the
                  purple shimmer behind him and separates him from the white
The alpha is untouched. The contact shadow and the background falloff are drawn in the scene (presenterBg).
"""
import sys, os, glob, cv2, numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
ARGS = [a for a in sys.argv[3:] if not a.startswith("--")]
A0 = int(ARGS[0]) if ARGS else 0; A1 = int(ARGS[1]) if len(ARGS) > 1 else 10**9
PREVIEW = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
LIL = np.array([219, 125, 199], np.float32) / 255  # lilac #C77DDB in BGR
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def curve(x, pts):
    p = np.array(pts, np.float32); return np.interp(x, p[:, 0], p[:, 1]).astype(np.float32)

def face(bgr, a):
    g = cv2.cvtColor((bgr * a[..., None] + 0.5 * (1 - a[..., None])).clip(0, 1).__mul__(255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    r = [q for q in casc.detectMultiScale(g, 1.08, 6, minSize=(140, 140)) if q[1] < 1100]
    if not r: return None
    x, y, w, h = max(r, key=lambda q: q[2]); return np.array([x + w / 2, y + h / 2, w], np.float32)

def relight(bgr, a, f):
    H, W = a.shape; fx, fy, fw = f
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # 1) base grade
    out = bgr * 1.03
    out = curve(out, [(0, 0.03), (0.2, 0.18), (0.5, 0.51), (0.78, 0.80), (1.0, 0.92), (1.2, 0.97)])
    lum = out.mean(2, keepdims=True)
    mid = np.exp(-((lum - 0.55) ** 2) / 0.05)            # warm the skin midtones
    out = out * (1 + mid * np.array([-0.012, 0.0, 0.015], np.float32))
    sh = (1 - lum / 0.35).clip(0, 1)                     # cool lilac shadows
    out = out + sh * np.array([0.020, -0.004, 0.012], np.float32)
    # 2) key light from camera left + a darker far side of the face
    kx, ky, sig = fx - 0.55 * fw, fy - 0.35 * fw, 1.5 * fw
    key = np.exp(-((xx - kx) ** 2 + (yy - ky) ** 2) / (2 * sig * sig))
    far = ((xx - fx) / (0.9 * fw)).clip(0, 1) * np.exp(-((yy - fy) ** 2) / (2 * (1.6 * fw) ** 2))
    body = ((yy - (fy + 1.6 * fw)) / (H - fy)).clip(0, 1)  # light falls off down the body
    out = out * (1 + 0.08 * key - 0.09 * far - 0.08 * body)[..., None]
    # 3) clarity, kept inside the cut-out
    inner = cv2.erode(a, np.ones((15, 15), np.uint8)); inner = cv2.GaussianBlur(inner, (0, 0), 6)[..., None]
    out = out + 0.16 * inner * (out - cv2.GaussianBlur(out, (0, 0), 16))
    # 4) lilac rim light from behind, right side and hair strongest
    band = (a * (1 - cv2.GaussianBlur(a, (0, 0), 9))).clip(0, 1) * 2.2
    band = cv2.GaussianBlur(band.clip(0, 1), (0, 0), 2)
    side = (0.35 + 0.65 * ((xx - fx) / (0.45 * W) + 0.3)).clip(0.25, 1) + 0.5 * (yy < fy - 0.2 * fw)
    rim = (band * side.clip(0, 1.2) * (0.0 if "--no-rim" in sys.argv else 0.75))[..., None]   # --no-rim: the set adds its own (stage_composite.py)
    out = 1 - (1 - out.clip(0, 1)) * (1 - rim * LIL)
    return out.clip(0, 1)

files = sorted(glob.glob(os.path.join(SRC, "*.png")))
files = [f for f in files if A0 <= int(os.path.basename(f)[:5]) <= A1]
os.makedirs(DST, exist_ok=True); last = None; n = 0
for i, f in enumerate(files):
    im = cv2.imread(f, cv2.IMREAD_UNCHANGED); bgr = im[..., :3].astype(np.float32) / 255; a = im[..., 3].astype(np.float32) / 255
    d = face(bgr, a) if (i % 3 == 0 or last is None) else None
    if d is not None: last = d if last is None else 0.6 * last + 0.4 * d   # smooth the light's position
    if last is None: last = np.array([540, 600, 300], np.float32)
    o = relight(bgr, a, last)
    res = np.dstack([(o * 255 + 0.5).astype(np.uint8), im[..., 3]])
    if PREVIEW:
        bg = np.full_like(o, 0.93); comp = o * a[..., None] + bg * (1 - a[..., None]); org = bgr * a[..., None] + bg * (1 - a[..., None])
        cv2.imwrite(PREVIEW, (np.hstack([org, comp]) * 255).astype(np.uint8)); print("preview", PREVIEW); break
    cv2.imwrite(os.path.join(DST, os.path.basename(f)), res); n += 1
print(f"relit {n} frames → {DST}")
