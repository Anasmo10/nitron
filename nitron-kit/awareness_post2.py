"""Nitron kit — single-image awareness post, second design family (Instagram 4:5, 1080×1350).
python3 awareness_post2.py <spec.json> <out.jpg>      spec["layout"]: "steps" or "versus"

Client, 11 Nov, on the first design reused for EP02: «Why are you making the same mistake again? Redesign the post».
The mistake: the doctor advice was split into two differently styled groups (an urgent box and a calmer line). On EP01
the client had circled exactly that («مو نفس الشيء», then «ليش هنن مو نفس التصنيف»). Here every reason to see a doctor is
one list, one style, under one heading with no «فوراً».
  steps   title beside a large injury hero · three numbered glass steps (RTL) · recovery line · one doctor box · foot
  versus  hero badge and centred title · «غلط» column next to «صح» column · recovery line · one doctor box · foot
Everything is laid out with flex/grid and gaps (nothing absolutely stacked), so text cannot run into other text.
"""
import sys, json, html, base64, subprocess, os
from PIL import Image

spec = json.load(open(sys.argv[1])); OUT = os.path.abspath(sys.argv[2]); E = html.escape; L = spec.get("layout", "steps")
uri = lambda p: "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()
chips = "".join(f'<div class="chip"><span class="bang">!</span><span>{E(c)}</span></div>' for c in spec["doctor"])
doc = f'<div class="doc"><div class="dh">{E(spec["doctor_h"])}</div><div class="chips">{chips}</div></div>'
note = f'<div class="note"><span class="dot"></span>{E(spec["note"])}</div>' if spec.get("note") else ""
foot = f'<div class="foot"><div class="src">المصدر: {E(spec["src"])}<div class="disc">{E(spec["disc"])}</div></div><img class="logo" src="{uri(spec["logo"])}"></div>'
BASE = """
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0A0A0C;font-family:Cairo,sans-serif;color:#fff;direction:rtl}
.grid{position:absolute;inset:0;background-image:radial-gradient(rgba(199,125,219,.10) 2.2px,transparent 2.6px);background-size:48px 48px;background-position:12px 12px}
.wrap{position:absolute;inset:52px 70px 42px;display:flex;flex-direction:column}
.tag{font-family:Inter;font-weight:800;font-size:24px;letter-spacing:6px;color:#C77DDB;direction:ltr;text-align:center}
.glass{background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.04));border:2px solid rgba(199,125,219,.35);box-shadow:inset 0 2px 0 rgba(255,255,255,.12)}
.note{display:flex;align-items:center;justify-content:center;gap:14px;font-weight:800;font-size:31px;color:#C77DDB}
.note .dot{width:12px;height:12px;border-radius:50%;background:#C77DDB}
.doc{padding:24px 30px 28px;border-radius:40px;background:linear-gradient(160deg,rgba(199,125,219,.16),rgba(118,2,138,.10));border:2px solid rgba(199,125,219,.7)}
.dh{font-weight:900;font-size:40px;margin-bottom:16px}
.chips{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.chip{display:flex;align-items:center;gap:12px;padding:10px 16px 10px 14px;border-radius:30px;background:rgba(10,10,12,.55);font-weight:800;font-size:27px;white-space:nowrap}
.bang{flex:none;width:40px;height:40px;border-radius:50%;background:#C77DDB;color:#0A0A0C;display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:900;font-size:23px}
.foot{display:flex;justify-content:space-between;align-items:flex-end}
.src{text-align:right;font-family:Inter,Cairo;font-weight:700;font-size:22px;color:rgba(199,125,219,.95);line-height:1.6}
.disc{font-family:Cairo;font-weight:600;font-size:21px;color:rgba(255,255,255,.55)}
.logo{width:170px}
.bar{height:12px;border-radius:6px;background:#76028A}
"""
if L == "steps":
    steps = "".join(f'<div class="step glass"><div class="num">{E(s["n"])}</div><div class="st">{E(s["t"])}</div><div class="ss">{E(s["s"])}</div></div>' for s in spec["steps"])
    css = BASE + """
.spot{position:absolute;inset:0;background:radial-gradient(ellipse 60% 42% at 24% 27%,rgba(118,2,138,.62),rgba(75,1,88,.18) 58%,rgba(10,10,12,0) 82%)}
.wrap{gap:26px}
.top{display:flex;align-items:center;gap:26px;height:430px}
.ttl{flex:1;display:flex;flex-direction:column;gap:14px}
.t1{font-weight:900;font-size:60px;line-height:1.28}
.t2{font-weight:900;font-size:86px;line-height:1.2;color:#C77DDB;white-space:nowrap}
.ttl .bar{width:230px;margin-top:6px}
.hero{flex:none;height:420px}
.steps{display:flex;gap:18px}
.step{flex:1;border-radius:38px;padding:24px 22px 26px;display:flex;flex-direction:column;gap:8px}
.num{width:64px;height:64px;border-radius:50%;background:#76028A;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:36px;margin-bottom:6px}
.st{font-weight:900;font-size:38px;line-height:1.25}
.ss{font-weight:600;font-size:26px;line-height:1.5;color:rgba(255,255,255,.74)}
.foot{margin-top:auto}
"""
    body = f'''<div class="spot"></div><div class="grid"></div><div class="wrap">
<div class="tag">{E(spec.get("tag", "INJURY BREAKDOWN"))}</div>
<div class="top"><div class="ttl"><div class="t1">{spec["l1"]}</div><div class="t2">{E(spec["l2"])}</div><div class="bar"></div></div><img class="hero" src="{uri(spec["hero"])}"></div>
<div class="steps">{steps}</div>{note}{doc}{foot}</div>'''
else:
    col = lambda items, kind: "".join(f'<div class="card glass"><span class="mk {kind}">{"✓" if kind == "ok" else "✕"}</span><span>{E(t)}</span></div>' for t in items)
    css = BASE + """
.spot{position:absolute;inset:0;background:radial-gradient(ellipse 72% 46% at 50% 46%,rgba(118,2,138,.58),rgba(75,1,88,.18) 58%,rgba(10,10,12,0) 82%)}
.wrap{gap:20px}
.top{display:flex;flex-direction:column;align-items:center;gap:8px}
.badge{width:148px;height:148px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 40% 35%,rgba(199,125,219,.30),rgba(118,2,138,.18) 60%,rgba(10,10,12,.2));border:3px solid rgba(199,125,219,.75)}
.badge img{height:114px}
.t1{font-weight:900;font-size:52px;line-height:1.3;white-space:nowrap}
.t2{font-weight:900;font-size:84px;line-height:1.15;color:#C77DDB;white-space:nowrap}
.top .bar{width:260px;margin-top:6px}
.vs{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.colh{display:flex;align-items:center;justify-content:center;gap:12px;font-weight:900;font-size:38px;margin-bottom:10px}
.colh.ok{color:#C77DDB}.colh.no{color:rgba(255,255,255,.82)}
.col{display:flex;flex-direction:column;gap:12px}
.card{height:86px;border-radius:30px;padding:0 20px;display:flex;align-items:center;gap:14px;font-weight:800;font-size:29px;line-height:1.3}
.mk{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:900;font-size:26px}
.mk.ok{background:#76028A;color:#fff}.mk.no{border:3px solid rgba(255,255,255,.7);color:rgba(255,255,255,.85)}
.col.no .card{border-color:rgba(255,255,255,.22)}
.foot{margin-top:auto}
"""
    body = f'''<div class="spot"></div><div class="grid"></div><div class="wrap">
<div class="tag">{E(spec.get("tag", "INJURY BREAKDOWN"))}</div>
<div class="top"><div class="badge"><img src="{uri(spec["hero"])}"></div><div class="t1">{E(spec["l1"])}</div><div class="t2">{E(spec["l2"])}</div><div class="bar"></div></div>
<div class="vs"><div class="col no"><div class="colh no"><span class="mk no">✕</span>{E(spec["no_h"])}</div>{col(spec["no"], "no")}</div>
<div class="col ok"><div class="colh ok"><span class="mk ok">✓</span>{E(spec["ok_h"])}</div>{col(spec["ok"], "ok")}</div></div>{note}{doc}{foot}</div>'''
page = f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>'
hp = OUT[:-4] + ".html"; png = OUT[:-4] + ".png"; open(hp, "w").write(page)
subprocess.run([os.environ.get("CHROME_PATH", "chromium"), "--headless=new", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
                "--window-size=1080,1350", f"--screenshot={png}", "file://" + hp], check=True, capture_output=True)
Image.open(png).convert("RGB").crop((0, 0, 1080, 1350)).save(OUT, quality=95); os.remove(png); print("post →", OUT)
