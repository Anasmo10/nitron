"""Nitron kit — single-image awareness post for the Injury Breakdown series (Instagram 4:5, 1080×1350).
python3 awareness_post.py <spec.json> <out.jpg>

Client, 9 Nov: «ما بدي كاروسيل، بدي بوست» — one image. The dark cover look: black stage + Nitron purple spotlight,
hook title (white line + lilac line + purple bar), the injury hero beside three ✓/✕ rows, a glass alert box with the
warning signs, then source + disclaimer + logo at the foot. Every claim on it comes from the source printed at the bottom.
"""
import sys, json, html, base64, subprocess, os
from PIL import Image

spec = json.load(open(sys.argv[1])); OUT = os.path.abspath(sys.argv[2]); E = html.escape
uri = lambda p: "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()
mk = {"ok": "✓", "no": "✕", "al": "!"}
rows = "".join(f'<div class="row"><div class="mk {r["m"]}">{mk[r["m"]]}</div><div><div class="rt">{E(r["t"])}</div><div class="rs">{E(r["s"])}</div></div></div>' for r in spec["rows"])
chips = "".join(f'<div class="chip"><span class="mk al sm">!</span>{E(c)}</div>' for c in spec["alerts"])
page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0A0A0C;font-family:Cairo,sans-serif;color:#fff;direction:rtl}}
.spot{{position:absolute;inset:0;background:radial-gradient(ellipse 75% 50% at 35% 48%,rgba(118,2,138,.55),rgba(75,1,88,.18) 55%,rgba(10,10,12,0) 80%)}}
.tag{{position:absolute;top:60px;left:0;right:0;text-align:center;font-family:Inter;font-weight:800;font-size:24px;letter-spacing:6px;color:#C77DDB;direction:ltr}}
.t1{{position:absolute;top:104px;left:0;right:0;text-align:center;font-weight:900;font-size:{spec.get("s1", 58)}px;white-space:nowrap}}
.t2{{position:absolute;top:{206 + round((112 - spec.get("s2", 112)) * 0.55)}px;left:0;right:0;text-align:center;font-weight:900;font-size:{spec.get("s2", 112)}px;line-height:1.15;color:#C77DDB;white-space:nowrap}}
.bar{{position:absolute;top:358px;left:390px;width:300px;height:12px;border-radius:6px;background:#76028A}}
.hero{{position:absolute;left:76px;top:408px;width:{spec.get("hw", 290)}px}}
.rows{{position:absolute;top:408px;right:70px;width:620px;display:flex;flex-direction:column;gap:12px}}
.row{{display:flex;align-items:center;gap:24px;padding:13px 26px;border-radius:34px;background:linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.04));border:2px solid rgba(199,125,219,.35);box-shadow:inset 0 2px 0 rgba(255,255,255,.12)}}
.mk{{flex:none;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:900;font-size:34px}}
.mk.ok{{background:#76028A;color:#fff}}.mk.no{{background:#0A0A0C;border:3px solid #C77DDB;color:#C77DDB}}.mk.al{{background:#C77DDB;color:#0A0A0C}}
.mk.sm{{width:40px;height:40px;font-size:22px}}
.rt{{font-weight:800;font-size:37px;line-height:1.3}}.rs{{font-weight:600;font-size:27px;line-height:1.4;color:rgba(255,255,255,.72)}}
.bottom{{position:absolute;top:{spec.get("bt", 808)}px;left:70px;right:70px;display:flex;flex-direction:column;gap:14px}}
.alert{{padding:18px 32px 22px;border-radius:40px;background:linear-gradient(160deg,rgba(199,125,219,.16),rgba(118,2,138,.10));border:2px solid rgba(199,125,219,.7)}}
.ah{{font-weight:900;font-size:40px;margin-bottom:10px}}
.chips{{display:flex;flex-wrap:wrap;gap:12px}}
.chip{{display:flex;align-items:center;gap:12px;padding:8px 20px 8px 12px;border-radius:28px;background:rgba(10,10,12,.55);font-weight:800;font-size:28px;white-space:nowrap}}
.after{{margin-top:16px;font-weight:700;font-size:29px;color:rgba(255,255,255,.88)}}
.later{{display:flex;align-items:center;gap:18px;padding:13px 30px;border-radius:34px;background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border:2px solid rgba(255,255,255,.18)}}
.later .mk{{width:48px;height:48px;font-size:26px;background:transparent;border:3px solid rgba(255,255,255,.6);color:rgba(255,255,255,.85);font-family:Inter}}
.later .lt{{font-weight:800;font-size:31px;color:rgba(255,255,255,.9)}}
.foot{{position:absolute;bottom:40px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:flex-end}}
.src{{text-align:right;font-family:Inter,Cairo;font-weight:700;font-size:23px;color:rgba(199,125,219,.95);line-height:1.6}}
.disc{{font-family:Cairo;font-weight:600;font-size:22px;color:rgba(255,255,255,.55)}}
.logo{{width:180px}}
</style></head><body><div class="spot"></div>
<div class="tag">{E(spec.get("tag", "INJURY BREAKDOWN"))}</div>
<div class="t1">{E(spec["l1"])}</div><div class="t2">{E(spec["l2"])}</div><div class="bar"></div>
<img class="hero" src="{uri(spec["hero"])}">
<div class="rows">{rows}</div>
<div class="bottom"><div class="alert"><div class="ah">{E(spec["alert_h"])}</div><div class="chips">{chips}</div>{('<div class="after">' + E(spec["after"]) + '</div>') if spec.get("after") else ""}</div>{('<div class="later"><div class="mk">i</div><div class="lt">' + E(spec["later"]) + '</div></div>') if spec.get("later") else ""}</div>
<div class="foot"><div class="src">المصدر: {E(spec["src"])}<div class="disc">{E(spec["disc"])}</div></div><img class="logo" src="{uri(spec["logo"])}"></div>
</body></html>"""
hp = OUT[:-4] + ".html"; png = OUT[:-4] + ".png"; open(hp, "w").write(page)
subprocess.run([os.environ.get("CHROME_PATH", "chromium"), "--headless=new", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
                "--window-size=1080,1350", f"--screenshot={png}", "file://" + hp], check=True, capture_output=True)
Image.open(png).convert("RGB").crop((0, 0, 1080, 1350)).save(OUT, quality=95); os.remove(png); print("post →", OUT)
