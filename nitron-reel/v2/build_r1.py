# Reel #1 v2: put back the wrap-tightening (source 5.454–6.421, cut before as silence) as a hands close-up
# that pulls back to the old framing, shift everything after it by 29 frames, rebuild the voice per kit rules.
import json, os, shutil, subprocess, numpy as np, cv2
O = "/home/user/work/work"; R = "/home/user/work/r1"; SRC = O + "/src.mov"
FPS = 30; INS = 29; D = INS / FPS                       # inserted time (exact frames)
B2_OLD = 6.421; B2_NEW = B2_OLD - D; CUT = 4.382          # piece 2 now starts earlier in the source
KEEP = [[0.619021, 5.00144], [B2_NEW, 11.6424], [12.1108, 16.7485]]
os.makedirs(R + "/vfr", exist_ok=True)
# ── frames: old 1..132 · new 133..175 (camera move) · old 147.. → +29
for n in range(1, 133): shutil.copy(f"{O}/vfr/{n:05d}.jpg", f"{R}/vfr/{n:05d}.jpg")
for n in range(147, 428): shutil.copy(f"{O}/vfr/{n:05d}.jpg", f"{R}/vfr/{n+INS:05d}.jpg")
src_t = lambda n: B2_NEW + ((n - 1) / FPS - CUT)          # new frame n (≥133) → source time
need = sorted({round(src_t(n) * FPS) for n in range(133, 176)})
tmp = R + "/_src"; os.makedirs(tmp, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vf",
    f"select='between(n,{need[0]},{need[-1]})',colorchannelmixer=rr=0.975:gg=1.000:bb=1.04,format=rgb24",
    "-vsync", "0", "-start_number", str(need[0]), tmp + "/%05d.png"], check=True)
OLD = (80.0, 85.0, 2000.0, 3554.0)                        # 03_cut_zoom crop for piece 2 (zoom 1.08, anchor 0.30)
def hand_rect(s):                                          # 2× close-up that follows the hands, clamped to the frame
    u = min(1, max(0, (s - 5.47) / 0.80)); cx = 1330 + 150 * u; z = 2.0 + 0.08 * u
    w = 2160 / z; h = 3840 / z; cy = min(3840 - h / 2, 2900)
    return (min(max(cx - w / 2, 0), 2160 - w), cy - h / 2, w, h)
def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def rect(s):
    a = hand_rect(min(s, 6.22)); k = ease((s - 6.22) / 0.62)       # pull back 6.22 → 6.84 as he starts talking
    if k <= 0: return a
    za, zb = 2160 / a[2], 2160 / OLD[2]; z = np.exp(np.log(za) + (np.log(zb) - np.log(za)) * k)
    ca = (a[0] + a[2] / 2, a[1] + a[3] / 2); cb = (OLD[0] + OLD[2] / 2, OLD[1] + OLD[3] / 2)
    cx = ca[0] + (cb[0] - ca[0]) * k; cy = ca[1] + (cb[1] - ca[1]) * k
    if k >= 1: return OLD
    w = 2160 / z; h = OLD[3] / OLD[2] * w
    return (min(max(cx - w / 2, 0), 2160 - w), min(max(cy - h / 2, 0), 3840 - h), w, h)
for n in range(133, 176):
    s = src_t(n); im = cv2.imread(f"{tmp}/{round(s*FPS):05d}.png"); x, y, w, h = rect(s)
    M = np.float32([[1080 / w, 0, -x * 1080 / w], [0, 1920 / h, -y * 1920 / h]])
    cv2.imwrite(f"{R}/vfr/{n:05d}.jpg", cv2.warpAffine(im, M, (1080, 1920), flags=cv2.INTER_AREA if w > 1500 else cv2.INTER_LANCZOS4),
                [cv2.IMWRITE_JPEG_QUALITY, 95])
N = len(os.listdir(R + "/vfr")); print("frames", N, "→", N / FPS)
# ── person layers / behind.json: hook 1–92 and «طبقات» unchanged, «أبداً» 370–406 → 399–435
for sub in ("person", "mask"):
    os.makedirs(f"{R}/bt/{sub}", exist_ok=True)
    for n in list(range(1, 133)) + list(range(370, 407)):
        m = n if n < 133 else n + INS; shutil.copy(f"{O}/bt/{sub}/{n:05d}.png", f"{R}/bt/{sub}/{m:05d}.png")
for f in os.listdir(O + "/bt"):
    if f.startswith("umask"): shutil.copy(f"{O}/bt/{f}", f"{R}/bt/{f}")
b = json.load(open(O + "/behind.json"))
b["ranges"] = [[1, 132], [399, 435]]; b["hook"] = [1, 92]; b["wall"] = [399, 435]
b["faces"] = {str(int(k) if int(k) < 133 else int(k) + INS): v for k, v in b["faces"].items() if int(k) < 133 or int(k) >= 370}
json.dump(b, open(R + "/behind.json", "w"), ensure_ascii=False)
# ── captions: everything after the insert moves by D
sh = lambda t: t + D if t >= CUT - 1e-6 else t
c = json.load(open(O + "/caps.json"))
for cd in c["cards"]:
    cd["s"] = sh(cd["s"]); cd["e"] = sh(cd["e"])
    for w in cd["w"]: w["s"] = sh(w["s"]); w["e"] = sh(w["e"])
c["total"] = round(c["total"] + D, 6); json.dump(c, open(R + "/caps.json", "w"), ensure_ascii=False)
json.dump({"keep": KEEP, "total": c["total"], "src_dur": 17.34}, open(R + "/cut.json", "w"))
# ── voice (kit rule): 48 kHz, highpass 70, same speech RMS for every piece, 6 ms fades
SR = 48000; pcs = []; tot = 0
for i, (a, e) in enumerate(KEEP):
    n0 = round(sum(k[1] - k[0] for k in KEEP[:i]) * SR); L = round(sum(k[1] - k[0] for k in KEEP[:i + 1]) * SR) - n0
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a}", "-i", SRC, "-t", f"{e-a+0.05:.5f}", "-vn", "-ac", "1", "-ar", str(SR),
                          "-af", "highpass=f=70", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).copy(); x = np.pad(x, (0, max(0, L - len(x))))[:L]
    fr = x[:len(x) // 480 * 480].reshape(-1, 480); r = np.sqrt((fr ** 2).mean(1)); act = r[r > np.percentile(r, 60)]
    g = 0.08 / (act.mean() + 1e-9); x *= g; f = int(0.006 * SR); ramp = np.linspace(0, 1, f); x[:f] *= ramp; x[-f:] *= ramp[::-1]
    pcs.append(x); print("piece", i + 1, round(L / SR, 3), "s gain", round(g, 2))
v = np.clip(np.concatenate(pcs), -0.98, 0.98)
open(R + "/voice.f32", "wb").write(v.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", R + "/voice.f32", R + "/voice.wav"], check=True)
print("voice", round(len(v) / SR, 3), "caps total", c["total"])
