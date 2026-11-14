"""EP04: a radiograph of a forearm holding a dumbbell, rendered the way an X-ray forms (client, 14 Nov: «بدنا واقعية أكثر
في الموشن جرافيك»). Every structure is a solid seen in projection: the brightness of a pixel is how much material the
beam crosses there, I = 1 − exp(−k·Σ μ·path). A long bone is a hollow tube (dense cortex, spongy core), so its edges come out
brighter than its middle, as on a real film; the ends of the bones are spongy (trabecular texture); metal saturates.
Layers (1000×1600, RGBA, alpha = brightness) so the scene can move them separately:
  xr_forearm  radius, ulna, end of the humerus, forearm soft tissue
  xr_hand     carpals, metacarpals, phalanges curled round the handle, hand soft tissue
  xr_bell     the dumbbell (handle, collars, plates)
  xr_fix      two plates and their screws on the radius and the ulna (the usual adult repair)
  xr_cast     a cast shell round the forearm
plus xr_geom.json (wrist pivot, fracture line, bone axes) for the scene."""
import numpy as np, cv2, json
W, H = 1000, 1700
rng = np.random.default_rng(4)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def noise(scale, seed):
    r = np.random.default_rng(seed).normal(0, 1, (H, W)).astype(np.float32)
    a = cv2.GaussianBlur(r, (0, 0), scale) ; b = cv2.GaussianBlur(r, (0, 0), scale * 2.6)
    n = a - b; return n / (n.std() + 1e-6)
TRAB = 1 + 0.32 * noise(1.6, 1) + 0.18 * noise(4.0, 2)          # spongy bone: fine, irregular

def tube(pts, R, rin=None, mu_c=1.0, mu_t=0.30, trab_ends=0.18, cap=0.35, marrow=0.10):
    """projected path length of a hollow long bone along a polyline. R = outer half-width per point; the cortex is thick
    in the shaft (0.32·R) and thin at the ends (0.07·R), where spongy bone fills the core; the ends are flattened caps
    (an ellipse cap = cap·R long), not round balls"""
    P = np.array(pts, np.float32); n = len(P); A = np.zeros((H, W), np.float32); Rm = float(np.max(R))
    x0, y0 = int(P[:, 0].min() - Rm - 6), int(P[:, 1].min() - Rm - 6); x1, y1 = int(P[:, 0].max() + Rm + 6), int(P[:, 1].max() + Rm + 6)
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    gx, gy = xx[y0:y1, x0:x1], yy[y0:y1, x0:x1]
    best = np.full(gx.shape, 1e9, np.float32); tt = np.zeros(gx.shape, np.float32); lat = np.zeros(gx.shape, np.float32); over = np.zeros(gx.shape, np.float32)
    seglen = np.linalg.norm(np.diff(P, axis=0), axis=1); cum = np.concatenate([[0], np.cumsum(seglen)]); L = cum[-1]
    for i in range(n - 1):
        a, b = P[i], P[i + 1]; ab = b - a; l = float(np.linalg.norm(ab)) + 1e-9; ux, uy = ab / l
        ur = ((gx - a[0]) * ux + (gy - a[1]) * uy) / l
        u = np.clip(ur, 0, 1); dx, dy = gx - (a[0] + u * ab[0]), gy - (a[1] + u * ab[1]); d = np.sqrt(dx * dx + dy * dy)
        m = d < best; best[m] = d[m]; tt[m] = (cum[i] + u[m] * seglen[i]) / L
        perp = np.abs((gx - a[0]) * uy - (gy - a[1]) * ux)
        ov = np.zeros_like(ur)
        if i == 0: ov = np.maximum(ov, -ur * l)
        if i == n - 2: ov = np.maximum(ov, (ur - 1) * l)
        lat[m] = np.where(ov[m] > 0, perp[m], d[m]); over[m] = ov[m]
    Ro = np.interp(tt, np.linspace(0, 1, n), R)
    endw = np.clip(1 - np.minimum(tt, 1 - tt) / trab_ends, 0, 1)
    ct = Ro * (0.32 - 0.25 * endw) if rin is None else Ro - np.interp(tt, np.linspace(0, 1, n), rin)
    Ri = np.maximum(Ro - ct, 0)
    r = np.sqrt(lat ** 2 + (over * (1 / cap)) ** 2)                                  # flattened end caps
    o = np.sqrt(np.clip(Ro ** 2 - r ** 2, 0, None)); i_ = np.sqrt(np.clip(Ri ** 2 - r ** 2, 0, None))
    core = (marrow + (mu_t - marrow) * endw) * TRAB[y0:y1, x0:x1]
    A[y0:y1, x0:x1] = 2 * (mu_c * (o - i_) + core * i_)
    return A

