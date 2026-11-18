"""EP07: ep/behind.json — the frames whose person layer (ep/bt/person) goes back over things drawn behind Ahmad
(the wall words in P1 and P2, the orbiting sources in P4), and per frame the top of his head (the first row of the
cut-out with alpha > 0.5 in the middle third) so nkWallWords sinks each word just behind his hair."""
import json, os, cv2, numpy as np
W = '/home/user/work/ep7/ep'
RANGES = [[119, 196], [368, 450], [909, 1012]]
faces = {}
for a, b in RANGES:
    for i in range(a, b + 1):
        p = f'{W}/bt/person/{i:05d}.png'
        if not os.path.exists(p): continue
        al = cv2.imread(p, cv2.IMREAD_UNCHANGED)[..., 3][:, 300:780]
        rows = np.where((al > 127).sum(1) > 6)[0]
        if len(rows): faces[i] = {'y': int(rows[0]), 'h': 0}
json.dump({'lines': [], 'faces': faces, 'ranges': RANGES}, open(f'{W}/behind.json', 'w'))
ys = [f['y'] for f in faces.values()]
print('frames with a head top', len(faces), 'min/median/max', min(ys) if ys else '-', int(np.median(ys)) if ys else '-', max(ys) if ys else '-')
