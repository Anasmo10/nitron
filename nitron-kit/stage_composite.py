"""Nitron kit — put a cut-out presenter into a generated set (e.g. a Higgsfield background) so it reads as one photograph.
python3 stage_composite.py <person RGBA png or dir> <background image> <out jpg or dir>
        [--face_x 0.52 --face_y 0.30 --face_w 0.34] [--blur 5] [--person-out dir] [--first N --last M]
        [--scale 0.94 --dy 60 --dx 0]   (used only when no --face_w is given)   [--wrap 0.35]  set bleed into the edge

Client, 10 Nov: Ahmad's white cloth replaced by a realistic Nitron gym, «والإضاءة تناسب كل الفيديوهات». Per frame:
  1. set      background scaled to cover 1080×1920, a touch of lens blur (depth of field: he is sharp, the room is not)
  2. place    by his face: centre and width as fractions of the frame. In dir mode the transform is fixed for the
              whole run (median face of the piece), so he does not jitter and every take lands in the same place;
              his body always reaches the bottom edge (never a floating cut-out)
  3. match    his exposure and contrast pulled toward the set, light falling off down his body
  4. rim      one subtle purple/lilac edge light from the LEDs behind him (run relight.py with --no-rim first)
  5. wrap     a little of the blurred set bleeds into his edges, so the edge carries the room's colour
  6. grain    one shared grain over the whole frame
--person-out also writes the placed, matched presenter (RGBA, frame coordinates) for text that passes behind him.
"""
import sys, os, glob, numpy as np, cv2

