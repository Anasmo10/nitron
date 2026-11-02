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

/* ═══ v2 (voice-driven) ═══ */
NK.W = (ctx, line, i) => ctx.wordTime(line, i).s;                         // absolute start of word i of VO line
/* richer stage: deep gradient, a slow diagonal light beam, grid with parallax */
NK.bg2 = (ctx, t, o = {}) => { const { X, W, H } = ctx;
  const g0 = X.createLinearGradient(0, 0, 0, H); g0.addColorStop(0, '#0A0A0C'); g0.addColorStop(1, o.bottom || '#14051B'); X.fillStyle = g0; X.fillRect(0, 0, W, H);
  const gy = o.glowY ?? 820, ga = o.glowA ?? 0.30; const g = X.createRadialGradient(540, gy, 30, 540, gy, 1000); g.addColorStop(0, `rgba(118,2,138,${ga})`); g.addColorStop(1, 'rgba(118,2,138,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  X.save(); X.translate(540, 960); X.rotate(-0.42); const bx = ((t * 60) % 2600) - 1300;
  const b = X.createLinearGradient(bx - 260, 0, bx + 260, 0); b.addColorStop(0, 'rgba(199,125,219,0)'); b.addColorStop(0.5, 'rgba(199,125,219,0.07)'); b.addColorStop(1, 'rgba(199,125,219,0)');
  X.fillStyle = b; X.fillRect(-1600, -1600, 3200, 3200); X.restore();
  const off = (t * 9) % 60; X.strokeStyle = 'rgba(255,255,255,0.03)'; X.lineWidth = 2; X.beginPath();
  for (let x = 0; x <= W; x += 60) { X.moveTo(x, 0); X.lineTo(x, H); } for (let y = -60 + off; y <= H; y += 60) { X.moveTo(0, y); X.lineTo(W, y); } X.stroke(); };
/* one big kinetic word/phrase that lands on its spoken word */
NK.slam = (ctx, t, str, x, y, t0, o = {}) => { const k = ctx.at(t, t0 - 0.05, t0 + 0.18, 'expoOut'); if (k <= 0) return 0; const out = o.out ? 1 - ctx.at(t, o.out, o.out + 0.2) : 1; if (out <= 0) return 0;
  const { X } = ctx; X.save(); X.globalAlpha = Math.min(1, k * 2) * out; const s = (o.from || 1.3) - ((o.from || 1.3) - 1) * k; X.translate(x, y); X.scale(s, s);
  ctx.text(X, str, 0, 0, { family: 'display', weight: 900, size: o.size || 140, color: o.color || '#FFFFFF', shadow: { blur: 30, y: 10, color: 'rgba(0,0,0,0.55)' } }); X.restore(); return k * out; };
NK.proj = (st, v, ctx) => { const p = v.clone().project(st.camera); return [(p.x + 1) / 2 * ctx.W, (1 - p.y) / 2 * ctx.H]; };

/* ═══ v2.1 type system: right-aligned editorial headline + kicker pill + lilac key words with a purple marker; notes on dark glass ═══ */
NK.head = (ctx, t, str, t0, o = {}) => { const { X } = ctx; const size = o.size || 110, x = o.x ?? 960, y = o.y ?? 300, align = o.align || 'right', hi = o.hi || [];
  const out = o.out ? 1 - ctx.at(t, o.out, o.out + 0.22) : 1; const kt0 = o.kt ?? t0; if (out <= 0 || t < Math.min(t0, kt0) - 0.15) return;
  const L = ctx.text.layout(X, str, { family: 'display', weight: 900, size, maxWidth: o.maxWidth || 900, lineHeight: 1.12 });
  const tw = i => (o.times && o.times[i] != null) ? o.times[i] : t0 + i * (o.gap ?? 0.08);
  X.save(); X.globalAlpha *= out;
  if (o.kicker) { const kk = ctx.at(t, kt0 - 0.12, kt0 + 0.2, 'expoOut'); if (kk > 0) { X.save(); X.globalAlpha *= kk; X.font = ctx.font('display', 800, 30); const w = X.measureText(o.kicker).width + 44;
    const kx = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x, ky = y - size * 0.95 - 58; X.fillStyle = 'rgba(118,2,138,0.92)'; NK.rr(X, kx, ky, w, 48, 24); X.fill();
    ctx.text(X, o.kicker, kx + w / 2, ky + 26, { family: 'display', weight: 800, size: 30, color: '#FFFFFF' }); X.restore(); } }
  const boxes = ctx.text.drawLayout(X, L, x, y, { align, color: o.color || '#FFFFFF', perWord: i => { const k = ctx.at(t, tw(i) - 0.04, tw(i) + 0.3, 'expoOut');
    return { clipUp: 1, dy: (1 - k) * size * 0.8, alpha: k > 0 ? 1 : 0, color: hi.includes(i) ? NK.LILAC : undefined }; } });
  boxes.forEach(b => { if (!hi.includes(b.i)) return; const k = ctx.at(t, tw(b.i) + 0.15, tw(b.i) + 0.45, 'expoOut'); if (k <= 0) return;
    X.fillStyle = NK.PURPLE; NK.rr(X, b.x + b.w * (1 - k), b.base + size * 0.14, b.w * k, Math.max(8, size * 0.09), size * 0.05); X.fill(); });
  if (o.strike != null) { const ks = ctx.at(t, o.strike, o.strike + 0.3, 'expoOut'); if (ks > 0 && boxes.length) { const x1 = Math.max(...boxes.map(b => b.x + b.w)), x0 = Math.min(...boxes.map(b => b.x)), yb = boxes[0].cy;
    X.strokeStyle = NK.LILAC; X.lineWidth = size * 0.11; X.lineCap = 'round'; X.beginPath(); X.moveTo(x1 + 10, yb); X.lineTo(x1 + 10 - (x1 - x0 + 20) * ks, yb); X.stroke(); } }
  X.restore(); };
NK.note = (ctx, t, str, t0, o = {}) => { const k = ctx.at(t, t0 - 0.08, t0 + 0.25, 'expoOut'); if (k <= 0) return; const out = o.out ? 1 - ctx.at(t, o.out, o.out + 0.2) : 1; if (out <= 0) return;
  const { X } = ctx; const size = o.size || 48, y = o.y ?? 1400, hi = o.hi || [];
  const L = ctx.text.layout(X, str, { family: 'display', weight: 800, size, maxWidth: 860, lineHeight: 1.25 }); const w = L.width + size * 1.5, h = L.height + size * 0.95;
  X.save(); X.globalAlpha *= Math.min(1, k * 1.6) * out; X.translate(0, (1 - k) * 24); NK.glass(X, 540 - w / 2, y - h / 2, w, h, Math.min(44, h / 2), { tint: 'rgba(10,10,12,0.55)' });
  ctx.text.drawLayout(X, L, 540, y - L.height / 2 + size * 0.78, { align: 'center', color: '#FFFFFF', perWord: i => ({ color: hi.includes(i) ? NK.LILAC : undefined }) });
  X.restore(); };

/* ═══ v2.1 realism kit (three.js): noise / knurl canvas textures, a real bumper plate, soft contact shadows ═══ */
NK.canvasTex = (THREE, n, paint, rep) => { const c = document.createElement('canvas'); c.width = c.height = n; paint(c.getContext('2d'), n);
  const tx = new THREE.CanvasTexture(c); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; if (rep) tx.repeat.set(rep[0], rep[1]); tx.anisotropy = 8; return tx; };
NK.noiseTex = (THREE, rep = [2, 2], lo = 110, hi = 200) => NK.canvasTex(THREE, 256, (g, n) => { const im = g.createImageData(n, n); let sd = 7;
  const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n * n; i++) { const v = lo + (hi - lo) * (0.6 * r() + 0.4 * r() * r()); im.data.set([v, v, v, 255], i * 4); } g.putImageData(im, 0, 0); }, rep);
