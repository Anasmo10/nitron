"""Nitron kit — sound for a motion-graphics film (no voice): the Nitron house track + synthesised SFX → −14 LUFS → muxed.
python3 motion_mix.py <proj>        reads <proj>/timeline.json, <proj>/sfx_plan.json, <proj>/renders/video.mp4
writes <proj>/renders/music_sfx.wav and <proj>/renders/final.mp4

sfx_plan.json = {"music_at": track second at film t=0 (optional; default: bar-aligned near the track's strong section),
                 "transitions": true (a whoosh on every scene start), "events": [[kind, t, gain, ...args]]}
kinds: whoosh(f0,f1,dur) · impact(f0) · stamp · pop(freq) · click · ding · riser(dur) · shimmer(dur) · tick
Voiceover (optional): <proj>/vo/place.json {line_id: start s} + <proj>/vo/<line_id>.wav — music ducks 10 dB under it and sits
"music_db" (default −22) LU under the voice (K-weighted); SFX drop further."""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt
SR = 48000; P = sys.argv[1].rstrip("/"); K = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(P + "/timeline.json")); plan = json.load(open(P + "/sfx_plan.json")) if os.path.exists(P + "/sfx_plan.json") else {}
DUR = tl["duration"]; N = int((DUR + 0.3) * SR); rng = np.random.default_rng(11)
def tt(d): return np.arange(int(d * SR)) / SR
def filt(x, kind, f, o=2): return sosfilt(butter(o, f, btype=kind, fs=SR, output="sos"), x, axis=0)
def sat(x, d): return np.tanh(d * x) / np.tanh(d)
def sweep_bp(x, f0, f1, q=1.1, blk=512):
    y = np.zeros_like(x); zi = None; nb = int(np.ceil(len(x) / blk))
    for b in range(nb):
        f = f0 * (f1 / f0) ** (b / max(1, nb - 1)); lo, hi = f / (1 + 1 / (2 * q)), min(f * (1 + 1 / (2 * q)), SR / 2 - 100)
        s = butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        if zi is None: zi = np.zeros((s.shape[0], 2))
        y[b * blk:(b + 1) * blk], zi = sosfilt(s, x[b * blk:(b + 1) * blk], zi=zi)
    return y
def whoosh(d=0.36, f0=400, f1=3200):
    t = tt(d); e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6; return sweep_bp(rng.standard_normal(len(t)), f0, f1) * e
def impact(f0=58, d=1.0):
    t = tt(d); f = f0 * 0.62 + f0 * 0.38 * np.exp(-t / 0.08); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.30)
    return sat(s + filt(rng.standard_normal(len(t)) * np.exp(-t / 0.05), "low", 2200) * 0.5, 1.5)
def stamp():
    t = tt(0.16); return np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.035) + 0.8 * filt(rng.standard_normal(len(t)) * np.exp(-t / 0.010), "band", [600, 3500])
def pop(f0=820):
    t = tt(0.09); f = f0 * 0.45 + f0 * 0.55 * np.exp(-t / 0.018); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03)
def click():
    t = tt(0.06); return filt(rng.standard_normal(len(t)) * np.exp(-t / 0.0025), "band", [1800, 6000])
def tick():
    t = tt(0.03); return np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.006)
def ding(fs=(1318.5, 1975.5)):
    t = tt(0.6); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t / (0.22 if i == 0 else 0.12)) * (1 if i == 0 else 0.45) for i, f in enumerate(fs))
def riser(d=1.0):
    t = tt(d); return sweep_bp(rng.standard_normal(len(t)), 300, 7000, q=0.9) * (t / d) ** 2.2
def shimmer(d=0.55):
    t = tt(d); x = filt(rng.standard_normal(len(t)), "high", 6500) * np.sin(np.pi * t / d) ** 2 * 0.6
    for f, dt in [(1174.7, 0.0), (1760.0, 0.07), (2349.3, 0.14)]: x += (t >= dt) * np.sin(2 * np.pi * f * (t - dt)) * np.exp(-np.clip(t - dt, 0, None) / 0.18) * 0.35
    return x
S = np.zeros((N, 2))
def at(t, sig, g=1.0, pan=0.0, anchor_end=False):
    sig = sig if sig.ndim == 2 else np.stack([sig * np.sqrt(0.5 * (1 - pan)), sig * np.sqrt(0.5 * (1 + pan))], 1) * np.sqrt(2)
    i = int((t - (len(sig) / SR if anchor_end else 0)) * SR)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); S[i:j] += sig[:j - i] * g