def arg(k, d, cast=float): return cast(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
P, BG, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SC, DY, DX, BL = arg("--scale", 0.94), arg("--dy", 60), arg("--dx", 0), arg("--blur", 2.2)
WRAP = arg("--wrap", 0.35)   # how much of the blurred set bleeds into his edge; 0.15 keeps a clean cut (EP04 v2: «القص بيغبش»)
FACE = [arg("--face_x", 0), arg("--face_y", 0), arg("--face_w", 0)]
POUT = arg("--person-out", "", str); F0, F1 = arg("--first", 0, int), arg("--last", 10**9, int)
W, H = 1080, 1920
PURPLE = np.array([138, 2, 118], np.float32) / 255; LIL = np.array([219, 125, 199], np.float32) / 255   # BGR
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

bg = cv2.imread(BG).astype(np.float32) / 255
s = max(W / bg.shape[1], H / bg.shape[0]); bg = cv2.resize(bg, (round(bg.shape[1] * s), round(bg.shape[0] * s)), interpolation=cv2.INTER_AREA)
y0, x0 = (bg.shape[0] - H) // 2, (bg.shape[1] - W) // 2; bg = bg[y0:y0 + H, x0:x0 + W]
set_ = cv2.GaussianBlur(bg, (0, 0), BL) if BL > 0 else bg
wrapsrc = cv2.GaussianBlur(bg, (0, 0), 18)
lum = bg.mean(2); sideL, sideR = float(lum[:, :W // 3].mean()), float(lum[:, 2 * W // 3:].mean())
setmean = bg.reshape(-1, 3).mean(0)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
GRAIN = np.random.default_rng(7).normal(0, 0.012, (H, W, 1)).astype(np.float32)

def face_of(rgba8):
    g = cv2.cvtColor(rgba8[..., :3], cv2.COLOR_BGR2GRAY)
    r = [q for q in casc.detectMultiScale(g, 1.08, 6, minSize=(120, 120)) if q[1] < 1100]
    if not r: return None
    x, y, w, h = max(r, key=lambda q: q[2]); return (x + w / 2, y + h / 2, w)

def fit(face, shape):
    """scale, dx, dy that put this face at FACE; the body is pulled down to the bottom edge if it would float"""
    if FACE[2] <= 0 or face is None: return SC, DX, DY
    fx, fy, fw = face; s = FACE[2] * W / fw; nw, nh = shape[1] * s, shape[0] * s
    dy = FACE[1] * H - fy * s - (H - nh)
    return s, FACE[0] * W - fx * s - (W - nw) / 2, max(dy, 0)

def place(rgba, T):
    s, dx, dy = T; h, w = rgba.shape[:2]; nw, nh = round(w * s), round(h * s)
    r = cv2.resize(rgba, (nw, nh), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
    canvas = np.zeros((H, W, 4), np.float32); x = int((W - nw) / 2 + dx); y = int(H - nh + dy)
    xs, ys = max(0, x), max(0, y); xe, ye = min(W, x + nw), min(H, y + nh)
    canvas[ys:ye, xs:xe] = r[ys - y:ye - y, xs - x:xe - x]; return canvas

def comp(rgba8, T):
    pr = place(rgba8.astype(np.float32) / 255, T); F, a = np.clip(pr[..., :3], 0, 1), np.clip(pr[..., 3], 0, 1)
    F = np.clip((F - 0.5) * 1.06 + 0.5 - 0.02, 0, 1)
    ys_ = np.where(a > 0.5)[0]; top = ys_.min() if len(ys_) else 0
    fall = np.clip((yy - (top + 0.45 * (H - top))) / (0.55 * (H - top)), 0, 1)
    F = F * (1 - 0.22 * fall)[..., None]
    F = F * 0.93 + setmean * 0.07 * F.mean(2, keepdims=True) / max(setmean.mean(), 1e-3)
    band = np.clip(a * (1 - cv2.GaussianBlur(a, (0, 0), 4)) * 2.2, 0, 1); band = cv2.GaussianBlur(band, (0, 0), 1.0)
    cx = (xx * a).sum() / max(a.sum(), 1)
    side = np.where(xx > cx, 0.35 + 0.65 * sideR / max(sideL, sideR), 0.35 + 0.65 * sideL / max(sideL, sideR))
    topw = 1 + 0.6 * np.clip(1 - (yy - top) / 500, 0, 1)
    rim = (band * side * topw * 0.30)[..., None]
    F = 1 - (1 - F) * (1 - rim * (0.55 * PURPLE + 0.45 * LIL))
    edge = np.clip(a * (1 - cv2.GaussianBlur(a, (0, 0), 4)) * 2.0, 0, 1)[..., None]
    F = F * (1 - WRAP * edge) + wrapsrc * WRAP * edge
    out = set_ * (1 - a[..., None]) + F * a[..., None]
    person = np.dstack([np.clip(F, 0, 1), a])
    return (np.clip(out + GRAIN, 0, 1) * 255 + 0.5).astype(np.uint8), (person * 255 + 0.5).astype(np.uint8)

if os.path.isdir(P):
    os.makedirs(OUT, exist_ok=True); fs = [f for f in sorted(glob.glob(os.path.join(P, "*.png"))) if F0 <= int(os.path.basename(f)[:5]) <= F1]
    faces = [face_of(cv2.imread(f, cv2.IMREAD_UNCHANGED)) for f in fs[::5]]; faces = np.array([f for f in faces if f is not None])
    T = fit(tuple(np.median(faces, axis=0)) if len(faces) else None, cv2.imread(fs[0], cv2.IMREAD_UNCHANGED).shape)
    print(f"{len(fs)} frames · face seen in {len(faces)} samples · transform scale {T[0]:.3f} dx {T[1]:.0f} dy {T[2]:.0f}")
    if POUT: os.makedirs(POUT, exist_ok=True)
    for f in fs:
        c, p = comp(cv2.imread(f, cv2.IMREAD_UNCHANGED), T); n = os.path.basename(f)[:-4]
        cv2.imwrite(os.path.join(OUT, n + ".jpg"), c, [cv2.IMWRITE_JPEG_QUALITY, 95])
        if POUT: cv2.imwrite(os.path.join(POUT, n + ".png"), p, [cv2.IMWRITE_PNG_COMPRESSION, 3])
    print(f"→ {OUT}")
else:
    im = cv2.imread(P, cv2.IMREAD_UNCHANGED); c, p = comp(im, fit(face_of(im), im.shape))
    cv2.imwrite(OUT, c, [cv2.IMWRITE_JPEG_QUALITY, 94]); print("→", OUT)
