/* مشاهد هالفيديو — طلبات المستخدم من داخل الفيديو نفسه:
   1) «كلود حط ورايا أهرامات»  → خلفية أهرامات ورا الشخص المقصوص (الجملة الأولى بس — قرار المستخدم)
   2) «حط إحصائية لعدد سكان مصر من 2018 لـ2026» → popChart (pop-scene.js)
   3) «قرّب الشاشة علي» → زوم على وجهه بجملة «الوضع الاقتصادي … كان منهار»
   4+5) «صور 2016 و2018» + «صور عن تعويم العملة» → لوحة التعويم + لوحة رأس الحكمة (رسوم، ما فيه صور من النت بهالبيئة)
   كل رقم أو تاريخ هنا من facts.md. التوقيتات على التايم-لاين الجديد (caps.json). */

/* حزمة الموشن تقرا الكانفس والألوان من window — المحرّك يعرّفها const/let فنمرّرها لها */
window.X = X;
function mkSync() { Object.assign(window, { BG, INK, ACC, CLAY, MUT, FONT }); }

/* ── التخطيط ── */
const T_CHART = 2.05;     /* «100» */
const T_ZOOM  = 6.91;     /* بداية «الوضع الاقتصادي لمصر في 2018 كان منهار» */
const T_FLOAT = 10.52;    /* «2018 انهار بسبب تعويم العملة» */
const T_HEKMA = 13.56;    /* «تحسن بسبب بيع راس الحكمة للإمارات» + «بيع أراضي مصرية» */
SCENES = [
  { s: 0,       e: T_CHART, m: R_FULL },
  { s: T_CHART, e: T_ZOOM,  m: R_LOWER },
  { s: T_ZOOM,  e: T_FLOAT, m: R_FULL },
  { s: T_FLOAT, e: 99,      m: R_DOWN, gb: 640 },
];
POP_AT = { s: T_CHART, hit: 3.22, e: T_ZOOM };

/* ── قصّ الكرت من فوق الراس (الخطوة 6.1): أعلى نقطة وصلها راسه بكل مقطع − 1.5٪ (مقاس بقناع الشخص) ──
   الجملة الأولى بلقطة قريبة (الراس عند 0) · الثانية عند 210 بكسل · الأخيرة عند 336 — القصّ يتغيّر بس عند القطع */
function cardTopAt(t) { return t < 3.995 ? 0.0 : (t < T_ZOOM ? 0.094 : 0.16); }
const _drawVideo0 = drawVideo;
drawVideo = function (t) { CARD_TOP = cardTopAt(t); _drawVideo0(t); };

/* ── رسم صورة بنفس قصّ drawVideo بالضبط (عشان الشخص المقصوص والخلفية يطابقون الفيديو بكل وضع وانتقال) ── */
function vgeo(t) {
  CARD_TOP = cardTopAt(t);
  const R = vrect(t), sw = 1080, shh = 1920;
  const kc = CARD_TOP == null ? 0 : cl((1919 - R.h) / 300, 0, 1), z = lerp(1, CARD_ZOOM, kc);
  const sc = Math.max(R.w / sw, R.h / shh) * z, cw = R.w / sc, ch = R.h / sc;
  const sx = (sw - cw) / 2, sy0 = (shh - ch) * FACE_ANCH, sy = CARD_TOP == null ? sy0 : lerp(sy0, cl(CARD_TOP * shh, 0, shh - ch), kc);
  return { R, sx, sy, cw, ch };
}
function vblit(img, g, zs, zc) {
  let { sx, sy, cw, ch } = g; const R = g.R;
  if (zs && zs > 1.0001) { sx = zc[0] - (zc[0] - sx) / zs; sy = zc[1] - (zc[1] - sy) / zs; cw /= zs; ch /= zs; }
  X.save(); rr(R.x, R.y, R.w, R.h, R.r); X.clip();
  X.drawImage(img, sx, sy, cw, ch, R.x, R.y, R.w, R.h); X.restore();
}

