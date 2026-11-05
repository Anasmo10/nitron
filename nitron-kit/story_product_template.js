window.P = {};
/* «لازم يكون معك» highlight — one story per product. Same studio as the product covers: black, Nitron purple spotlight,
   the real product big in the middle with a lilac glow and a floor shadow. Small lilac kicker (the highlight's name),
   the product name, one line, the order button, the logo. Inside Instagram's safe zones (y 250–1700). */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, P = window.P;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 980, 40, 540, 1060, 940); sp.addColorStop(0, 'rgba(118,2,138,0.6)'); sp.addColorStop(0.5, 'rgba(75,1,88,0.2)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    const fl = X.createLinearGradient(0, 1300, 0, 1920); fl.addColorStop(0, 'rgba(40,30,50,0)'); fl.addColorStop(0.18, 'rgba(40,30,50,0.5)'); fl.addColorStop(1, 'rgba(10,10,12,1)'); X.fillStyle = fl; X.fillRect(0, 1300, 1080, 620);
    ctx.text(X, 'لازم يكون معك', 540, 330, { family: 'display', weight: 900, size: 46, color: NK.LILAC });
    X.fillStyle = NK.PURPLE; NK.rr(X, 470, 368, 140, 8, 4); X.fill();
    if (P.latin) ctx.text(X, P.name, 540, 492, { family: 'num', weight: 800, size: 118, color: '#FFFFFF', dir: 'ltr', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    else ctx.text(X, P.name, 540, 496, { family: 'display', weight: 900, size: 140, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, P.line, 540, 630, { family: 'display', weight: 900, size: 66, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 24, y: 8 } });
    const gl = X.createRadialGradient(540, 1060, 20, 540, 1060, 470); gl.addColorStop(0, 'rgba(199,125,219,0.36)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(0, 560, 1080, 1000);
    X.save(); X.translate(540, P.floor || 1400); X.scale(1, 0.10); const cs = X.createRadialGradient(0, 0, 10, 0, 0, 400); cs.addColorStop(0, 'rgba(0,0,0,0.85)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, 400, 0, 7); X.fill(); X.restore();
    /* the thread: one light-purple line runs through every story of the highlight, behind each product; it leaves each story
       on the left edge at the same height it enters the next one from the right (RTL order), so the stories read as one piece */
    const YE = 1150, path = () => { X.beginPath(); const x0 = P.first ? 960 : 1080, x1 = P.last ? 120 : 0; X.moveTo(x0, YE);
      X.bezierCurveTo(840, YE, 760, 930, 540, 930); X.bezierCurveTo(320, 930, 240, YE, x1, YE); };
    X.save(); X.lineCap = 'round'; X.strokeStyle = 'rgba(199,125,219,0.22)'; X.lineWidth = 16; path(); X.stroke();
    X.strokeStyle = NK.LILAC; X.lineWidth = 5; path(); X.stroke(); X.fillStyle = NK.LILAC;
    if (P.first) { X.beginPath(); X.arc(960, YE, 12, 0, 7); X.fill(); } if (P.last) { X.beginPath(); X.arc(120, YE, 12, 0, 7); X.fill(); } X.restore();
    (P.imgs || []).forEach(([k, w, cx, cy, rot]) => { const im = ctx.img(k); if (!im) return; const h = w * im.height / im.width;
      X.save(); X.translate(cx, cy); X.rotate(rot); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 50; X.shadowOffsetY = 28; X.drawImage(im, -w / 2, -h / 2, w, h); X.restore(); });
    const label = 'اطلبه من نايترون'; X.font = ctx.font('display', 900, 50); const bw = X.measureText(label).width + 120;
    X.save(); X.shadowColor = 'rgba(0,0,0,0.4)'; X.shadowBlur = 30; X.shadowOffsetY = 12; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - bw / 2, 1500, bw, 112, 56); X.fill(); X.restore();
    ctx.text(X, label, 540, 1558, { family: 'display', weight: 900, size: 50, color: '#FFFFFF' });
    const logo = ctx.img('logo'); if (logo) { const w = 250, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1690 - h / 2, w, h); }
  } });