def blob(cx, cy, a, b, ang=0, mu=0.9, spongy=True):
    c, s = np.cos(ang), np.sin(ang); X = (xx - cx) * c + (yy - cy) * s; Y = -(xx - cx) * s + (yy - cy) * c
    q = 1 - (X / a) ** 2 - (Y / b) ** 2; p = 2 * min(a, b) * np.sqrt(np.clip(q, 0, None))
    shell = np.sqrt(np.clip(q, 0, None)); rim = np.clip(1 - shell * 1.6, 0, 1) * (q > 0)
    return mu * p * ((0.55 + 0.45 * rim) * (TRAB if spongy else 1))

def prof(*pairs, n=40):
    t = np.linspace(0, 1, n); k = np.array(pairs, np.float32); return np.interp(t, k[:, 0], k[:, 1]).astype(np.float32)

def curve(p0, pm, p1, n=40):
    t = np.linspace(0, 1, n)[:, None]; p0, pm, p1 = map(lambda v: np.array(v, np.float32), (p0, pm, p1))
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * pm + t ** 2 * p1

def soft(poly, blur, mu):
    m = np.zeros((H, W), np.float32); cv2.fillPoly(m, [np.array(poly, np.int32)], 1.0)
    d = cv2.distanceTransform((m * 255).astype(np.uint8), cv2.DIST_L2, 5); d = np.sqrt(np.clip(d, 0, None))
    return cv2.GaussianBlur(d, (0, 0), blur) * mu

def to_layer(A, k, tint, grain=0.05, blur=0.9):
    I = 1 - np.exp(-k * A); I = cv2.GaussianBlur(I, (0, 0), blur)
    I = np.clip(I * (1 + grain * rng.normal(0, 1, I.shape).astype(np.float32)), 0, 1)
    rgb = np.ones((H, W, 3), np.float32) * np.array(tint, np.float32)
    return np.dstack([rgb, I])

def save(name, L):
    out = np.dstack([L[..., :3][..., ::-1], L[..., 3:]]) * 255
    cv2.imwrite(f'/home/user/work/ep4/ep/{name}.png', out.clip(0, 255).astype(np.uint8)); print(name, 'max', round(float(L[..., 3].max()), 2), 'mean', round(float(L[..., 3].mean()), 3))

TB = (0.93, 0.95, 1.0)      # bone: cool white (RGB)
TM = (1.0, 1.0, 1.0)        # metal
# ---- forearm (32 px ≈ 1 cm) -------------------------------------------------------------------------------------------
RAD = np.concatenate([curve((530, 700), (536, 770), (540, 860), 12)[:-1], curve((540, 860), (566, 1140), (534, 1400), 40)[:-1], curve((534, 1400), (532, 1440), (530, 1490), 10)])
r_R = np.interp(np.linspace(0, 1, len(RAD)), [0, 0.04, 0.12, 0.22, 0.6, 0.86, 0.9, 0.95, 1], [56, 52, 34, 22, 20, 15, 14, 24, 26]).astype(np.float32)   # flared at the wrist, the radial head at the elbow
ULN = np.concatenate([curve((440, 712), (436, 760), (434, 820), 10)[:-1], curve((434, 820), (424, 1180), (452, 1480), 40)[:-1], curve((452, 1480), (458, 1520), (462, 1560), 10)])
u_R = np.interp(np.linspace(0, 1, len(ULN)), [0, 0.04, 0.12, 0.5, 0.82, 0.92, 1], [22, 20, 14, 16, 22, 34, 36]).astype(np.float32)
A_f = tube(RAD, r_R) + tube(ULN, u_R)
HUM = curve((496, 1760), (498, 1660), (504, 1572), 24)                                                                  # end of the humerus: the shaft flares into the condyles
A_f += tube(HUM, np.interp(np.linspace(0, 1, 24), [0, 0.5, 0.8, 1], [44, 48, 70, 84]).astype(np.float32), cap=0.14) * 0.5 - blob(500, 1580, 26, 22, 0, 0.5)   # thin over the olecranon fossa
def limb(cxs, ys, half, depth=0.8, mu=0.0042, fade=(70, 70)):
    hw = np.interp(yy, ys, half); cx = np.interp(yy, ys, cxs); q = 1 - ((xx - cx) / np.maximum(hw, 1)) ** 2
    end = np.clip((yy - ys[0]) / fade[0], 0, 1) * np.clip((ys[-1] - yy) / fade[1], 0, 1); end = end * end * (3 - 2 * end)   # soft ends, never a hard edge
    A = 2 * depth * hw * np.sqrt(np.clip(q, 0, None)) * end * mu
    return cv2.GaussianBlur(A, (0, 0), 2.5)
