/* cover style C — editorial split: tall framed product photo on the right, stacked headline on the left, a lilac "path" arrow over the photo. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const g = X.createRadialGradient(760, 960, 50, 760, 960, 900); g.addColorStop(0, 'rgba(118,2,138,0.42)'); g.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = g; X.fillRect(0, 0, ctx.W, ctx.H);
    X.strokeStyle = 'rgba(255,255,255,0.05)'; X.lineWidth = 1; for (let x = 0; x <= 1080; x += 60) { X.beginPath(); X.moveTo(x, 0); X.lineTo(x, 1920); X.stroke(); } for (let y = 0; y <= 1920; y += 60) { X.beginPath(); X.moveTo(0, y); X.lineTo(1080, y); X.stroke(); }
    // photo panel
    const img = ctx.img('shot'), px = 480, py = 430, pw = 560, ph = 1060;
    X.save(); X.shadowColor = 'rgba(118,2,138,0.8)'; X.shadowBlur = 60; NK.rr(X, px, py, pw, ph, 46); X.fillStyle = '#000'; X.fill(); X.restore();
    X.save(); NK.rr(X, px, py, pw, ph, 46); X.clip(); if (img) X.drawImage(img, px, py, pw, ph);
    const sh = X.createLinearGradient(0, py + ph * 0.55, 0, py + ph); sh.addColorStop(0, 'rgba(10,10,12,0)'); sh.addColorStop(1, 'rgba(10,10,12,0.85)'); X.fillStyle = sh; X.fillRect(px, py, pw, ph);
    // the pull path: a glowing dashed arc with an arrowhead
    X.save(); X.shadowColor = NK.LILAC; X.shadowBlur = 24; X.strokeStyle = NK.LILAC; X.lineWidth = 9; X.lineCap = 'round'; X.setLineDash([26, 18]);
    X.beginPath(); X.moveTo(px + 90, py + ph - 120); X.bezierCurveTo(px + 60, py + 640, px + 200, py + 360, px + 430, py + 240); X.stroke(); X.setLineDash([]);
    X.fillStyle = NK.LILAC; X.translate(px + 430, py + 240); X.rotate(-0.48); X.beginPath(); X.moveTo(34, 0); X.lineTo(-14, -24); X.lineTo(-14, 24); X.closePath(); X.fill(); X.restore();
    X.restore();
    X.strokeStyle = 'rgba(255,255,255,0.35)'; X.lineWidth = 3; NK.rr(X, px, py, pw, ph, 46); X.stroke();
    // chip on the photo
    X.font = ctx.font('display', 900, 36); const lw = X.measureText('ستراب السحب').width + 64; X.fillStyle = NK.PURPLE; NK.rr(X, px + pw / 2 - lw / 2, py + ph - 96, lw, 58, 29); X.fill();
    ctx.text(X, 'ستراب السحب', px + pw / 2, py + ph - 66, { family: 'display', weight: 900, size: 36, color: '#FFFFFF' });
    // stacked headline on the left (right-aligned to the photo's edge)
    const R = 440; X.font = ctx.font('display', 800, 30); const kw = X.measureText('تمارين السحب').width + 44; X.fillStyle = 'rgba(118,2,138,0.95)'; NK.rr(X, R - kw, 470, kw, 50, 25); X.fill();
    ctx.text(X, 'تمارين السحب', R - kw / 2, 497, { family: 'display', weight: 800, size: 30, color: '#FFFFFF' });
    const line = (s, y, size, col) => ctx.text(X, s, R, y, { family: 'display', weight: 900, size, color: col, align: 'right' });
    line('خلّي', 650, 88, '#FFFFFF'); line('سحبتك', 790, 112, '#FFFFFF'); line('تاخد', 925, 88, '#FFFFFF'); line('مسارها', 1075, 108, NK.LILAC); line('الصح', 1240, 140, NK.LILAC);
    X.font = ctx.font('display', 900, 140); const ws = X.measureText('الصح').width; X.fillStyle = NK.PURPLE; NK.rr(X, R - ws, 1270, ws, 16, 8); X.fill();
    const logo = ctx.img('logo'); if (logo) { const w = 360, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1610 - h / 2, w, h); }
  } });
