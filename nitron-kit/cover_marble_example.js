/* cover — product-photo look: dark purple marble (like the strap product shots), the real blue strap on the hand, headline from the caption, exercise chips. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx; let sd = 11; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    // marble: near-black base, glossy purple pools, thin white veins
    X.fillStyle = '#0B090E'; X.fillRect(0, 0, ctx.W, ctx.H);
    X.save(); X.filter = 'blur(22px)'; for (let i = 0; i < 9; i++) { const x = r() * 1080, y = r() * 1920, rad = 80 + r() * 220; const g = X.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${110 + r() * 40 | 0},20,${150 + r() * 40 | 0},0.55)`); g.addColorStop(1, 'rgba(60,0,80,0)'); X.fillStyle = g; X.beginPath(); X.ellipse(x, y, rad * (1 + r()), rad * 0.45, r() * 3, 0, 7); X.fill(); } X.restore();
    const vein = (w, col, blur) => { X.save(); X.strokeStyle = col; X.lineWidth = w; X.shadowColor = col; X.shadowBlur = blur; X.lineCap = 'round';
      const y0 = r() * 1920, y1 = y0 + (r() - 0.5) * 900; X.beginPath(); X.moveTo(-60, y0); X.bezierCurveTo(300, y0 + (r() - 0.5) * 500, 760, y1 + (r() - 0.5) * 500, 1140, y1); X.stroke(); X.restore(); };
    for (let i = 0; i < 3; i++) vein(14, 'rgba(150,40,190,0.16)', 30); for (let i = 0; i < 5; i++) vein(1.3, 'rgba(235,225,245,0.28)', 4);
    const vg = X.createRadialGradient(540, 960, 300, 540, 960, 1150); vg.addColorStop(0, 'rgba(10,10,12,0)'); vg.addColorStop(1, 'rgba(10,10,12,0.75)'); X.fillStyle = vg; X.fillRect(0, 0, ctx.W, ctx.H);
    // the hand with the strap, from the bottom right, with a soft shadow
    const img = ctx.img('arm'); if (img) { const w = 600, h = w * img.height / img.width; X.save(); X.translate(560, 1150); X.rotate(-0.06);
      X.shadowColor = 'rgba(0,0,0,0.7)'; X.shadowBlur = 50; X.shadowOffsetY = 30; X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); }
    // headline (from the caption)
    ctx.text(X, 'مو ناقصك قوة…', 540, 570, { family: 'display', weight: 900, size: 104, color: '#FFFFFF', align: 'center', shadow: { color: 'rgba(0,0,0,0.6)', blur: 30, y: 10 } });
    ctx.text(X, 'ناقصك الأدوات الصح', 540, 690, { family: 'display', weight: 900, size: 80, color: NK.LILAC, align: 'center', shadow: { color: 'rgba(0,0,0,0.6)', blur: 30, y: 10 } });
    // exercise chips on the left
    X.font = ctx.font('num', 800, 28); const tw = X.measureText('NITRON WRIST STRAPS').width + 52; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - tw / 2, 740, tw, 50, 25); X.fill();
    ctx.text(X, 'NITRON WRIST STRAPS', 540, 766, { family: 'num', weight: 800, size: 28, color: '#FFFFFF', dir: 'ltr' });
    ['سحب علوي', 'تجديف', 'ديدلفت'].forEach((q, i) => { const cw = 300, x = 540 + (1 - i) * 320 - cw / 2, y = 1360; NK.glass(X, x, y, cw, 96, 48, { tint: 'rgba(10,10,12,0.62)' });
      X.fillStyle = NK.LILAC; X.beginPath(); X.arc(x + cw - 40, y + 48, 12, 0, 7); X.fill(); ctx.text(X, q, x + (cw - 56) / 2 + 6, y + 60, { family: 'display', weight: 900, size: 40, color: '#FFFFFF' }); });
    const logo = ctx.img('logo'); if (logo) { const w = 330, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
