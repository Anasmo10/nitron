window.O = {};
/* «عروض نيترون» highlight — one story per offer, each offer's own products, cut out of the client's flat-lay photo,
   as one studio shot with purple «+» badges between them. Same studio, kicker, thread line and button as «لازم يكون معك». */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, O = window.O;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 1000, 40, 540, 1060, 940); sp.addColorStop(0, 'rgba(118,2,138,0.6)'); sp.addColorStop(0.5, 'rgba(75,1,88,0.2)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    ctx.text(X, 'عروض نايترون', 540, 300, { family: 'display', weight: 900, size: 46, color: NK.LILAC });
    X.fillStyle = NK.PURPLE; NK.rr(X, 470, 338, 140, 8, 4); X.fill();
    ctx.text(X, O.title, 540, 450, { family: 'display', weight: 900, size: 132, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    /* item lines: Arabic name on the right, «+», the English name on the left (Inter), centred as one line */
    (O.lines || []).forEach(([ar, plus, la], i) => { const y = 580 + i * 70, fsA = 50, fsL = 44;
      X.font = ctx.font('display', 900, fsA); const wa = X.measureText(ar).width; const lat = la && /[a-z]/i.test(la); X.font = lat ? ctx.font('num', 800, fsL) : ctx.font('display', 900, fsA); const wl = la ? X.measureText(la).width : 0;
      X.font = ctx.font('display', 900, fsA); const wp = X.measureText(' + ').width; const tot = wa + wp + (la ? wl : 0);
      const xr = 540 + tot / 2;
      ctx.text(X, ar, xr - wa / 2, y, { family: 'display', weight: 900, size: fsA, color: '#FFFFFF' });
      ctx.text(X, '+', xr - wa - wp / 2, y, { family: 'display', weight: 900, size: fsA, color: NK.LILAC });
      if (la) ctx.text(X, la, xr - wa - wp - wl / 2, y + 2, { family: la.match(/[a-z]/i) ? 'num' : 'display', weight: la.match(/[a-z]/i) ? 800 : 900, size: la.match(/[a-z]/i) ? fsL : fsA, color: '#FFFFFF', dir: la.match(/[a-z]/i) ? 'ltr' : undefined }); });
    const YE = 1110, path = () => { X.beginPath(); const x0 = O.first ? 960 : 1080, x1 = O.last ? 120 : 0; X.moveTo(x0, YE);
      X.bezierCurveTo(900, YE, 860, 1000, 760, 1000); X.lineTo(320, 1000); X.bezierCurveTo(220, 1000, 180, YE, x1, YE); };
    X.save(); X.lineCap = 'round'; X.strokeStyle = 'rgba(199,125,219,0.22)'; X.lineWidth = 16; path(); X.stroke(); X.strokeStyle = NK.LILAC; X.lineWidth = 5; path(); X.stroke();
    X.fillStyle = NK.LILAC; if (O.first) { X.beginPath(); X.arc(960, YE, 12, 0, 7); X.fill(); } if (O.last) { X.beginPath(); X.arc(120, YE, 12, 0, 7); X.fill(); } X.restore();
    const gl = X.createRadialGradient(540, 1080, 20, 540, 1080, 480); gl.addColorStop(0, 'rgba(199,125,219,0.34)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(0, 580, 1080, 1000);
    X.save(); X.translate(540, O.floor || 1420); X.scale(1, 0.10); const cs = X.createRadialGradient(0, 0, 10, 0, 0, 420); cs.addColorStop(0, 'rgba(0,0,0,0.85)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, 420, 0, 7); X.fill(); X.restore();
    (O.imgs || []).forEach(([k, w, cx, cy, rot]) => { const im = ctx.img(k); if (!im) return; const h = w * im.height / im.width;
      X.save(); X.translate(cx, cy); X.rotate(rot); X.shadowColor = 'rgba(0,0,0,0.65)'; X.shadowBlur = 46; X.shadowOffsetY = 26; X.drawImage(im, -w / 2, -h / 2, w, h); X.restore(); });
    (O.plus || []).forEach(([px, py]) => { X.save(); X.shadowColor = 'rgba(0,0,0,0.5)'; X.shadowBlur = 20; X.fillStyle = NK.PURPLE; X.beginPath(); X.arc(px, py, 44, 0, 7); X.fill(); X.restore();
      X.strokeStyle = '#FFFFFF'; X.lineWidth = 9; X.lineCap = 'round'; X.beginPath(); X.moveTo(px - 18, py); X.lineTo(px + 18, py); X.moveTo(px, py - 18); X.lineTo(px, py + 18); X.stroke(); });
    const label = 'اسألنا عن العرض'; X.font = ctx.font('display', 900, 50); const bw = X.measureText(label).width + 120, by = 1530;
    X.save(); X.shadowColor = 'rgba(0,0,0,0.4)'; X.shadowBlur = 30; X.shadowOffsetY = 12; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - bw / 2, by, bw, 108, 54); X.fill(); X.restore();
    ctx.text(X, label, 540, by + 56, { family: 'display', weight: 900, size: 50, color: '#FFFFFF' });
    const logo = ctx.img('logo'); if (logo) { const w = 230, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1700 - h / 2, w, h); }
  } });
