"""Nitron kit — product cover (house rule v2.1: the cover shows the product photo, not the presenter).
python3 product_cover.py <out-dir> <product.png> "سطر أول|سطر ثاني" ["سطر صغير فوقه"] [--logo logo_word.png] [--first ad-master.mp4]
Brand purple stage + the product cutout (product_cutout.py) on white liquid glass + a two-line title in Cairo 900.
Everything that matters sits in the 1080×1080 square at y 420–1500 (Instagram profile grid crops to it).
Writes cover.jpg and cover_grid.jpg (9:16 · 4:5 · 1:1 side by side); --first also writes <video>-cover.mp4 (cover as frame 1)."""
import sys, os, subprocess, base64, html, tempfile
from PIL import Image
a = sys.argv[1:]; opt = lambda k: a[a.index(k) + 1] if k in a else ""
pos = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] not in ("--logo", "--first"))]
out, prod, title = os.path.abspath(pos[0]), os.path.abspath(pos[1]), pos[2]; eyebrow = pos[3] if len(pos) > 3 else ""
logo, first = opt("--logo"), opt("--first")
uri = lambda p: "data:image/png;base64," + base64.b64encode(open(p, "rb").read()).decode()
pw, ph = Image.open(prod).size
lines = title.split("|"); longest = max(len(l) for l in lines); size = int(max(170, min(220, 900 / (0.60 * longest))))
# the product is the hero: as big as the square allows, rising out of a white liquid-glass card
t_top = 1490 - len(lines) * size * 1.06; p_top = 455 + (125 if eyebrow else 0); p_bot = t_top - 70
sc = min(860 / pw, (p_bot - p_top) / ph); dw, dh = pw * sc, ph * sc; p_top = p_bot - dh
cw = min(900, max(640, dw + 140)); top = p_top + 0.45 * dh; chh = p_bot + 46 - top
eb = f'<div class="eb">{html.escape(eyebrow)}</div>' if eyebrow else ""
tt = "".join(f'<div class="l{i}">{html.escape(l)}</div>' for i, l in enumerate(lines))
lg = f'<img class="logo" src="{uri(logo)}">' if logo and os.path.exists(logo) else ""
page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
*{{margin:0}} body{{width:1080px;height:1920px;overflow:hidden;position:relative;font-family:Cairo,sans-serif;
 background:radial-gradient(ellipse 85% 60% at 50% 46%,#8E1BA6 0%,#76028A 48%,#3E0149 100%)}}
.grid{{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.045) 2px,transparent 2px);background-size:60px 60px}}
.glow{{position:absolute;left:90px;top:{p_top-40}px;width:900px;height:{p_bot-p_top+120}px;background:radial-gradient(closest-side,rgba(255,255,255,.28),rgba(255,255,255,0));filter:blur(10px)}}
.card{{position:absolute;left:{540-cw/2}px;top:{top}px;width:{cw}px;height:{chh}px;border-radius:64px;
 background:linear-gradient(160deg,rgba(255,255,255,.42),rgba(255,255,255,.16) 45%,rgba(255,255,255,.24));
 backdrop-filter:blur(30px) saturate(1.6);border:3px solid rgba(255,255,255,.55);
 box-shadow:0 40px 90px rgba(20,0,30,.45),inset 0 2px 0 rgba(255,255,255,.85),inset 0 -2px 0 rgba(255,255,255,.35)}}
.p{{position:absolute;left:{540-dw/2}px;top:{p_top}px;width:{dw}px;height:{dh}px;filter:drop-shadow(0 26px 30px rgba(0,0,0,.40))}}
.eb{{position:absolute;top:440px;left:0;right:0;margin:auto;width:max-content;direction:rtl;font-weight:800;font-size:96px;line-height:1.1;
 color:#fff;background:#0A0A0C;padding:4px 44px 18px;border-radius:34px}}
.t{{position:absolute;left:40px;right:40px;bottom:{1920-1490}px;direction:rtl;text-align:center;font-weight:900;font-size:{size}px;line-height:1.06;color:#fff;
 text-shadow:0 8px 30px rgba(30,0,40,.55)}}
.logo{{position:absolute;left:350px;width:380px;top:1712px}}
</style></head><body><div class="grid"></div><div class="glow"></div><div class="card"></div>
<img class="p" src="{uri(prod)}">{eb}<div class="t">{tt}</div>{lg}</body></html>"""
os.makedirs(out, exist_ok=True); hp = os.path.join(out, "cover.html"); open(hp, "w", encoding="utf-8").write(page)
png = os.path.join(out, "cover.png")
subprocess.run([os.environ.get("CHROME_PATH", "chromium"), "--headless=new", "--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
                "--window-size=1080,1920", f"--screenshot={png}", "file://" + hp], check=True, capture_output=True)
im = Image.open(png).convert("RGB").crop((0, 0, 1080, 1920)); cj = os.path.join(out, "cover.jpg"); im.save(cj, quality=93)
g = Image.new("RGB", (1080 * 3 // 2 + 40, 1920 // 2), (24, 24, 24))
g.paste(im.resize((540, 960)), (0, 0)); g.paste(im.crop((0, 285, 1080, 1635)).resize((540, 675)), (560, 140))
g.save(os.path.join(out, "cover_grid.jpg"), quality=88)
print("cover →", cj, "· title", size, "px")
if first and os.path.exists(first):
    o = os.path.splitext(first)[0] + "-cover.mp4"
    fc = ("[1:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[c];[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v];"
          "[2:a]aresample=48000[s];[0:a]aresample=48000[a];[c][s][v][a]concat=n=2:v=1:a=1[ov][oa]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", first, "-loop", "1", "-t", "0.1", "-framerate", "30", "-i", cj,
                    "-f", "lavfi", "-t", "0.1", "-i", "anullsrc=r=48000:cl=stereo", "-filter_complex", fc, "-map", "[ov]", "-map", "[oa]",
                    "-c:a", "aac", "-b:a", "192k", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", o], check=True)
    print("video with cover →", o)
