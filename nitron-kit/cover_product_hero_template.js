/* cover — product hero (no barbell): dark studio, purple spotlight + glow, the product big in the middle with a contact shadow, headline, tag, badge. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, C = window.COVER;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 760, 40, 540, 980, 900); sp.addColorStop(0, 'rgba(118,2,138,0.6)'); sp.addColorStop(0.5, 'rgba(75,1,88,0.22)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    const fl = X.createLinearGradient(0, 1180, 0, 1920); fl.addColorStop(0, 'rgba(40,30,50,0)'); fl.addColorStop(0.15, 'rgba(40,30,50,0.55)'); fl.addColorStop(1, 'rgba(10,10,12,1)'); X.fillStyle = fl; X.fillRect(0, 1180, 1080, 740);
    const img = ctx.img('prod'); if (img) { const w = C.w, h = w * img.height / img.width, cy = C.cy;
      const gl = X.createRadialGradient(540, cy, 20, 540, cy, w * 0.75); gl.addColorStop(0, 'rgba(199,125,219,0.5)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(0, cy - w, 1080, 2 * w);
      X.save(); X.translate(540, cy + h * 0.47); X.scale(1, 0.12); const cs = X.createRadialGradient(0, 0, 10, 0, 0, w * 0.5); cs.addColorStop(0, 'rgba(0,0,0,0.85)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, w * 0.5, 0, 7); X.fill(); X.restore();
      X.save(); X.translate(540, cy); X.rotate(C.rot); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 50; X.shadowOffsetY = 30; X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); }
    ctx.text(X, C.l1, 540, 548, { family: 'display', weight: 900, size: 132, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, C.l2, 540, 690, { family: 'display', weight: 900, size: 108, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    X.font = ctx.font(C.tagFont, C.tagFont === 'num' ? 800 : 900, C.tagSize); const lw = X.measureText(C.tag).width + 60; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - lw / 2, 1290, lw, 56, 28); X.fill();
    ctx.text(X, C.tag, 540, 1320, { family: C.tagFont, weight: C.tagFont === 'num' ? 800 : 900, size: C.tagSize, color: '#FFFFFF', dir: C.tagFont === 'num' ? 'ltr' : undefined });
    const by = 1418, bw = 600; NK.glass(X, 540 - bw / 2, by - 58, bw, 116, 58, { tint: 'rgba(10,10,12,0.55)' });
    const LB = ctx.text.layout(X, C.badge, { family: 'display', weight: 900, size: 52, maxWidth: 560 }); ctx.text.drawLayout(X, LB, 540, by + 18, { align: 'center', color: '#FFFFFF', perWord: i => ({ color: C.hi.includes(i) ? NK.LILAC : undefined }) });
    const logo = ctx.img('logo'); if (logo) { const w = 330, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
