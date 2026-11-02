/* cover — "one strap, many exercises": the real strap in a glow ring, 4 glass exercise icons around it (drawn pictograms). */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 1040, 60, 540, 1040, 760); sp.addColorStop(0, 'rgba(118,2,138,0.6)'); sp.addColorStop(0.6, 'rgba(75,1,88,0.18)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    X.strokeStyle = 'rgba(255,255,255,0.045)'; X.lineWidth = 1; for (let x = 0; x <= 1080; x += 60) { X.beginPath(); X.moveTo(x, 0); X.lineTo(x, 1920); X.stroke(); } for (let y = 0; y <= 1920; y += 60) { X.beginPath(); X.moveTo(0, y); X.lineTo(1080, y); X.stroke(); }
    // glow ring behind the product
    X.save(); X.shadowColor = NK.LILAC; X.shadowBlur = 40; X.strokeStyle = 'rgba(199,125,219,0.85)'; X.lineWidth = 5; X.beginPath(); X.arc(540, 1040, 270, 0, 7); X.stroke(); X.restore();
    X.strokeStyle = 'rgba(199,125,219,0.25)'; X.lineWidth = 2; X.beginPath(); X.arc(540, 1040, 300, 0, 7); X.stroke();
    const img = ctx.img('red8'); if (img) { const w = 560, h = w * img.height / img.width; X.save(); X.translate(540, 1040); X.rotate(-0.1); X.shadowColor = 'rgba(0,0,0,0.7)'; X.shadowBlur = 44; X.shadowOffsetY = 26; X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); }
    // exercise pictograms
    const pl = (...p) => { X.beginPath(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); X.stroke(); };
    const head = (x, y) => { X.fillStyle = '#FFFFFF'; X.beginPath(); X.arc(x, y, 9, 0, 7); X.fill(); };
    const lil = f => { X.save(); X.strokeStyle = NK.LILAC; X.fillStyle = NK.LILAC; f(); X.restore(); };
    const fig = { dl: () => { head(-22, -32); pl(-14, -22, 16, -2); pl(16, -2, 6, 22, 12, 42); pl(-14, -22, -8, 16); lil(() => { X.beginPath(); X.arc(-8, 24, 15, 0, 7); X.stroke(); pl(-30, 24, 14, 24); }); },
      pd: () => { head(0, -18); pl(0, -8, 0, 22); pl(0, -6, -20, -20, -28, -40); pl(0, -6, 20, -20, 28, -40); pl(0, 22, 22, 22, 22, 44); lil(() => pl(-46, -42, 46, -42)); },
      row: () => { head(-26, -24); pl(-18, -16, 18, -2); pl(18, -2, 12, 22, 20, 42); pl(-16, -14, -2, 4, -8, 14); lil(() => { X.beginPath(); X.arc(-6, 18, 12, 0, 7); X.stroke(); }); },
      sh: () => { head(0, -34); pl(0, -24, 0, 14); pl(0, 14, -12, 44); pl(0, 14, 12, 44); pl(-12, -20, -18, 14); pl(12, -20, 18, 14); lil(() => { NK.rr(X, -26, 14, 16, 12, 3); X.fill(); NK.rr(X, 10, 14, 16, 12, 3); X.fill(); pl(-30, -36, -24, -46, -18, -36); pl(18, -36, 24, -46, 30, -36); }); } };
    [['dl', 'ديدلفت', 160, 880], ['pd', 'سحب علوي', 920, 880], ['row', 'تجديف', 160, 1180], ['sh', 'ترابيس', 920, 1180]].forEach(([k, label, x, y]) => {
      NK.glass(X, x - 78, y - 78, 156, 156, 78, { tint: 'rgba(10,10,12,0.6)' });
      X.save(); X.translate(x, y + 2); X.strokeStyle = '#FFFFFF'; X.lineWidth = 6; X.lineCap = 'round'; X.lineJoin = 'round'; fig[k](); X.restore();
      ctx.text(X, label, x, y + 122, { family: 'display', weight: 900, size: 36, color: '#FFFFFF' }); });
    // headline + tag + logo
    ctx.text(X, 'ستراب واحد', 540, 575, { family: 'display', weight: 900, size: 132, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, 'تمارين كتير', 540, 705, { family: 'display', weight: 900, size: 112, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    X.font = ctx.font('num', 800, 28); const tw = X.measureText('FIGURE 8 STRAP').width + 52; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - tw / 2, 1352, tw, 50, 25); X.fill();
    ctx.text(X, 'FIGURE 8 STRAP', 540, 1378, { family: 'num', weight: 800, size: 28, color: '#FFFFFF', dir: 'ltr' });
    const logo = ctx.img('logo'); if (logo) { const w = 320, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
