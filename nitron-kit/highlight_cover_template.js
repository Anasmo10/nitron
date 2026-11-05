window.HL='questions';
/* Instagram highlight cover (story 1080×1920, icon inside the centre circle): black, purple glow, lilac ring, bold icon. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, K = window.HL, cx = 540, cy = 960;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const g = X.createRadialGradient(cx, cy, 40, cx, cy, 560); g.addColorStop(0, 'rgba(118,2,138,0.75)'); g.addColorStop(0.6, 'rgba(75,1,88,0.25)'); g.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = g; X.fillRect(0, 0, ctx.W, ctx.H);
    X.save(); X.shadowColor = NK.LILAC; X.shadowBlur = 36; X.strokeStyle = NK.LILAC; X.lineWidth = 7; X.beginPath(); X.arc(cx, cy, 340, 0, 7); X.stroke(); X.restore();
    X.strokeStyle = 'rgba(199,125,219,0.25)'; X.lineWidth = 2; X.beginPath(); X.arc(cx, cy, 372, 0, 7); X.stroke();
    X.lineCap = 'round'; X.lineJoin = 'round';
    if (K === 'essentials') { // dumbbell + check badge
      X.save(); X.translate(cx, cy - 10); X.rotate(-0.35); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      X.fillStyle = '#FFFFFF'; NK.rr(X, -170, -16, 340, 32, 16); X.fill();
      for (const s of [-1, 1]) { X.fillStyle = NK.LILAC; NK.rr(X, s * 150 - 34, -110, 68, 220, 22); X.fill(); X.fillStyle = '#FFFFFF'; NK.rr(X, s * 222 - 26, -76, 52, 152, 18); X.fill(); }
      X.restore();
      X.save(); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 24; X.fillStyle = NK.PURPLE; X.beginPath(); X.arc(cx + 150, cy + 150, 78, 0, 7); X.fill(); X.restore();
      X.strokeStyle = '#FFFFFF'; X.lineWidth = 6; X.beginPath(); X.arc(cx + 150, cy + 150, 78, 0, 7); X.stroke();
      X.lineWidth = 18; X.beginPath(); X.moveTo(cx + 112, cy + 152); X.lineTo(cx + 140, cy + 182); X.lineTo(cx + 192, cy + 118); X.stroke(); }
    if (K === 'offers') { // price tag with %
      X.save(); X.translate(cx + 10, cy); X.rotate(-0.55); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      const w = 420, h = 250; X.beginPath(); X.moveTo(-w / 2 + 90, -h / 2); X.lineTo(w / 2 - 26, -h / 2); X.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 26); X.lineTo(w / 2, h / 2 - 26); X.quadraticCurveTo(w / 2, h / 2, w / 2 - 26, h / 2);
      X.lineTo(-w / 2 + 90, h / 2); X.lineTo(-w / 2, 0); X.closePath(); X.fillStyle = NK.LILAC; X.fill(); X.restore();
      X.save(); X.translate(cx + 10, cy); X.rotate(-0.55); X.fillStyle = '#0A0A0C'; X.beginPath(); X.arc(-120, 0, 26, 0, 7); X.fill(); X.strokeStyle = '#FFFFFF'; X.lineWidth = 6; X.beginPath(); X.arc(-120, 0, 26, 0, 7); X.stroke();
      ctx.text(X, '%', 60, 52, { family: 'num', weight: 900, size: 190, color: '#FFFFFF', dir: 'ltr' }); X.restore();
      X.save(); X.strokeStyle = '#FFFFFF'; X.lineWidth = 6; X.beginPath(); X.moveTo(cx - 236, cy - 250); X.quadraticCurveTo(cx - 290, cy - 330, cx - 200, cy - 360); X.stroke(); X.restore(); }
    if (K === 'questions') { // two speech bubbles: a lilac one behind, a white one in front with a purple «؟»
      const bubble = (x, y, w, h, r, tail) => { X.beginPath(); X.moveTo(x + r, y); X.lineTo(x + w - r, y); X.quadraticCurveTo(x + w, y, x + w, y + r); X.lineTo(x + w, y + h - r);
        X.quadraticCurveTo(x + w, y + h, x + w - r, y + h); X.lineTo(x + tail[0] + 70, y + h); X.lineTo(x + tail[0], y + h + tail[1]); X.lineTo(x + tail[0] + 10, y + h);
        X.lineTo(x + r, y + h); X.quadraticCurveTo(x, y + h, x, y + h - r); X.lineTo(x, y + r); X.quadraticCurveTo(x, y, x + r, y); X.closePath(); };
      X.save(); X.translate(cx + 95, cy - 120); X.rotate(0.10); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      X.scale(-1, 1); bubble(-130, -95, 260, 170, 50, [150, 60]); X.fillStyle = NK.LILAC; X.fill(); X.restore();
      X.save(); X.fillStyle = '#0A0A0C'; for (const dx of [-60, 0, 60]) { X.beginPath(); X.arc(cx + 95 + dx, cy - 125 + dx * 0.1, 15, 0, 7); X.fill(); } X.restore();
      X.save(); X.translate(cx - 50, cy + 70); X.rotate(-0.08); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      bubble(-180, -135, 360, 250, 64, [40, 80]); X.fillStyle = '#FFFFFF'; X.fill(); X.restore();
      X.save(); X.translate(cx - 50, cy + 60); X.rotate(-0.08); ctx.text(X, '؟', 0, 118, { family: 'display', weight: 900, size: 215, color: NK.PURPLE }); X.restore(); }
  } });
