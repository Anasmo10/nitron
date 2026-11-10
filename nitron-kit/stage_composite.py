"""Nitron kit — put a cut-out presenter into a generated set (e.g. a Higgsfield background) so it reads as one photograph.
python3 stage_composite.py <person RGBA png or dir> <background image> <out jpg or dir> [--scale 0.94] [--dy 60] [--dx 0] [--blur 2.2]

Client, 10 Nov: Ahmad's white cloth replaced by a realistic Nitron set, «والإضاءة تناسب كل الفيديوهات». Per frame:
  1. set      background scaled to cover 1080×1920, a touch of lens blur (depth of field: he is sharp, the wall is not)
  2. match    the presenter's exposure and contrast pulled toward the set (a dark room is not lit like a white sheet),
              light falling off down his body (the key is high, front-left)
  3. rim      purple/lilac edge light from the LED strips behind him, strongest on the side the set is brightest
  4. wrap     a little of the blurred set bleeds into his edges (light wrap), so the edge carries the room's colour
  5. grain    one shared grain over the whole frame, so set and person have the same texture
Run relight.py and cleancool.py on the person first (house look); this script only does the set-matching.
"""
import sys, os, glob, numpy as np, cv2

def arg(k, d): return float(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else d
P, BG, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SC, DY, DX, BL = arg("--scale", 0.94), arg("--dy", 60), arg("--dx", 0), arg("--blur", 2.2)
FACE = [arg("--face_x", 0), arg("--face_y", 0), arg("--face_w", 0)]   # place by his face: centre x, centre y, width (fractions of the frame)
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
W, H = 1080, 1920
PURPLE = np.array([138, 2, 118], np.float32) / 255; LIL = np.array([219, 125, 199], np.float32) / 255   # BGR

bg = cv2.imread(BG).astype(np.float32) / 255
s = max(W / bg.shape[1], H / bg.shape[0]); bg = cv2.resize(bg, (round(bg.shape[1] * s), round(bg.shape[0] * s)), interpolation=cv2.INTER_AREA)
y0, x0 = (bg.shape[0] - H) // 2, (bg.shape[1] - W) // 2; bg = bg[y0:y0 + H, x0:x0 + W]
set_ = cv2.GaussianBlur(bg, (0, 0), BL) if BL > 0 else bg
wrapsrc = cv2.GaussianBlur(bg, (0, 0), 18)
# where the set is bright/purple on each side → rim colour and strength per side
lum = bg.mean(2); sideL, sideR = float(lum[:, :W // 3].mean()), float(lum[:, 2 * W // 3:].mean())
setmean = bg.reshape(-1, 3).mean(0)

def face_fit(rgba):
    g = cv2.cvtColor((rgba[..., :3] * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    r = casc.detectMultiScale(g, 1.08, 6, minSize=(120, 120))
    if len(r) == 0: return SC, DX, DY
    x, y, w, h = max(r, key=lambda q: q[2]); s = FACE[2] * W / w
    fx, fy = (x + w / 2) * s, (y + h / 2) * s; nw, nh = rgba.shape[1] * s, rgba.shape[0] * s
    dy = FACE[1] * H - fy - (H - nh)
    if dy < 0: dy = 0   # his body always reaches the bottom of the frame (never a floating cut-out)
    return s, FACE[0] * W - fx - (W - nw) / 2, dy
def place(rgba):
    global SC, DX, DY
    if FACE[2] > 0: SC, DX, DY = face_fit(rgba)
    h, w = rgba.shape[:2]; nw, nh = round(w * SC), round(h * SC)
    r = cv2.resize(rgba, (nw, nh), interpolation=cv2.INTER_AREA)
    canvas = np.zeros((H, W, 4), np.float32); x = int((W - nw) / 2 + DX); y = int(H - nh + DY)
    xs, ys = max(0, x), max(0, y); xe, ye = min(W, x + nw), min(H, y + nh)
    canvas[ys:ye, xs:xe] = r[ys - y:ye - y, xs - x:xe - x]; return canvas

def comp(rgba8):
    pr = place(rgba8.astype(np.float32) / 255); F, a = pr[..., :3], pr[..., 3]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # 2) match: a white-sheet exposure → a dark room. Slightly lower the overall level, deepen the blacks, fall-off down the body
    F = np.clip((F - 0.5) * 1.06 + 0.5 - 0.02, 0, 1)
    ys_ = np.where(a > 0.5)[0]; top = ys_.min() if len(ys_) else 0
    fall = np.clip((yy - (top + 0.45 * (H - top))) / (0.55 * (H - top)), 0, 1)
    F = F * (1 - 0.22 * fall)[..., None]
    F = F * 0.93 + setmean * 0.07 * F.mean(2, keepdims=True) / max(setmean.mean(), 1e-3)   # a breath of the room's colour
    # 3) rim from the LEDs behind: an inner edge band, weighted to the brighter side and the top
    band = np.clip(a * (1 - cv2.GaussianBlur(a, (0, 0), 4)) * 2.2, 0, 1); band = cv2.GaussianBlur(band, (0, 0), 1.0)
    cx = (xx * a).sum() / max(a.sum(), 1)
    side = np.where(xx > cx, 0.35 + 0.65 * sideR / max(sideL, sideR), 0.35 + 0.65 * sideL / max(sideL, sideR))
    topw = 1 + 0.6 * np.clip(1 - (yy - top) / 500, 0, 1)
    rim = (band * side * topw * 0.30)[..., None]
    rimcol = 0.55 * PURPLE + 0.45 * LIL
    F = 1 - (1 - F) * (1 - rim * rimcol)
    # 4) light wrap: the blurred set bleeds into the outer pixels of his edge
    edge = np.clip(a * (1 - cv2.GaussianBlur(a, (0, 0), 4)) * 2.0, 0, 1)[..., None]
    F = F * (1 - 0.35 * edge) + wrapsrc * 0.35 * edge
    out = set_ * (1 - a[..., None]) + F * a[..., None]
    # 5) one grain for the whole frame
    g = np.random.default_rng(7).normal(0, 0.012, (H, W, 1)).astype(np.float32)
    return (np.clip(out + g, 0, 1) * 255 + 0.5).astype(np.uint8)

if os.path.isdir(P):
    os.makedirs(OUT, exist_ok=True); fs = sorted(glob.glob(os.path.join(P, "*.png")))
    for f in fs: cv2.imwrite(os.path.join(OUT, os.path.basename(f)[:-4] + ".jpg"), comp(cv2.imread(f, cv2.IMREAD_UNCHANGED)), [cv2.IMWRITE_JPEG_QUALITY, 94])
    print(f"{len(fs)} frames → {OUT}")
else:
    cv2.imwrite(OUT, comp(cv2.imread(P, cv2.IMREAD_UNCHANGED)), [cv2.IMWRITE_JPEG_QUALITY, 94]); print("→", OUT)