if plan.get("transitions", True):
    for sc in tl["scenes"]:
        if sc.get("transition") and sc["start"] > 0.05: w = whoosh(0.42, 500, 4200); at(sc["start"] - 0.21, w, 0.30)
for e in plan.get("events", []):
    k, t, g = e[0], e[1], e[2]; a = e[3:]
    sig = {"whoosh": lambda: whoosh(a[2] if len(a) > 2 else 0.36, a[0] if a else 400, a[1] if len(a) > 1 else 3200), "impact": lambda: impact(a[0] if a else 58),
           "stamp": stamp, "pop": lambda: pop(a[0] if a else 820), "click": click, "tick": tick, "ding": ding,
           "riser": lambda: riser(a[0] if a else 1.0), "shimmer": lambda: shimmer(a[0] if a else 0.55)}[k]()
    at(t, sig, g, anchor_end=(k == "riser"))
# ── the house track, bar-aligned ──
mj = json.load(open(K + "/music/music.json")); track = K + "/music/" + mj["file"]
if not os.path.exists(track): sys.exit("house track missing: put it at nitron-kit/music/nitron_music.wav")
Pb = mj["beat_period"]; off = plan.get("music_at")
if off is None: k_ = round((mj["hot"] - 3.0 - mj["beat0"]) / Pb / 4) * 4; off = mj["beat0"] + k_ * Pb
raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{off:.4f}", "-stream_loop", "-1", "-i", track, "-t", f"{N / SR:.4f}", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
M = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64); M = np.pad(M, ((0, max(0, N - len(M))), (0, 0)))[:N]
fi = int(0.25 * SR); M[:fi] *= np.linspace(0, 1, fi)[:, None]; fo = int(1.6 * SR); M[N - fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
M = M / np.abs(M).max() * 0.55; Sx = S / max(1e-9, np.abs(S).max()) * 0.5
# ── voiceover (vo/lines.json + vo/place.json + vo/<id>.wav): music ducks under it, house level 22 LU below the voice ──
V = np.zeros(N); vo_ok = os.path.exists(P + "/vo/place.json")
if vo_ok:
    place = json.load(open(P + "/vo/place.json"))
    for lid, t0 in place.items():
        f = P + f"/vo/{lid}.wav"
        if not os.path.exists(f): continue
        r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
        x = np.frombuffer(r, np.float32).astype(np.float64); i = int(t0 * SR); j = min(N, i + len(x)); V[i:j] += x[:j - i]
    hop = 480; env = np.sqrt(np.convolve(V ** 2, np.ones(hop) / hop, "same")); act = (env > 0.012).astype(float)
    ka, kr = np.exp(-1 / (0.015 * SR)), np.exp(-1 / (0.60 * SR)); d = np.zeros(N); y = 0.0
    for i in range(0, N, hop):
        tg = act[i]; y = tg + (y - tg) * ((ka if tg > y else kr) ** hop); d[i:i + hop] = y
    duck = 10 ** (-10.0 * d / 20); sp = np.repeat(act[::hop], hop)[:N] > 0.5
    def kw(x): y_ = filt(x, "high", 60); return y_ + 0.58 * filt(y_, "high", 1500)
    r = lambda x, m: 10 * np.log10((x[m] ** 2).mean() + 1e-12)
    if sp.any():
        MG = 10 ** ((float(plan.get("music_db", -22.0)) - (r(kw((M * duck[:, None]).mean(1)), sp) - r(kw(V), sp))) / 20); M = M * duck[:, None] * MG
    Sx = Sx * 0.55
mix = np.clip(M * 1.0 + Sx * float(plan.get("sfx_gain", 0.55)) + np.stack([V, V], 1), -0.98, 0.98)
os.makedirs(P + "/renders", exist_ok=True); wav = P + "/renders/music_sfx.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", wav], input=(mix * 32767).astype("<i2").tobytes(), check=True)
vid = P + "/renders/video.mp4"; out = P + "/renders/final.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", wav, "-filter_complex", "[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]", "-map", "0:v", "-map", "[a]",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out], check=True)
print(f"music from {off:.2f}s · {len(plan.get('events', []))} sfx · → {out}")
