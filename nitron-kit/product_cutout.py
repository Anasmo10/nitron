"""Nitron kit — product packshot → transparent PNG for the glass product card and the cover.
python3 product_cutout.py <photo> <out.png> [model.onnx]
BiRefNet-lite mask (1024²), soft edge, white fringe pulled back toward the product colour, cropped to the product."""
import sys, numpy as np, cv2, onnxruntime as ort
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "/root/models/seg/birefnet-lite.onnx"
im = cv2.cvtColor(cv2.imread(src), cv2.COLOR_BGR2RGB); H, W = im.shape[:2]
x = cv2.resize(im, (1024, 1024), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
s = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
y = s.run(None, {s.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[-1][0, 0]
m = 1 / (1 + np.exp(-y)) if y.min() < 0 or y.max() > 1 else y
m = cv2.resize(m.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
b = (m > 0.5).astype(np.uint8)
k, lab, st, _ = cv2.connectedComponentsWithStats(b, 8)
big = [i for i in range(1, k) if st[i, cv2.CC_STAT_AREA] > 0.02 * st[1:, cv2.CC_STAT_AREA].max()]   # several rolls = several blobs
keep = np.isin(lab, big).astype(np.float32)
a = np.clip(cv2.GaussianBlur(np.minimum(m, keep + 0.0) * keep, (0, 0), 0.8), 0, 1)
# de-fringe: on the soft edge, the white studio background bleeds in — divide it out
rgb = im.astype(np.float32) / 255
af = np.maximum(a, 1e-3)[..., None]
rgb = np.where(a[..., None] < 0.98, np.clip((rgb - (1 - af) * 1.0) / af, 0, 1), rgb)
o = np.dstack([(rgb * 255).astype(np.uint8), (a * 255).astype(np.uint8)])
ys, xs = np.where(a > 0.1); pad = 6
o = o[max(0, ys.min() - pad):ys.max() + pad + 1, max(0, xs.min() - pad):xs.max() + pad + 1]
Image.fromarray(o).save(out); print("→", out, o.shape[1], "x", o.shape[0])
