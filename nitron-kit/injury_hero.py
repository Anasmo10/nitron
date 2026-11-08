"""Nitron kit — injury hero for the series cover: a clean side-view illustration of the injured area, transparent PNG.
python3 injury_hero.py <out.png> [strain level 0-4 = which disc gap glows, default 3 (L4–L5)]

Client, 8 Nov: the cover must not break the page's look. The page's covers put a hero on a white glass card
(product_cover.py) or on the dark stage. For the injury series the hero is this drawing in the brand colours: five lumbar
vertebrae on their curve, the discs in Nitron purple, the back muscle in lilac, and the strained spot glowing.
Drawn at 3x and scaled down, so it stays sharp on the card and in the grid.
"""
import sys, math
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1]; LVL = int(sys.argv[2]) if len(sys.argv) > 2 else 3
S = 3; W, H = 820 * S, 900 * S
INK, BODY, PURPLE, LIL, WHITE = (10, 10, 12), (36, 26, 44), (118, 2, 138), (199, 125, 219), (255, 255, 255)
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

def layer(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))
def rot_poly(pts, cx, cy, a):
    c, s = math.cos(a), math.sin(a); return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]

step, bh, bw = 140 * S, 104 * S, 214 * S
centers = []
for i in range(5):
    y = (70 + i * 140 + 52) * S; x = (300 - 38 * math.sin(math.pi * (i + 0.5) / 5)) * S
    a = -0.12 * math.cos(math.pi * (i + 0.5) / 5); centers.append((x, y, a))

# back muscle (erector spinae): a smooth lilac band just behind the process tips, following the curve, fibres drawn in
mus = layer(); d = ImageDraw.Draw(mus)
ys = [k * S for k in range(30, 860, 10)]
def tipx(y):   # the band follows the same lordosis as the bodies
    u = (y / S - 70) / 700; return (300 - 38 * math.sin(math.pi * min(max(u, 0), 1)) + 107 + 150) * S
left = [(tipx(y), y) for y in ys]
band = left + [(x + 115 * S, y) for x, y in reversed(left)]
d.polygon(band, fill=LIL + (80,)); d.line(left, fill=LIL + (230,), width=4 * S); d.line([(x + 115 * S, y) for x, y in left], fill=LIL + (230,), width=4 * S)
for f in range(1, 5):
    d.line([(x + f * 23 * S, y) for x, y in left], fill=LIL + (120,), width=2 * S)
img.alpha_composite(mus)

# the strained spot on the muscle: a tight white-lilac glow, a hot core and two rings
gy = (centers[min(LVL, 4)][1] + (centers[min(LVL + 1, 4)][1] if LVL < 4 else centers[4][1] + step)) / 2
gx = tipx(gy) + 58 * S
glow = Image.new("RGBA", (W, H), LIL + (0,)); g = ImageDraw.Draw(glow)   # coloured transparent pixels: no grey halo when blurred
for r, col, al in [(170, LIL, 120), (110, (232, 190, 245), 170)]:
    g.ellipse([gx - r * S, gy - r * S, gx + r * S, gy + r * S], fill=col + (al,))
glow = glow.filter(ImageFilter.GaussianBlur(28 * S)); img.alpha_composite(glow)
core = Image.new("RGBA", (W, H), WHITE + (0,)); g = ImageDraw.Draw(core); g.ellipse([gx - 40 * S, gy - 40 * S, gx + 40 * S, gy + 40 * S], fill=WHITE + (245,))
core = core.filter(ImageFilter.GaussianBlur(12 * S)); img.alpha_composite(core)
rings = layer(); g = ImageDraw.Draw(rings)
for r, al, wdt in [(88, 255, 6), (132, 140, 4)]:
    g.ellipse([gx - r * S, gy - r * S, gx + r * S, gy + r * S], outline=WHITE + (al,), width=wdt * S)
img.alpha_composite(rings)

# spinous processes (behind the bodies), then discs, then the vertebral bodies
sp = layer(); d = ImageDraw.Draw(sp)
for x, y, a in centers:
    p = [(x + bw / 2 - 10 * S, y - 34 * S), (x + bw / 2 + 170 * S, y + 6 * S), (x + bw / 2 + 178 * S, y + 22 * S), (x + bw / 2 + 166 * S, y + 36 * S), (x + bw / 2 - 10 * S, y + 30 * S)]
    d.polygon(rot_poly(p, x, y, a), fill=BODY + (255,), outline=LIL + (255,), width=5 * S)
img.alpha_composite(sp)
dk = layer(); d = ImageDraw.Draw(dk)
for i in range(5):
    x, y, a = centers[i]; y2 = y + step / 2
    hot = (i == LVL)
    p = [(x - bw / 2 + 8 * S, y2 - 14 * S), (x + bw / 2 - 8 * S, y2 - 14 * S), (x + bw / 2 - 8 * S, y2 + 14 * S), (x - bw / 2 + 8 * S, y2 + 14 * S)]
    if i < 4: d.rounded_rectangle([x - bw / 2 + 10 * S, y2 - 15 * S, x + bw / 2 - 10 * S, y2 + 15 * S], radius=14 * S, fill=(LIL if hot else PURPLE) + (255,))
img.alpha_composite(dk)
bd = layer(); d = ImageDraw.Draw(bd)
for x, y, a in centers:
    r = [(x - bw / 2, y - bh / 2), (x + bw / 2, y - bh / 2), (x + bw / 2, y + bh / 2), (x - bw / 2, y + bh / 2)]
    d.rounded_rectangle([x - bw / 2, y - bh / 2, x + bw / 2, y + bh / 2], radius=26 * S, fill=BODY + (255,), outline=LIL + (255,), width=6 * S)
    d.line([(x - bw / 2 + 26 * S, y - bh / 2 + 14 * S), (x + bw / 2 - 26 * S, y - bh / 2 + 14 * S)], fill=WHITE + (70,), width=4 * S)   # a highlight edge
img.alpha_composite(bd)
# sacrum: a wedge tilting back under L5
x, y, a = centers[4]; top = y + bh / 2 + 28 * S
sc = layer(); d = ImageDraw.Draw(sc)
d.polygon([(x - bw / 2 + 10 * S, top), (x + bw / 2 + 30 * S, top + 14 * S), (x + bw / 2 - 10 * S, top + 90 * S), (x + 30 * S, top + 140 * S), (x - bw / 2 + 40 * S, top + 70 * S)], fill=BODY + (255,), outline=LIL + (255,), width=6 * S)
img.alpha_composite(sc)

img = img.resize((W // S, H // S), Image.LANCZOS)
bb = img.getbbox(); img = img.crop((max(0, bb[0] - 10), max(0, bb[1] - 10), min(img.width, bb[2] + 10), min(img.height, bb[3] + 10)))
img.save(OUT); print("hero", img.size, "→", OUT)
