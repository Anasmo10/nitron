"""EP03: every on-camera take is framed from the 4K original, so Ahmad is bigger and the edges of the raw frame (where his
shoulders and arms are cut) stay OUTSIDE the 9:16 frame. Client, 11 Nov: «كبّر أحمد بحيث يكون هو فعلاً جوّا الفريم».
face (cx, cy, w) = median of the spoken part, fractions of the raw frame. Target: face width 0.42·W, centre (540, 730).
The scaled raw frame must cover the output on the left, right and bottom; above his head it may end (cloth is smeared up)."""
import json, subprocess, sys
T = {  # take: (cx, cy, w, s or None)
 '7386': (0.575, 0.215, 0.362, None), '7398': (0.45, 0.235, 0.445, 1.0), '7399': (0.31, 0.53, 0.544, 1.0),
 '7411': (0.395, 0.300, 0.340, None), '7416': (0.472, 0.374, 0.375, None)}
out = {}
for n, (cx, cy, w, s) in T.items():
    s = s or max(1.0, 0.42 / w); Ws = int(round(1080 * s / 2)) * 2; Hs = int(round(1920 * s / 2)) * 2
    xl = min(0, max(1080 - Ws, round(540 - cx * Ws))); yt = max(round(730 - cy * Hs), 1920 - Hs)
    pt = max(0, yt); pt += pt % 2; yoff = max(0, -yt); yoff -= yoff % 2; xoff = -xl; xoff -= xoff % 2
    vf = f"scale={Ws}:{Hs}:flags=lanczos"
    if pt: vf += f",pad={Ws}:{Hs + pt}:0:{pt}:color=white,fillborders=top={pt}:mode=smear"
    vf += f",crop=1080:1920:{xoff}:{yoff},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
    out[n] = dict(s=round(Ws / 1080, 4), xl=-xoff, yt=(pt if pt else -yoff), face=[round(-xoff + cx * Ws), round((pt if pt else -yoff) + cy * Hs), round(w * Ws)], vf=vf)
    print(n, out[n])
json.dump(out, open('frames.json', 'w'), indent=1)
