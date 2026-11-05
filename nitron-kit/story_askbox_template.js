window.ASK = { mock: false };
/* Nitron story — question box: «شو بتحب نوفّرلك؟». Same studio look as the product covers (dark, Nitron purple spotlight,
   real product cutouts on a floor). The middle band (y 760–1200) is kept clear for Instagram's question sticker;
   ASK.mock = true draws a stand-in sticker there so the client can see the placement. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, A = window.ASK;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 980, 40, 540, 1000, 900); sp.addColorStop(0, 'rgba(118,2,138,0.55)'); sp.addColorStop(0.55, 'rgba(75,1,88,0.18)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    const fl = X.createLinearGradient(0, 1380, 0, 1920); fl.addColorStop(0, 'rgba(40,30,50,0)'); fl.addColorStop(0.2, 'rgba(40,30,50,0.5)'); fl.addColorStop(1, 'rgba(10,10,12,1)'); X.fillStyle = fl; X.fillRect(0, 1380, 1080, 540);
    const logo = ctx.img('logo'); if (logo) { const w = 300, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 300 - h / 2, w, h); }
    ctx.text(X, 'شو بتحب', 540, 478, { family: 'display', weight: 900, size: 140, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, 'نوفّرلك؟', 540, 690, { family: 'display', weight: 900, size: 170, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    X.font = ctx.font('display', 900, 170); const bw = X.measureText('نوفّرلك؟').width * 0.6; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - bw / 2, 782, bw, 14, 7); X.fill();
    if (A.mock) {   /* stand-in for Instagram's question sticker: shows where it goes (not part of the posted story) */
      X.save(); X.shadowColor = 'rgba(0,0,0,0.45)'; X.shadowBlur = 40; X.shadowOffsetY = 14; X.fillStyle = '#FFFFFF'; NK.rr(X, 150, 880, 780, 300, 36); X.fill(); X.restore();
      X.fillStyle = NK.PURPLE; NK.rr(X, 150, 880, 780, 150, 36); X.fill(); X.fillRect(150, 980, 780, 50);
      ctx.text(X, 'اكتبلنا شو ناقصك', 540, 962, { family: 'display', weight: 900, size: 52, color: '#FFFFFF' });
      X.fillStyle = 'rgba(10,10,12,0.08)'; NK.rr(X, 190, 1060, 700, 86, 22); X.fill();
      ctx.text(X, 'اكتب هون…', 540, 1110, { family: 'display', weight: 800, size: 40, color: 'rgba(10,10,12,0.45)' }); }
    ctx.text(X, 'منتج، مقاس، لون… أي شي ناقصك بالتمرين', 540, 1290, { family: 'display', weight: 800, size: 40, color: 'rgba(255,255,255,0.82)' });
    /* product group (client: the five-across row looked cheap): three Nitron products as one hero shot —
       the two figure-8 straps behind, the wrist wrap in front, one floor shadow and a soft lilac glow */
    const gl = X.createRadialGradient(540, 1520, 20, 540, 1520, 420); gl.addColorStop(0, 'rgba(199,125,219,0.30)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(0, 1100, 1080, 820);
    X.save(); X.translate(540, 1690); X.scale(1, 0.10); const cs = X.createRadialGradient(0, 0, 10, 0, 0, 420); cs.addColorStop(0, 'rgba(0,0,0,0.85)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, 420, 0, 7); X.fill(); X.restore();
    const put = (k, w, cx, cy, rot) => { const im = ctx.img(k); if (!im) return; const h = w * im.height / im.width;
      X.save(); X.translate(cx, cy); X.rotate(rot); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 40; X.shadowOffsetY = 22; X.drawImage(im, -w / 2, -h / 2, w, h); X.restore(); };
    put('fig8', 330, 300, 1500, -0.22); put('red8', 360, 790, 1515, 0.18); put('prod', 330, 545, 1545, 0);
  } });
