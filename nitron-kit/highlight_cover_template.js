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
      X.save(); X.strokeStyle = '#FFFFFF'; X.lineWidth = 6; X.beginPath(); X.moveTo(cx - 104, cy + 54); X.quadraticCurveTo(cx - 200, cy + 40, cx - 170, cy - 90); X.stroke(); X.restore(); }
  } });
