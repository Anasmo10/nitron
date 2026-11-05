"""Nitron kit — zoom-through transition at a hard cut.  python3 zoom_cut.py <work> <first frame of the new shot> [frames each side=3] [peak zoom=1.16]

Rewrites <work>/vfr in place: the last N frames of the outgoing shot push in towards the centre with a short radial
motion blur, the first N frames of the incoming shot land from the same zoom back to 1.0. No overlap, no ghosting
(a dissolve between two different takes showed both faces at once), and the picture never stops moving across the cut
(client, 5 Nov: «بين لقطة 1 و2 في مثل لاج»). Pair it with a whoosh whose peak sits on the cut, and keep the music running.
"""
import sys, cv2, numpy as np
W, C = sys.argv[1], int(sys.argv[2]); N = int(sys.argv[3]) if len(sys.argv) > 3 else 3; ZP = float(sys.argv[4]) if len(sys.argv) > 4 else 1.16

def zoom(im, z, blur):
    h, w = im.shape[:2]; acc = np.zeros_like(im, np.float32); taps = 6 if blur > 0 else 1
    for j in range(taps):   # radial blur: average of slightly different zooms around the centre
        zz = z * (1 + blur * j / max(1, taps - 1)); M = cv2.getRotationMatrix2D((w / 2, h / 2), 0, zz)
        acc += cv2.warpAffine(im, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32)
    return (acc / taps).clip(0, 255).astype(np.uint8)

for i in range(N):   # outgoing: 1 → ZP, blur grows
    k = C - N + i; u = (i + 1) / N; z = 1 + (ZP - 1) * u * u; f = f"{W}/vfr/{k:05d}.jpg"
    cv2.imwrite(f, zoom(cv2.imread(f), z, 0.05 * u), [cv2.IMWRITE_JPEG_QUALITY, 95])
for i in range(N):   # incoming: ZP → 1, blur fades
    k = C + i; u = 1 - i / N; z = 1 + (ZP - 1) * u * u; f = f"{W}/vfr/{k:05d}.jpg"
    cv2.imwrite(f, zoom(cv2.imread(f), z, 0.05 * u), [cv2.IMWRITE_JPEG_QUALITY, 95])
print(f"zoom cut at frame {C}: frames {C - N}–{C + N - 1}")
