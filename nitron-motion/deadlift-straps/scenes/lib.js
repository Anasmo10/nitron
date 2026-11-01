/* Nitron motion helpers — shared by every scene (loaded first; defines window.NK, no scene of its own).
   Identity: black #0A0A0C · white · purple #76028A (shapes) · light purple #C77DDB (purple text on dark) · Cairo 900. */
const NK = window.NK = {};
NK.PURPLE = '#76028A'; NK.LILAC = '#C77DDB'; NK.MUT = '#B8A9C0';
NK.rr = (X, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r);
  X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); };
NK.bg = (ctx, glowY = 760, glowA = 0.34) => { const { X, W, H } = ctx; X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(540, glowY, 40, 540, glowY, 980); g.addColorStop(0, `rgba(118,2,138,${glowA})`); g.addColorStop(1, 'rgba(118,2,138,0)');
  X.fillStyle = g; X.fillRect(0, 0, W, H); X.strokeStyle = 'rgba(255,255,255,0.032)'; X.lineWidth = 2; X.beginPath();
  for (let x = 0; x <= W; x += 60) { X.moveTo(x, 0); X.lineTo(x, H); } for (let y = 0; y <= H; y += 60) { X.moveTo(0, y); X.lineTo(W, y); } X.stroke(); };
/* liquid-glass panel on the dark stage: translucent white body, top sheen, bright rim top-left → bottom-right */
NK.glass = (X, x, y, w, h, r, o = {}) => { X.save();
  X.shadowColor = 'rgba(0,0,0,0.45)'; X.shadowBlur = 40; X.shadowOffsetY = 16; NK.rr(X, x, y, w, h, r);
  const f = X.createLinearGradient(x, y, x, y + h); f.addColorStop(0, `rgba(255,255,255,${o.a0 ?? 0.13})`); f.addColorStop(1, `rgba(255,255,255,${o.a1 ?? 0.05})`);
  X.fillStyle = f; X.fill(); X.shadowColor = 'transparent';
  if (o.tint) { NK.rr(X, x, y, w, h, r); X.fillStyle = o.tint; X.fill(); }
  X.save(); NK.rr(X, x, y, w, h, r); X.clip(); const s = X.createLinearGradient(0, y, 0, y + h * 0.5);
  s.addColorStop(0, 'rgba(255,255,255,0.14)'); s.addColorStop(1, 'rgba(255,255,255,0)'); X.fillStyle = s; X.fillRect(x, y, w, h * 0.5); X.restore();
  const g = X.createLinearGradient(x, y, x + w * 0.6, y + h * 1.6); g.addColorStop(0, 'rgba(255,255,255,0.75)'); g.addColorStop(0.3, 'rgba(255,255,255,0.12)');
  g.addColorStop(0.7, 'rgba(255,255,255,0.06)'); g.addColorStop(1, 'rgba(255,255,255,0.45)'); X.strokeStyle = g; X.lineWidth = 2.4;
  NK.rr(X, x + 1.2, y + 1.2, w - 2.4, h - 2.4, r - 1.2); X.stroke(); X.restore(); };
/* a line of Arabic that rises word by word (reading order) — never letter by letter */
NK.words = (ctx, t, str, x, y, o = {}) => { const { X } = ctx; const size = o.size || 72;
  const L = ctx.text.layout(X, str, { family: o.family || 'display', weight: o.weight || 900, size, maxWidth: o.maxWidth || 900, lineHeight: o.lineHeight || 1.25 });
  const n = L.words ? L.words.length : 0, out = o.out ?? 1e9;
  return ctx.text.drawLayout(X, L, x, y, { align: o.align || 'center', color: o.color || '#FFFFFF', perWord: (i, w) => {
    const j = o.rtlIndex === false ? i : i; const t0 = (o.t0 || 0) + j * (o.gap ?? 0.07), k = ctx.at(t, t0, t0 + (o.dur || 0.32), 'expoOut');
    const ko = 1 - ctx.at(t, out, out + 0.22, 'cubicIn');
    return { clipUp: 1, dy: (1 - k) * size * 0.7 - (1 - ko) * size * 0.4, alpha: (k > 0 ? 1 : 0) * ko,
             color: (o.hi || []).includes(j) ? (o.hiColor || NK.LILAC) : undefined }; } }); };
/* small Latin source line, bottom of the frame (inside the safe zone) */
NK.source = (ctx, t, str, t0, y = 1468, out = 1e9) => { const k = ctx.at(t, t0, t0 + 0.3) * (1 - ctx.at(t, out, out + 0.2)); if (k <= 0) return;
  const { X } = ctx; X.save(); X.globalAlpha = k; X.fillStyle = NK.PURPLE; NK.rr(X, 90, y - 18, 8, 36, 4); X.fill();
  ctx.text(X, str, 112, y, { family: 'num', weight: 500, size: 27, color: 'rgba(255,255,255,0.62)', align: 'left', dir: 'ltr' }); X.restore(); };
NK.arrow = (X, x0, y0, x1, y1, w, color, head = 26) => { const a = Math.atan2(y1 - y0, x1 - x0); X.save(); X.strokeStyle = color; X.fillStyle = color;
  X.lineWidth = w; X.lineCap = 'round'; X.beginPath(); X.moveTo(x0, y0); X.lineTo(x1 - Math.cos(a) * head * 0.6, y1 - Math.sin(a) * head * 0.6); X.stroke();
  X.beginPath(); X.moveTo(x1, y1); X.lineTo(x1 - Math.cos(a - 0.45) * head, y1 - Math.sin(a - 0.45) * head); X.lineTo(x1 - Math.cos(a + 0.45) * head, y1 - Math.sin(a + 0.45) * head); X.closePath(); X.fill(); X.restore(); };
NK.label = (ctx, t, str, x, y, tx, ty, t0, o = {}) => { const k = ctx.at(t, t0, t0 + 0.35, 'expoOut'); if (k <= 0) return; const { X } = ctx; X.save(); X.globalAlpha = Math.min(1, k * 1.5) * (o.alpha ?? 1);
  X.strokeStyle = 'rgba(255,255,255,0.55)'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(x, y); X.lineTo(ctx.lerp(x, tx, k), ctx.lerp(y, ty, k)); X.stroke();
  X.fillStyle = '#FFFFFF'; X.beginPath(); X.arc(x, y, 7, 0, 7); X.fill();
  ctx.text(X, str, tx + (o.dx ?? 0), ty - 30, { family: 'display', weight: 800, size: o.size || 38, color: o.color || '#FFFFFF', align: o.align || 'center' }); X.restore(); };
NK.chip = (ctx, x, y, str, k, o = {}) => { if (k <= 0) return; const { X } = ctx; X.save(); X.globalAlpha = Math.min(1, k * 1.6); const size = o.size || 40;
  X.font = ctx.font('display', 900, size); const w = X.measureText(str).width + size * 1.4, h = size * 1.7, s = 0.92 + 0.08 * k;
  X.translate(x, y + (1 - k) * 20); X.scale(s, s); X.fillStyle = o.fill || NK.PURPLE; NK.rr(X, -w / 2, -h / 2, w, h, h / 2); X.fill();
  ctx.text(X, str, 0, 2, { family: 'display', weight: 900, size, color: '#FFFFFF' }); X.restore(); };
