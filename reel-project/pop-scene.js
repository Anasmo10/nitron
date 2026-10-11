/* إحصائية سكان مصر 2018 ← 2026 (الجهاز المركزي للتعبئة العامة والإحصاء — السكان بالداخل في 1 يناير)
   الأرقام من facts.md فقط. الخط الزمني من اليسار (2018) لليمين (2026) — النمو يطلع لفوق لليمين ويُقرأ بنظرة.
   POP_AT = {s: بداية المشهد (كلمة «مصر»), hit: لحظة «مليون» — ينتهي عندها رسم الخط, e: النهاية} */
const POP = [[2018, 96.3], [2019, 98.1], [2020, 99.8], [2021, 101.5], [2022, 102.9],
             [2023, 104.4], [2024, 105.9], [2025, 107.3], [2026, 108.5]];
let POP_AT = { s: 0, hit: 2.2, e: 6 };
function popChart(t) {
  const { s: S, hit: HIT, e: E } = POP_AT;
  if (t < S - 0.02 || t > E) return;
  const kin = ease(pr(t, S, S + 0.35)), kout = 1 - pr(t, E - 0.28, E);
  const D0 = S + 0.25, D1 = HIT;                     /* الخط يرتسم من D0 لين لحظة «مليون» */
  const k = eio(pr(t, D0, D1));
  const n = POP.length, x0 = 170, x1 = 960, y0 = 650, y1 = 990, lo = 94, hi = 110;
  const px = i => lerp(x0, x1, i / (n - 1)), py = v => lerp(y1, y0, (v - lo) / (hi - lo));
  X.save(); X.globalAlpha *= kin * kout;
  X.translate(0, (1 - kin) * 26);

  /* العنوان */
  X.direction = 'rtl'; X.textAlign = 'right'; X.textBaseline = 'alphabetic';
  X.textAlign = 'center'; X.fillStyle = INK; X.font = '900 80px ' + FONT; X.fillText('عدد سكان مصر', 540, 258);
  X.fillStyle = MUT; X.font = '700 36px ' + FONT; X.fillText('بالداخل · بالمليون نسمة', 540, 316);

  /* الرقم الحي عند رأس الخط */
  const fi = k * (n - 1), i0 = Math.floor(fi), i1 = Math.min(n - 1, i0 + 1);
  const val = POP[i0][1], yr = POP[i0][0];   /* يقفز على أرقام السنوات بس — ولا رقم من برّا facts.md */
  const slam = pr(t, HIT, HIT + 0.32), sc = slam > 0 && slam < 1 ? 1 + 0.10 * Math.sin(slam * Math.PI) : 1;
  X.save(); X.translate(540, 448); X.scale(sc, sc);
  X.direction = 'ltr'; X.textAlign = 'center'; X.fillStyle = ACC; X.font = '900 128px ' + FONT;
  X.fillText(val.toFixed(1), 0, 0); X.restore();
  if (t < HIT) { X.direction = 'ltr'; X.textAlign = 'center'; X.fillStyle = rgba(INK, 0.7); X.font = '800 36px ' + FONT;
    X.fillText(String(yr), 540, 512); }

  /* الشبكة وتسميات المحور */
  X.lineWidth = 2; X.setLineDash([6, 12]);
  [95, 100, 105, 110].forEach(v => {
    const y = py(v); X.strokeStyle = rgba(INK, 0.14); X.beginPath(); X.moveTo(x0 - 20, y); X.lineTo(x1 + 20, y); X.stroke();
    X.setLineDash([]); X.fillStyle = rgba(INK, 0.45); X.font = '700 28px ' + FONT; X.direction = 'ltr'; X.textAlign = 'left';
    X.fillText(String(v), 52, y + 10); X.setLineDash([6, 12]); });
  X.setLineDash([]);

  /* السنوات */
  POP.forEach(([y], i) => {
    const on = i <= fi + 0.001;
    X.fillStyle = on ? rgba(INK, 0.92) : rgba(INK, 0.32); X.font = (on ? '800 ' : '600 ') + '30px ' + FONT;
    X.direction = 'ltr'; X.textAlign = 'center'; X.fillText(String(y), px(i), 1040); });

  if (k > 0) {
    const P = POP.map(([, v], i) => [px(i), py(v)]);
    const hx = lerp(P[i0][0], P[i1][0], fi - i0), hy = lerp(P[i0][1], P[i1][1], fi - i0);
    /* تعبئة تحت الخط */
    const g = X.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, rgba(ACC, 0.34)); g.addColorStop(1, rgba(ACC, 0));
    X.beginPath(); X.moveTo(P[0][0], y1); for (let i = 0; i <= i0; i++) X.lineTo(P[i][0], P[i][1]); X.lineTo(hx, hy); X.lineTo(hx, y1); X.closePath();
    X.fillStyle = g; X.fill();
    /* الخط */
    X.beginPath(); X.moveTo(P[0][0], P[0][1]); for (let i = 1; i <= i0; i++) X.lineTo(P[i][0], P[i][1]); X.lineTo(hx, hy);
    X.strokeStyle = ACC; X.lineWidth = 9; X.lineJoin = 'round'; X.lineCap = 'round'; X.stroke();
    /* نقاط السنوات */
    for (let i = 0; i <= i0; i++) { X.fillStyle = BG; X.beginPath(); X.arc(P[i][0], P[i][1], 11, 0, 7); X.fill();
      X.strokeStyle = ACC; X.lineWidth = 5; X.stroke(); }
    /* الرأس النابض */
    X.fillStyle = ACC; X.beginPath(); X.arc(hx, hy, 15, 0, 7); X.fill();
    const pu = ((t - D0) * 1.3) % 1; X.save(); X.globalAlpha *= 1 - pu; X.strokeStyle = ACC; X.lineWidth = 4;
    X.beginPath(); X.arc(hx, hy, 18 + pu * 40, 0, 7); X.stroke(); X.restore();
    /* أول رقم */
    X.fillStyle = INK; X.font = '800 38px ' + FONT; X.direction = 'ltr'; X.textAlign = 'center';
    X.fillText('96.3', P[0][0], P[0][1] - 34);
    if (fi >= n - 1.001) { X.fillStyle = ACC; X.fillText('108.5', P[n - 1][0], P[n - 1][1] - 36); }
  }

  /* شارة الزيادة — تخبط لحظة «مليون» */
  const kb = ease(pr(t, HIT, HIT + 0.3));
  if (kb > 0) {
    const txt = '+12.2 مليون خلال 8 سنوات';
    X.font = '800 44px ' + FONT; X.direction = 'rtl';
    const tw = X.measureText(txt).width, bw = tw + 70, bh = 80, bx = 540 - bw / 2, by = 478;
    X.save(); X.translate(540, by + bh / 2); X.scale(0.94 + 0.06 * kb, 0.94 + 0.06 * kb); X.translate(-540, -(by + bh / 2));
    X.globalAlpha *= kb; X.fillStyle = ACC; rr(bx, by, bw, bh, bh / 2); X.fill();
    X.fillStyle = onACC(); X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, 540, by + bh / 2 + 3);
    X.restore();
  }

  /* المصدر */
  X.globalAlpha *= 0.75; X.fillStyle = MUT; X.font = '600 25px ' + FONT; X.direction = 'rtl'; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
  X.fillText('المصدر: الجهاز المركزي للتعبئة العامة والإحصاء — السكان بالداخل في 1 يناير', 540, 1098);
  X.restore();
}
SCENE_LIST.push(['popChart', popChart]);