/* ── 1) خلفية الأهرامات (ترتسم مرة وحدة بكانفس جانبي) ── */
let _PYR = null;
function pyramidsCanvas() {
  if (_PYR) return _PYR;
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; const g = c.getContext('2d');
  const HZ = 905;                                                     /* خط الأفق */
  /* السما: كحلي فوق ← ذهبي عند الأفق (ساعة الغروب) */
  let sk = g.createLinearGradient(0, 0, 0, HZ);
  sk.addColorStop(0, '#0B1322'); sk.addColorStop(0.38, '#1B2A47'); sk.addColorStop(0.66, '#6E5A63');
  sk.addColorStop(0.86, '#D69A55'); sk.addColorStop(1, '#F4CD7E');
  g.fillStyle = sk; g.fillRect(0, 0, 1080, HZ + 2);
  /* نجوم خفيفة فوق */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) { const x = rnd() * 1080, y = rnd() * 360, r = 0.8 + rnd() * 1.6;
    g.globalAlpha = 0.25 + rnd() * 0.45 * (1 - y / 360); g.fillStyle = '#FFF6E0'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  /* الشمس + توهجها عند الأفق */
  const sx = 600, sy = HZ - 70;
  let gl = g.createRadialGradient(sx, sy, 10, sx, sy, 520);
  gl.addColorStop(0, 'rgba(255,226,150,0.95)'); gl.addColorStop(0.18, 'rgba(255,196,110,0.55)'); gl.addColorStop(1, 'rgba(255,170,90,0)');
  g.fillStyle = gl; g.fillRect(0, 0, 1080, HZ + 200);
  g.fillStyle = '#FFE7A8'; g.beginPath(); g.arc(sx, sy, 62, 0, 7); g.fill();
  /* هرم: وجه مضاء + وجه بالظل + مداميك حجر */
  function pyramid(px, py, half, base, litRight, cap) {
    g.save();
    g.fillStyle = litRight ? '#7E5530' : '#E2AE63';
    g.beginPath(); g.moveTo(px, py); g.lineTo(px - half, base); g.lineTo(px - half * 0.12, base); g.closePath(); g.fill();
    g.fillStyle = litRight ? '#E9B86C' : '#8A5C33';
    g.beginPath(); g.moveTo(px, py); g.lineTo(px - half * 0.12, base); g.lineTo(px + half, base); g.closePath(); g.fill();
    g.globalAlpha = 0.10; g.strokeStyle = '#3A2410'; g.lineWidth = 2;
    for (let y = py + 26; y < base; y += 22) { const k = (y - py) / (base - py);
      g.beginPath(); g.moveTo(px - half * k, y); g.lineTo(px + half * k, y); g.stroke(); }
    g.globalAlpha = 1;
    if (cap) { const ch = (base - py) * 0.16, k = ch / (base - py);   /* كسوة القمة (خفرع) */
      g.fillStyle = 'rgba(255,240,205,0.55)'; g.beginPath(); g.moveTo(px, py); g.lineTo(px - half * k, py + ch); g.lineTo(px + half * k, py + ch); g.closePath(); g.fill(); }
    g.restore();
  }
  pyramid(1000, 640, 210, HZ + 6, false, false);    /* منقرع — بعيد يمين */
  pyramid(205, 360, 560, HZ + 10, true, false);     /* خوفو — يسار، الأكبر */
  pyramid(850, 430, 470, HZ + 10, false, true);     /* خفرع — يمين، بكسوة القمة */
  /* ضباب الأفق يدمج قواعد الأهرامات بالرمل */
  let hz = g.createLinearGradient(0, HZ - 120, 0, HZ + 90);
  hz.addColorStop(0, 'rgba(255,214,150,0)'); hz.addColorStop(0.6, 'rgba(255,214,150,0.38)'); hz.addColorStop(1, 'rgba(255,214,150,0)');
  g.fillStyle = hz; g.fillRect(0, HZ - 120, 1080, 210);
  /* الرمل: كثبان بطبقات */
  let sd = g.createLinearGradient(0, HZ, 0, 1920);
  sd.addColorStop(0, '#E1A960'); sd.addColorStop(0.35, '#C1823F'); sd.addColorStop(1, '#6E4423');
  g.fillStyle = sd; g.fillRect(0, HZ, 1080, 1920 - HZ);
  [[HZ + 130, '#B97A3B', 0.55], [HZ + 330, '#A0662F', 0.6], [HZ + 600, '#7F4F25', 0.7]].forEach(([y, col, a], j) => {
    g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 1080; x += 30) g.lineTo(x, y + Math.sin(x / (170 + j * 60) + j * 1.7) * (26 + j * 10));
    g.lineTo(1080, 1920); g.lineTo(0, 1920); g.closePath(); g.fill(); });
  g.globalAlpha = 1;
  /* عمق الميدان: الخلفية أنعم شوي من الشخص */
  const c2 = document.createElement('canvas'); c2.width = 1080; c2.height = 1920; const g2 = c2.getContext('2d');
  g2.filter = 'blur(2.2px)'; g2.drawImage(c, 0, 0);
  /* تظليل خفيف للأطراف */
  g2.filter = 'none'; const vg = g2.createRadialGradient(540, 760, 300, 540, 900, 1250);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,10,20,0.45)'); g2.fillStyle = vg; g2.fillRect(0, 0, 1080, 1920);
  return (_PYR = c2);
}
const PYR_END = 3.983;                                  /* آخر فريم من الجملة الأولى (فريم 120) */
function pyramidsBg(t) {
  if (t >= PYR_END || !PRS_OK || PRS.naturalWidth < 100) return;   /* قصّة الشخص الحقيقية بس (فحص المنطقة الآمنة يحط صورة 1×1) */
  const g = vgeo(t);
  const push = 1 + 0.05 * ease(pr(t, 0, 2.0));          /* دخول ناعم بأول ثانيتين (حركة بأول ثانية للهوك) */
  const kb = push * (1 + 0.03 * pr(t, 0, 4));           /* الخلفية تتحرك أكثر شوي = عمق */
  vblit(pyramidsCanvas(), g, kb, [540, 760]);
  vblit(PRS, g, push, [560, 520]);
}
SCENE_LIST.push(['pyramidsBg', pyramidsBg, 'video']);

