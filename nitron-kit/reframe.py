"""Nitron kit — virtual camera for talking-head pieces.  python3 reframe.py <reel.json> [W0=400]

For every piece without "hold", samples the source clip every 0.2 s, finds his face (topmost Haar detection),
fills gaps, smooths the path over ~1.4 s and writes piece "track": [[t, x, y, z], ...] so build_cut.py holds his face
at the piece "target" with a face width of W0 px. Every piece then frames him the same way, so a cut between two
clips no longer jumps his face across the screen or changes its size (client, 5 Nov: «القطع بين اللقطات مو ظابط»).
A piece may set "z" (fixed zoom, pan-only camera: keeps his hands in shot) and "track_from": [x, y, z] — where the camera starts before his face is in shot (e.g. on the wrap);
the camera then moves from there to his face as it appears. Zoom stays within 1.0–1.45.
"""
import json, subprocess, sys, numpy as np, cv2
cfg = json.load(open(sys.argv[1])); W0 = float(sys.argv[2]) if len(sys.argv) > 2 else 400.0; FPS = 30
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def face(f, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(0, t):.3f}", "-i", f, "-frames:v", "1", "-vf", "scale=1080:1920",
                          "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    if not raw: return None   # past the end of the clip
    im = cv2.imdecode(np.frombuffer(raw, np.uint8), 1)
    if im is None: return None
    r = [q for q in casc.detectMultiScale(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), 1.08, 6, minSize=(150, 150)) if q[1] < 1000]
    if not r: return None
    x, y, w, h = min(r, key=lambda q: q[1]); return (x + w / 2, y + h / 2, w)

def smooth(v, k=7):
    p = np.pad(v, (k // 2, k // 2), mode="edge"); return np.convolve(p, np.ones(k) / k, mode="valid")

for p in cfg["pieces"]:
    if p.get("hold"): continue
    f = cfg["clips"][p["clip"]]["file"].replace("/sdr4k/", "/sdr/")   # detection on the 1080 copy: same 1080-space as build_cut
    lead = int(p.get("xfade", 0)) / FPS; ts = np.arange(-lead, p["b"] - p["a"] + 0.2001, 0.2)
    det = [face(f, p["a"] + t) for t in ts]
    ok = [i for i, d in enumerate(det) if d]
    if not ok: print(p["name"], "no face found, left untracked"); continue
    first = ok[0]; xs, ys, ws = (np.interp(range(len(ts)), ok, [det[i][c] for i in ok]) for c in range(3))
    xs, ys, ws = smooth(xs), smooth(ys), smooth(ws)
    zs = np.full(len(ts), float(p["z"])) if p.get("z") else np.clip(W0 / ws, 1.0, 1.45)   # "z": one zoom for the piece (pan only: hands stay in shot)
    K = [[round(float(t), 3), round(float(x), 1), round(float(y), 1), round(float(z), 3)] for t, x, y, z in zip(ts, xs, ys, zs)]
    if p.get("track_from"):   # the camera starts on the given point and travels to his face as it appears
        x0, y0, z0 = p["track_from"]; K = [[round(float(ts[0]), 3), x0, y0, z0]] + K[max(first, 1):]
    p["track"] = K; print(f"{p['name']}: {len(ok)}/{len(ts)} samples with a face, zoom {zs.min():.2f}–{zs.max():.2f}")
json.dump(cfg, open(sys.argv[1], "w"), indent=1)
