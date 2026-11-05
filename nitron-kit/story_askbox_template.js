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
    const shelf = [['fig8', 190, 118, 1500, 0.08], ['g60', 210, 320, 1530, -0.05], ['prod', 230, 540, 1480, 0], ['g100', 230, 762, 1535, 0.05], ['red8', 200, 962, 1505, -0.08]];
    shelf.forEach(([k, w, cx, cy, rot]) => { const im = ctx.img(k); if (!im) return; const h = w * im.height / im.width;
      X.save(); X.translate(cx, cy + h * 0.46); X.scale(1, 0.14); const cs = X.createRadialGradient(0, 0, 4, 0, 0, w * 0.5); cs.addColorStop(0, 'rgba(0,0,0,0.8)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, w * 0.5, 0, 7); X.fill(); X.restore();
      X.save(); X.translate(cx, cy); X.rotate(rot); X.shadowColor = 'rgba(0,0,0,0.55)'; X.shadowBlur = 30; X.shadowOffsetY = 16; X.drawImage(im, -w / 2, -h / 2, w, h); X.restore(); });
  } });