/* ── 3) «قرّب الشاشة علي» — زوم على وجهه طول جملة الوضع الاقتصادي ── */
const ZOOM_C = [520, 480], ZOOM_MAX = 1.38;
function zoomOnMe(t) {
  if (t < T_ZOOM || t >= T_FLOAT) return;
  const zs = 1 + (ZOOM_MAX - 1) * eio(pr(t, T_ZOOM + 0.05, T_ZOOM + 0.6));
  vblit(VF, vgeo(t), zs, ZOOM_C);
}
SCENE_LIST.push(['zoomOnMe', zoomOnMe, 'video']);

/* ── أدوات اللوحات (R_DOWN — الرسم فوق y 170..640) ── */
function wIn(t, s, d) { return ease(pr(t, s, s + (d || 0.35))); }
function pill(txt, cx, cy, k, fs) {
  if (k <= 0) return; fs = fs || 40;
  X.save(); X.globalAlpha *= k; X.font = '800 ' + fs + 'px ' + FONT; X.direction = 'rtl';
  const tw = X.measureText(txt).width, bw = tw + 64, bh = fs * 1.85;
  X.translate(cx, cy); X.scale(0.94 + 0.06 * k, 0.94 + 0.06 * k);
  X.fillStyle = ACC; rr(-bw / 2, -bh / 2, bw, bh, bh / 2); X.fill();
  X.fillStyle = onACC(); X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(txt, 0, 3); X.restore();
}
function head(title, sub, t, s) {
  const k = wIn(t, s, 0.4); if (k <= 0) return;
  X.save(); X.globalAlpha *= k; X.translate(0, (1 - k) * 22); X.direction = 'rtl'; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
  X.fillStyle = INK; X.font = '900 76px ' + FONT; X.fillText(title, 540, 262);
  X.fillStyle = MUT; X.font = '700 34px ' + FONT; X.fillText(sub, 540, 318); X.restore();
}
/* رقم يلف عمودياً من قيمة لقيمة (ثابت العرض) */
function rollNum(a, b, k, x, y, size, col) {
  X.save(); X.font = '900 ' + size + 'px ' + FONT; X.direction = 'ltr'; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
  X.beginPath(); X.rect(x - size * 2.4, y - size * 0.95, size * 4.8, size * 1.15); X.clip();
  const off = eio(k) * size * 1.05;
  X.fillStyle = INK; X.globalAlpha = 1 - eio(k) * 0.8; X.fillText(a, x, y - off);
  X.globalAlpha = Math.min(1, eio(k) * 1.4); X.fillStyle = col; X.fillText(b, x, y + size * 1.05 - off);
  X.restore();
}

