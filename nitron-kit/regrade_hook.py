"""Nitron kit — lighting pass on low-res real footage (the injury clip).  python3 regrade_hook.py <in dir> <out dir> [--preview out.png]
The first grade crushed his dark skin into the black trousers and pushed the red plates. This opens the shadows with a
local-contrast lift (CLAHE on lightness), rolls the highlights, takes the red plates down, cools the shadows towards
the series' purple and adds a soft top light and vignette so the eye goes to him."""
import sys, os, glob, cv2, numpy as np
SRC, DST = sys.argv[1], sys.argv[2]; PREVIEW = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(6, 10))
def grade(im):
    h, w = im.shape[:2]; lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB); L = lab[..., 0]
    L2 = clahe.apply(L).astype(np.float32); L = 0.55 * L.astype(np.float32) + 0.45 * L2
    L = np.interp(L, [0, 30, 128, 210, 255], [4, 32, 130, 206, 242])          # open shadows, roll highlights
    lab[..., 0] = L.clip(0, 255).astype(np.uint8); out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR).astype(np.float32) / 255
    hsv = cv2.cvtColor((out * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    red = ((hsv[..., 0] < 14) | (hsv[..., 0] > 168)).astype(np.float32) * (hsv[..., 1] > 90)
    hsv[..., 1] *= 1 - 0.22 * cv2.GaussianBlur(red, (0, 0), 3)             # calm the red plates
    hsv[..., 1] *= 0.92
    out = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) / 255
    lum = out.mean(2, keepdims=True); out += (1 - lum / 0.3).clip(0, 1) * np.array([0.03, -0.006, 0.018], np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    top = np.exp(-(((xx - 0.38 * w) / (0.55 * w)) ** 2 + ((yy - 0.30 * h) / (0.45 * h)) ** 2))
    vig = (((xx - w / 2) / (0.75 * w)) ** 2 + ((yy - 0.45 * h) / (0.75 * h)) ** 2)
    out *= (1 + 0.08 * top - 0.30 * vig.clip(0, 1))[..., None]
    return (out.clip(0, 1) * 255 + 0.5).astype(np.uint8)
fs = sorted(glob.glob(os.path.join(SRC, "*.jpg"))); os.makedirs(DST, exist_ok=True)
for f in fs:
    im = cv2.imread(f); g = grade(im)
    if PREVIEW: cv2.imwrite(PREVIEW, np.hstack([im, g])); print("preview", PREVIEW); break
    cv2.imwrite(os.path.join(DST, os.path.basename(f)), g, [cv2.IMWRITE_JPEG_QUALITY, 95])
print("graded", len(fs), "frames")