A_fs = limb([500, 498, 492, 494, 500], [600, 760, 1050, 1350, 1760], [116, 126, 150, 158, 150], mu=0.0026, fade=(110, 10))
fore = to_layer(A_f * 0.05 + A_fs, 1.0, TB, grain=0.05); save('xr_forearm', fore)
# ---- hand (fist round the handle) ------------------------------------------------------------------------------------
A_h = np.zeros((H, W), np.float32)
for cx, cy, a, b, ang in [(462, 664, 34, 26, 0.35), (508, 668, 30, 26, 0), (552, 660, 26, 22, -0.3), (430, 650, 16, 15, 0),   # proximal row
                          (474, 612, 26, 22, 0.25), (510, 608, 22, 20, 0), (548, 602, 28, 24, 0), (590, 612, 24, 20, -0.25)]:  # distal row
    A_h += blob(cx, cy, a, b, ang, 0.30)
for (bx, by), (tx, ty), r in [((470, 584), (436, 420), 17), ((506, 580), (482, 410), 18), ((542, 580), (530, 414), 17), ((576, 588), (578, 428), 15)]:
    A_h += tube(curve((bx, by), ((bx + tx) / 2 + 3, (by + ty) / 2), (tx, ty), 24), np.interp(np.linspace(0, 1, 24), [0, 0.12, 0.85, 1], [r + 6, r - 2, r - 3, r + 7]).astype(np.float32), trab_ends=0.22)
for (bx, by), dx in [((436, 408), -8), ((482, 398), -3), ((530, 402), 4), ((578, 418), 9)]:          # proximal phalanges run up over the handle, the rest of each finger curls round it (seen end-on: short, overlapping)
    A_h += tube(curve((bx, by), (bx + dx * 0.5, by - 38), (bx + dx, by - 78), 14), np.interp(np.linspace(0, 1, 14), [0, 0.15, 0.85, 1], [16, 12, 11, 15]).astype(np.float32), trab_ends=0.25)
    A_h += blob(bx + dx, by - 86, 15, 13, 0, 0.55) + blob(bx + dx * 0.9, by - 66, 13, 16, 0, 0.45)
for seg, rr_ in [(curve((600, 636), (628, 590), (646, 534), 20), [17, 14, 15]), (curve((646, 534), (652, 492), (646, 452), 16), [14, 11, 12]), (curve((646, 452), (636, 420), (622, 396), 10), [12, 10, 9])]:
    A_h += tube(seg, np.interp(np.linspace(0, 1, len(seg)), [0, 0.5, 1], rr_).astype(np.float32), trab_ends=0.3)      # thumb wraps the front of the handle
