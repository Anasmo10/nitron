"""Nitron kit — cooler, cleaner, clearer colour on the cut-out presenter (only the person, never the backdrop).
python3 cleancool.py <in dir of RGBA person PNGs> <out dir> [first] [last] [--level A|B]

Client, 8 Nov: «اللون الأصفر كثير، بدي بشرة أنقى ولون أبرد وشكل أوضح», on the person's colour only.
Measured on v5: face b* +27…+30 (yellow), a* +14, sweater b* +17. Per frame, inside his alpha:
  1. cooler balance   Lab b* scaled and pulled down on the whole person; extra on skin (yellow out), a touch less red
  2. cleaner skin     edge-preserving smoothing on skin only, with part of the fine texture put back (no plastic look)
  3. clearer          fine unsharp mask on eyes, brows, hair, beard and clothes; light on skin
Level A: face b* ≈ +19, B: ≈ +15 (colder). The alpha is untouched.
"""
import sys, os, glob, cv2, numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
ARGS = [a for a in sys.argv[3:] if not a.startswith("--") and a not in ("A", "B")]
A0 = int(ARGS[0]) if ARGS else 0; A1 = int(ARGS[1]) if len(ARGS) > 1 else 10**9
LEVEL = sys.argv[sys.argv.index("--level") + 1] if "--level" in sys.argv else "A"
K = {"A": dict(bs=0.85, bo=-4.0, skin_b=0.88, skin_a=0.90, smooth=0.60, sharp=0.55),
     "B": dict(bs=0.80, bo=-6.0, skin_b=0.85, skin_a=0.88, smooth=0.65, sharp=0.65)}[LEVEL]

def skin_mask(bgr8, a):
    ycc = cv2.cvtColor(bgr8, cv2.COLOR_BGR2YCrCb); Y, Cr, Cb = [ycc[..., i].astype(np.float32) for i in range(3)]
    m = ((Cr > 133) & (Cr < 180) & (Cb > 77) & (Cb < 130) & (Y > 60)).astype(np.float32)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 4) * a

def process(bgr8, a):
    sk = skin_mask(bgr8, a)
    # 2) cleaner skin: bilateral base + 35% of the fine detail back, blended on skin only
    f = bgr8.astype(np.float32)
    base = cv2.bilateralFilter(bgr8, 9, 28, 7).astype(np.float32)
    detail = f - cv2.GaussianBlur(f, (0, 0), 1.2)
    clean = base + 0.35 * detail
    f = f + (clean - f) * (sk * K["smooth"])[..., None]
    # 1) cooler balance in Lab
    lab = cv2.cvtColor(f.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
    A_, B_ = lab[..., 1] - 128, lab[..., 2] - 128
    B2 = B_ * K["bs"] + K["bo"]; B2 = B2 + (B2 * K["skin_b"] - B2) * sk          # yellow out, more on skin
    A2 = A_ + (A_ * K["skin_a"] - A_) * sk                                      # a little less red on skin
    lab[..., 1] = (A_ + (A2 - A_) * a + 128); lab[..., 2] = (B_ + (B2 - B_) * a + 128)
    f = cv2.cvtColor(lab.clip(0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
    # 3) clearer: fine unsharp mask, light on skin, kept off the cut-out edge
    inner = cv2.GaussianBlur(cv2.erode(a, np.ones((9, 9), np.uint8)), (0, 0), 3)
    amt = K["sharp"] * (1 - 0.7 * sk) * inner
    f = f + (f - cv2.GaussianBlur(f, (0, 0), 1.4)) * amt[..., None]
    return f.clip(0, 255).astype(np.uint8)

files = [f for f in sorted(glob.glob(os.path.join(SRC, "*.png"))) if A0 <= int(os.path.basename(f)[:5]) <= A1]
os.makedirs(DST, exist_ok=True)
for f in files:
    im = cv2.imread(f, cv2.IMREAD_UNCHANGED); a = im[..., 3].astype(np.float32) / 255
    cv2.imwrite(os.path.join(DST, os.path.basename(f)), np.dstack([process(im[..., :3], a), im[..., 3]]))
print(f"level {LEVEL}: {len(files)} frames → {DST}")
