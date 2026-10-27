#!/usr/bin/env python3
"""Linux stand-in for personmask.swift: personmask <srcDir> <maskDir> [mode] [x]
Writes <maskDir>/<name>.png (L8 alpha, frame size) + meta.json [{f, face:{x,y,w,h}}]."""
import sys, os, json, glob, numpy as np, cv2, onnxruntime as ort
src, dst = sys.argv[1], sys.argv[2]; os.makedirs(dst, exist_ok=True)
MODEL = os.environ.get("SEG_MODEL", "/root/models/seg/u2net_human_seg.onnx")
so = ort.SessionOptions(); so.intra_op_num_threads = 4; so.enable_cpu_mem_arena = False; so.enable_mem_pattern = False
sess = ort.InferenceSession(MODEL, so, providers=["CPUExecutionProvider"])
iname = sess.get_inputs()[0].name; isz = sess.get_inputs()[0].shape[2]
isz = isz if isinstance(isz, int) else 320
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
files = sorted(glob.glob(os.path.join(src, "*.jpg")))
num = [int(os.path.basename(f)[:-4]) for f in files]
mean, std = np.array([0.485, 0.456, 0.406]), np.array([0.229, 0.224, 0.225])

def seg(img):
    h, w = img.shape[:2]
    x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (isz, isz), interpolation=cv2.INTER_AREA).astype(np.float32) / 255.0
    x = ((x - mean) / std).transpose(2, 0, 1)[None].astype(np.float32)
    p = sess.run(None, {iname: x})[0][0, 0]
    if "birefnet" in MODEL.lower(): p = 1 / (1 + np.exp(-p))
    else: p = (p - p.min()) / (p.max() - p.min() + 1e-8)
    return cv2.resize(p, (w, h), interpolation=cv2.INTER_CUBIC).clip(0, 1)

def guided(I, p, r, eps):
    bf = lambda a: cv2.boxFilter(a, -1, (2 * r + 1, 2 * r + 1))
    mI, mp = bf(I), bf(p); cIp = bf(I * p) - mI * mp; vI = bf(I * I) - mI * mI
    a = cIp / (vI + eps); b = mp - a * mI
    return bf(a) * I + bf(b)

raw, grays, faces = [], [], []
for f in files:
    img = cv2.imread(f); raw.append(seg(img))
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY); grays.append(g.astype(np.float32) / 255.0)
    sm = cv2.resize(g, (540, 960)); d = casc.detectMultiScale(sm, 1.1, 5, minSize=(60, 60))
    faces.append(max(d, key=lambda r: r[2]) * 2 if len(d) else None)
# fill face gaps from nearest detection, then smooth boxes over ±3 frames
idx = [i for i, fc in enumerate(faces) if fc is not None]
for i in range(len(faces)):
    if faces[i] is None and idx: faces[i] = faces[min(idx, key=lambda j: abs(j - i))]
fa = np.array([fc if fc is not None else [0, 0, 0, 0] for fc in faces], dtype=np.float32)
meta = []
for i, f in enumerate(files):
    # temporal stabilisation (playbook 4.3): weighted ±2 window, less smoothing where it moves fast
    acc = np.zeros_like(raw[i]); ws = 0
    for k, w in {-2: 1, -1: 2, 0: 3, 1: 2, 2: 1}.items():
        j = i + k   # only true neighbours in time (ranges are not contiguous)
        if not (0 <= j < len(raw)) or num[j] - num[i] != k: continue
        acc += raw[j] * w; ws += w
    A = acc / ws; M = raw[i]; fk = np.clip((np.abs(M - A) - .18) / .30, 0, 1); m = A + (M - A) * fk
    g = grays[i]; h, w = g.shape
    gs, ms = cv2.resize(g, (w // 2, h // 2)), cv2.resize(m.astype(np.float32), (w // 2, h // 2))
    m = cv2.resize(guided(gs, ms, 6, 2e-3), (w, h), interpolation=cv2.INTER_LINEAR)
    m = np.clip((m - .30) / .45, 0, 1)
    # keep the speaker only: largest blob (drops shelf fragments the model sometimes picks up)
    n, lab, st, _ = cv2.connectedComponentsWithStats((m > .5).astype(np.uint8), 8)
    if n > 2:
        keep = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
        blob = cv2.dilate((lab == keep).astype(np.uint8), np.ones((31, 31), np.uint8)).astype(np.float32)
        m = m * cv2.GaussianBlur(blob, (0, 0), 6)
    cv2.imwrite(os.path.join(dst, os.path.basename(f)[:-4] + ".png"), (m * 255).astype(np.uint8))
    row = {"f": os.path.basename(f)}
    if fa[i, 2] > 0:
        nb = [j for j in range(max(0, i - 3), min(len(files), i + 4)) if abs(num[j] - num[i]) <= 3 and fa[j, 2] > 0]
        x, y, bw, bh = np.median(fa[nb], axis=0)
        row["face"] = {"x": float(x), "y": float(y), "w": float(bw), "h": float(bh)}
    meta.append(row)
json.dump(meta, open(os.path.join(dst, "meta.json"), "w"))
print("masks:", len(meta))