/* ── 4) لوحة التعويم — «2018 انهار بسبب تعويم العملة» ── */
const FLIP = 12.66;      /* «تعويم» */
function floatPanel(t) {
  if (t < T_FLOAT || t >= T_HEKMA) return;
  mkSync();
  const S = T_FLOAT + 0.3, out = 1 - pr(t, T_HEKMA - 0.22, T_HEKMA);
  X.save(); X.globalAlpha *= out;
  head('تعويم الجنيه المصري', 'البنك المركزي · 3 نوفمبر 2016', t, S);
  const k = wIn(t, S + 0.15, 0.4);
  if (k > 0) {
    const [dx, dy] = MK.shake(t, FLIP + 0.45, 10);
    X.save(); X.globalAlpha *= k; X.translate(dx, dy + (1 - k) * 20);
    X.direction = 'rtl'; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
    X.fillStyle = INK; X.font = '800 50px ' + FONT; X.fillText('الدولار =', 820, 478);
    X.fillText('جنيه', 230, 478);
    rollNum('8.88', '13.00', pr(t, FLIP, FLIP + 0.45), 525, 488, 128, ACC);
    X.restore();
  }
  pill('تخفيض 32% بيوم واحد', 540, 585, wIn(t, FLIP + 0.45, 0.3), 38);
  X.restore();
}
SCENE_LIST.push(['floatPanel', floatPanel]);

/* ── 5) لوحة رأس الحكمة — «تحسن بسبب بيع راس الحكمة للإمارات» + «بيع أراضي مصرية» ── */
const HIT35 = 15.58, LAND = 16.89;   /* «الحكمة» · «بيع» */
function hekmaPanel(t) {
  if (t < T_HEKMA) return;
  mkSync();
  const S = T_HEKMA + 0.12;
  head('صفقة رأس الحكمة', 'مع الإمارات (ADQ) · فبراير 2024', t, S);
  const k = wIn(t, S + 0.15, 0.4);
  if (k > 0) {
    const [dx, dy] = MK.shake(t, HIT35, 10);
    X.save(); X.globalAlpha *= k; X.translate(dx, dy);
    const v = Math.round(35 * MK.ease.eExpo(pr(t, S + 0.2, HIT35)));
    const sl = pr(t, HIT35, HIT35 + 0.32), sc = sl > 0 && sl < 1 ? 1 + 0.12 * Math.sin(sl * Math.PI) : 1;
    X.save(); X.translate(640, 486); X.scale(sc, sc);
    X.font = '900 150px ' + FONT; X.direction = 'ltr'; X.textAlign = 'center'; X.textBaseline = 'alphabetic';
    X.fillStyle = ACC; X.fillText(String(v), 0, 0); X.restore();
    X.font = '800 50px ' + FONT; X.direction = 'rtl'; X.textAlign = 'right'; X.fillStyle = INK;
    X.fillText('مليار $', 520, 470);
    X.restore();
    if (t >= HIT35) MK.burst(t, { s: HIT35, cx: 640, cy: 420, spread: 220 });
  }
  pill('منها 24 مليار $ مقابل حقوق تطوير الأرض', 540, 590, wIn(t, LAND, 0.32), 34);
}
SCENE_LIST.push(['hekmaPanel', hekmaPanel]);

/* ── الختام: تثبيت آخر فريم 0.9 ث ويغمق — بدل كرت الإعلان الافتراضي (والصوت يتلاشى بعد آخر كلمة) ── */
outro = function (t) {
  if (t < VEND) return;
  const k = pr(t, VEND, DUR);
  drawVideo(VEND - 0.001);
  X.save(); X.globalAlpha = ease(k) * 0.9; X.fillStyle = BG; X.fillRect(0, 0, W, H); X.restore();
};