A_hs = limb([516, 510, 516, 528, 506], [262, 330, 460, 600, 720], [120, 142, 140, 118, 112], depth=0.6, mu=0.0026, fade=(40, 90))
hand = to_layer(A_h * 0.05 + A_hs, 1.0, TB, grain=0.05); save('xr_hand', hand)
# ---- dumbbell --------------------------------------------------------------------------------------------------------
A_b = np.zeros((H, W), np.float32); HY = 330
A_b += tube([(110, HY), (890, HY)], np.full(2, 30, np.float32), np.full(2, 0.0, np.float32), mu_c=1.0, mu_t=1.0, cap=0.2)
kn = ((np.sin(xx * 0.75) > 0.55) & (np.abs(yy - HY) < 27) & (np.abs(xx - 505) < 160)); A_b[kn] *= 0.9                  # knurling
for x0, x1, h, mu in [(242, 268, 150, 0.9), (732, 758, 150, 0.9), (172, 242, 620, 0.55), (758, 828, 620, 0.55), (110, 172, 580, 0.55), (828, 890, 580, 0.55)]:
    r = 18; m = np.zeros((H, W), np.float32); cv2.rectangle(m, (x0 + r, HY - h // 2), (x1 - r, HY + h // 2), 1, -1); cv2.rectangle(m, (x0, HY - h // 2 + r), (x1, HY + h // 2 - r), 1, -1)
    for cx_, cy_ in [(x0 + r, HY - h // 2 + r), (x1 - r, HY - h // 2 + r), (x0 + r, HY + h // 2 - r), (x1 - r, HY + h // 2 - r)]: cv2.circle(m, (cx_, cy_), r, 1, -1)
    edge = cv2.distanceTransform((m * 255).astype(np.uint8), cv2.DIST_L2, 5); core = np.clip((edge - 8) / 6, 0, 1)
    A_b += m * mu * (34 + 60 * core) * (1 + 0.03 * TRAB)                     # a rubber coat (less dense) round a steel core
bell = to_layer(A_b * 0.05, 1.0, TM, grain=0.03, blur=0.8); save('xr_bell', bell)
# ---- fixation: one plate on each bone, six screws each ---------------------------------------------------------------
A_x = np.zeros((H, W), np.float32)
for C, side, y0_, y1_ in [(RAD, 1, 0.30, 0.72), (ULN, -1, 0.32, 0.74)]:
    seg = C[int(y0_ * len(C)):int(y1_ * len(C))]; pl = seg + np.array([side * 18, 0], np.float32)
    A_x += tube(pl, np.full(len(pl), 9, np.float32), np.zeros(len(pl), np.float32), mu_c=3.0, mu_t=3.0, cap=0.6)
    for k in np.linspace(0, len(seg) - 1, 6).astype(int):
        p = seg[k]; a = (p[0] - side * 30, p[1] + 2); b = (p[0] + side * 22, p[1] - 2)
        A_x += tube([a, b], np.full(2, 4.2, np.float32), np.zeros(2, np.float32), mu_c=3.4, mu_t=3.4, cap=0.6)
        A_x += blob(p[0] + side * 22, p[1], 8, 6.5, 0, 3.2, spongy=False)          # screw head on the plate
fix = to_layer(A_x * 0.12, 1.0, TM, grain=0.02, blur=0.7); save('xr_fix', fix)
# ---- cast --------------------------------------------------------------------------------------------------------------
cast = [(352, 590), (660, 590), (684, 900), (694, 1250), (700, 1460), (300, 1460), (306, 1250), (318, 900)]
m = np.zeros((H, W), np.float32); cv2.fillPoly(m, [np.array(cast, np.int32)], 1.0); d = cv2.distanceTransform((m * 255).astype(np.uint8), cv2.DIST_L2, 5)
shell = np.clip(1 - np.abs(d - 9) / 9, 0, 1) * 0.9 + (d > 18) * 0.10
cst = to_layer(cv2.GaussianBlur(shell, (0, 0), 2) * (1 + 0.15 * noise(3, 9)), 1.2, (0.95, 0.93, 1.0), grain=0.12, blur=1.5); save('xr_cast', cst)
# ---- geometry for the scene ------------------------------------------------------------------------------------------
def at(C, f): return [float(v) for v in C[int(f * (len(C) - 1))]]
json.dump({'W': W, 'H': H, 'wrist': [500, 690], 'handleY': HY, 'radius': RAD.tolist(), 'ulna': ULN.tolist(),
           'fracture': {'radius': at(RAD, 0.50), 'ulna': at(ULN, 0.52)}, 'elbow': [500, 1520]}, open('/home/user/work/ep4/ep/xr_geom.json', 'w'))
# preview: everything together on the dark canvas
def comp(layers):
    acc = np.zeros((H, W, 3), np.float32)
    for L in layers: acc = acc + L[..., :3] * L[..., 3:]
    bg = np.zeros((H, W, 3), np.float32) + np.array([0.04, 0.02, 0.05])
    return np.clip(bg + acc, 0, 1)
cv2.imwrite('/home/user/work/ep4/samp/xray_preview.jpg', (np.hstack([comp([fore, hand, bell]), comp([fore, cst]), comp([fore, fix])])[..., ::-1] * 255).astype(np.uint8))
