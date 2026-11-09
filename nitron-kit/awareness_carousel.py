"""Nitron kit — awareness carousel for the Injury Breakdown series (Instagram 4:5, 1080×1350).
python3 awareness_carousel.py <spec.json> <out dir>

The page's dark look (the same family as the series cover): black stage + Nitron purple spotlight, Cairo 900 headlines,
lilac accents, glass rows. Every slide that carries a medical claim prints its source at the bottom (series sources rule).
Slide kinds in the spec: cover · story · stat · rows · alert · tip. Writes slide-01.jpg … and a contact sheet.
"""
import sys, os, json, html, base64, subprocess
from PIL import Image

spec = json.load(open(sys.argv[1])); OUT = os.path.abspath(sys.argv[2]); os.makedirs(OUT, exist_ok=True)
CHROME = os.environ.get("CHROME_PATH", "chromium"); N = len(spec["slides"])
uri = lambda p: "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()
E = html.escape
AR = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0A0A0C;font-family:Cairo,sans-serif;color:#fff;direction:rtl}
.spot{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 52%,rgba(118,2,138,.55),rgba(75,1,88,.18) 55%,rgba(10,10,12,0) 80%)}
.floor{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(rgba(40,30,50,0),rgba(40,30,50,.35) 25%,#0A0A0C)}
.top{position:absolute;top:64px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center}
.tag{font-family:Inter;font-weight:800;font-size:24px;letter-spacing:6px;color:#C77DDB;direction:ltr}
.count{font-family:Inter;font-weight:800;font-size:26px;color:rgba(255,255,255,.55);direction:ltr}
.wrap{position:absolute;left:80px;right:80px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px}
.eb{font-weight:800;font-size:34px;color:#C77DDB}
.h{font-weight:900;font-size:84px;line-height:1.25}
.h2{font-weight:900;font-size:68px;line-height:1.3}
.lil{color:#C77DDB}
.bar{width:300px;height:12px;border-radius:6px;background:#76028A}
.p{font-weight:700;font-size:44px;line-height:1.55;color:rgba(255,255,255,.92)}
.small{font-weight:600;font-size:34px;line-height:1.6;color:rgba(255,255,255,.7)}
.big{font-family:Inter;font-weight:900;font-size:260px;line-height:1;color:#C77DDB;direction:ltr;text-align:right}
.rows{display:flex;flex-direction:column;gap:22px}
.row{display:flex;align-items:center;gap:30px;padding:28px 34px;border-radius:40px;background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.04));border:2px solid rgba(199,125,219,.35);box-shadow:inset 0 2px 0 rgba(255,255,255,.12)}
.mk{flex:none;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:900;font-size:40px}
.mk.ok{background:#76028A;color:#fff}.mk.no{background:#0A0A0C;border:3px solid #C77DDB;color:#C77DDB}.mk.al{background:#C77DDB;color:#0A0A0C}
.mk.num{background:#76028A;color:#fff;font-family:Cairo;font-size:42px}
.rt{font-weight:800;font-size:44px;line-height:1.35}.rs{font-weight:600;font-size:32px;line-height:1.45;color:rgba(255,255,255,.7)}
.src{position:absolute;bottom:64px;right:80px;left:300px;font-family:Inter,Cairo;font-weight:700;font-size:24px;color:rgba(199,125,219,.95);text-align:right}
.logo{position:absolute;bottom:52px;left:80px;width:190px}
.hero{position:absolute}
.swipe{font-weight:800;font-size:32px;color:rgba(255,255,255,.7)}
"""

def page(s, i):
    k = s["kind"]; body = ""
    top = f'<div class="top"><div class="count">{i + 1} / {N}</div><div class="tag">{E(spec.get("tag", "INJURY BREAKDOWN"))}</div></div>'
    hero = s.get("hero")
    if k == "cover":
        body = f'''<div class="wrap" style="top:170px;justify-content:flex-start;gap:26px;align-items:center;text-align:center">
          <div class="h" style="font-size:{s.get("s1", 76)}px;white-space:nowrap">{E(s["l1"])}</div><div class="h lil" style="font-size:{s.get("s2", 124)}px;line-height:1.1;white-space:nowrap">{E(s["l2"])}</div><div class="bar"></div></div>
          <img class="hero" src="{uri(hero)}" style="left:{540 - s.get("hw", 360) / 2}px;top:{s.get("hy", 690)}px;width:{s.get("hw", 360)}px">
          <div class="swipe" style="position:absolute;bottom:150px;left:0;right:0;text-align:center">{E(s.get("swipe", "اسحب ←"))}</div>'''
    elif k == "story":
        h = f'<img src="{uri(hero)}" style="width:{s.get("hw", 260)}px;align-self:flex-start;margin-top:10px">' if hero else ""
        body = f'''<div class="wrap"><div class="eb">{E(s["eb"])}</div><div class="h">{E(s["h"])}</div><div class="bar"></div>
          <div class="p">{s["p"]}</div>{f'<div class="small">{E(s["small"])}</div>' if s.get("small") else ""}{h}</div>'''
    elif k == "stat":
        body = f'''<div class="wrap"><div class="eb">{E(s["eb"])}</div><div class="big">{E(s["big"])}</div>
          <div class="h2">{s["h"]}</div><div class="bar"></div><div class="p">{E(s["p"])}</div></div>'''
    elif k in ("rows", "alert", "tip"):
        rows = "".join(f'<div class="row"><div class="mk {r.get("m", "ok")}">{E(r.get("n", {"ok": "✓", "no": "✕", "al": "!"}.get(r.get("m", "ok"), "")))}</div><div><div class="rt">{E(r["t"])}</div>{f"<div class=rs>{E(r[chr(115)])}</div>" if r.get("s") else ""}</div></div>' for r in s["rows"])
        after = f'<div class="p" style="font-size:40px">{E(s["after"])}</div>' if s.get("after") else ""
        note = f'<div class="small" style="font-size:28px">{E(s["note"])}</div>' if s.get("note") else ""
        cta = f'<div class="h2 lil" style="font-size:54px;margin-top:6px">{E(s["cta"])}</div>' if s.get("cta") else ""
        body = f'<div class="wrap"><div class="eb">{E(s["eb"])}</div><div class="h2">{E(s["h"])}</div><div class="rows">{rows}</div>{after}{cta}{note}</div>'
    src = f'<div class="src">المصدر: {E(s["src"])}</div>' if s.get("src") else ""
    logo = f'<img class="logo" src="{uri(spec["logo"])}">' if spec.get("logo") else ""
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="spot"></div><div class="floor"></div>{top}{body}{src}{logo}</body></html>'

shots = []
for i, s in enumerate(spec["slides"]):
    hp = os.path.join(OUT, f"slide-{i + 1:02d}.html"); png = hp[:-5] + ".png"; open(hp, "w").write(page(s, i))
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1080,1350",
                    f"--screenshot={png}", "file://" + hp], check=True, capture_output=True)
    jp = png[:-4] + ".jpg"; Image.open(png).convert("RGB").crop((0, 0, 1080, 1350)).save(jp, quality=94); os.remove(png); shots.append(jp)
sheet = Image.new("RGB", (len(shots) * 370 + 10, 470), (24, 24, 24))
for i, p in enumerate(shots): sheet.paste(Image.open(p).resize((360, 450)), (10 + i * 370, 10))
sheet.save(os.path.join(OUT, "sheet.jpg"), quality=88); print(f"{len(shots)} slides → {OUT}")