NK.knurlTex = (THREE, rep) => NK.canvasTex(THREE, 128, (g, n) => { g.fillStyle = '#d8d9dc'; g.fillRect(0, 0, n, n); g.strokeStyle = '#55575c'; g.lineWidth = 9;
  for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * n, 0); g.lineTo(k * n + n, n); g.stroke(); g.beginPath(); g.moveTo(k * n + n, 0); g.lineTo(k * n, n); g.stroke(); } }, rep);
NK.shadowTex = (THREE) => NK.canvasTex(THREE, 128, (g, n) => { const r = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); r.addColorStop(0, 'rgba(0,0,0,1)'); r.addColorStop(0.45, 'rgba(0,0,0,0.55)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, n, n); });
NK.shadow = (THREE, w, d, op = 0.8) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: NK._sh || (NK._sh = NK.shadowTex(THREE)), transparent: true, opacity: op, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.renderOrder = 1; return m; };
/* bumper plate, axis = +Y (outer face +Y): bevelled rubber profile, recessed face with moulded text, painted lilac stripe on the raised rim, steel insert */
NK.bumper = (THREE, o = {}) => { const R = o.r || 0.225, w = o.w || 0.066, h = w / 2, g = new THREE.Group();
  const rub = NK._rub || (NK._rub = new THREE.MeshStandardMaterial({ color: 0x17171b, roughness: 0.82, metalness: 0.02, roughnessMap: NK.noiseTex(THREE, [3, 3], 150, 255), bumpMap: NK.noiseTex(THREE, [6, 6]), bumpScale: 0.6, side: THREE.DoubleSide }));
  const steel = NK._ins || (NK._ins = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 1, roughness: 0.3, roughnessMap: NK.noiseTex(THREE, [2, 2], 120, 200) }));
  const P = [[0.03, -0.80], [0.075, -0.80], [0.082, -0.74], [R * 0.80, -0.74], [R * 0.85, -1], [R * 0.955, -1], [R, -0.62], [R, 0.62], [R * 0.955, 1], [R * 0.85, 1], [R * 0.80, 0.74], [0.082, 0.74], [0.075, 0.80], [0.03, 0.80]].map(([r, y]) => new THREE.Vector2(r, y * h));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(P, 120), rub));
  const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.074, w * 0.86, 64), steel); g.add(ins);
  for (const s of [-1, 1]) { const lip = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.0045, 10, 64), steel); lip.rotation.x = Math.PI / 2; lip.position.y = s * w * 0.43; g.add(lip); }
  const stripe = new THREE.Mesh(new THREE.RingGeometry(R * 0.865, R * 0.94, 120), new THREE.MeshStandardMaterial({ color: 0x8e2aa6, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2 }));
  stripe.rotation.x = -Math.PI / 2; stripe.position.y = h + 0.0006; g.add(stripe);
  if (o.label !== false) { const tx = NK.canvasTex(THREE, 1024, (c, n) => { c.translate(n / 2, n / 2); c.textAlign = 'center'; c.textBaseline = 'middle';
      const arc = (str, rad, a0, size, col, sp) => { c.font = `800 ${size}px Inter`; c.fillStyle = col; const ch = [...str]; ch.forEach((q, i) => { c.save(); c.rotate(a0 + (i - (ch.length - 1) / 2) * sp); c.translate(0, -rad); c.fillText(q, 0, 0); c.restore(); }); };
      const rr = n / 2 * (R * 0.65) / (R * 0.8); arc('NITRON', rr, 0, 74, 'rgba(232,226,238,0.85)', 0.16); arc(o.kg || '20 KG', rr, Math.PI, 58, 'rgba(199,125,219,0.9)', 0.13); });
    const lab = new THREE.Mesh(new THREE.RingGeometry(0.09, R * 0.8, 120), new THREE.MeshStandardMaterial({ map: tx, transparent: true, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -2 }));
    lab.rotation.x = -Math.PI / 2; lab.position.y = h * 0.74 + 0.0006; g.add(lab); }
  return g; };
