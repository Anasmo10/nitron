/* s7 — the fix: straps on the heavy sets (the real figure-8 photo on white glass), grip trained on lighter sets without them,
   and the honest line: straps don't take load off the back — technique does. */
MOTION.scene({ id: 's7',
  draw(t, lt, ctx) { const { X, at } = ctx;
    NK.bg(ctx, 640, 0.36);
    const kt = at(lt, 0.0, 0.25, 'expoOut'); if (kt > 0) { X.save(); const sc = 1.3 - 0.3 * kt; X.translate(540, 250); X.scale(sc, sc); X.globalAlpha = Math.min(1, kt * 2);
      ctx.text(X, 'الحل؟', 0, 0, { family: 'display', weight: 900, size: 116, color: NK.LILAC }); X.restore(); }
    // product card
    const img = ctx.img('fig8'), kp = at(lt, 0.25, 0.7, 'expoOut');
    if (kp > 0 && img) { X.save(); X.globalAlpha = Math.min(1, kp * 1.5); const s = 0.92 + 0.08 * kp; X.translate(540, 620 + (1 - kp) * 60 + Math.sin(lt * 2.2) * 4); X.scale(s, s);
      NK.glass(X, -230, -250, 460, 470, 54, { a0: 0.32, a1: 0.18 });
      const iw = 360, ih = iw * img.height / img.width; X.save(); X.shadowColor = 'rgba(0,0,0,0.4)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      X.drawImage(img, -iw / 2, -230, iw, ih); X.restore();
      X.font = ctx.font('num', 800, 30); const lw = X.measureText('FIGURE 8 STRAP').width + 56; X.fillStyle = NK.PURPLE; NK.rr(X, -lw / 2, 150, lw, 54, 27); X.fill();
      ctx.text(X, 'FIGURE 8 STRAP', 0, 179, { family: 'num', weight: 800, size: 30, color: '#FFFFFF', dir: 'ltr' }); X.restore(); }
    NK.words(ctx, lt, 'بالسيتات التقيلة: ستراب', 540, 980, { size: 68, t0: 0.65, gap: 0.06 });
    const row = (y, s, t0) => { const k = at(lt, t0, t0 + 0.3, 'expoOut'); if (k <= 0) return; X.save(); X.globalAlpha = Math.min(1, k * 1.6); X.translate((1 - k) * -30, 0);
      NK.glass(X, 140, y - 40, 800, 80, 40); X.fillStyle = NK.PURPLE; X.beginPath(); X.arc(900, y, 28, 0, 7); X.fill();
      X.strokeStyle = '#FFFFFF'; X.lineWidth = 5; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath(); X.moveTo(888, y + 1); X.lineTo(897, y + 10); X.lineTo(913, y - 9); X.stroke();
      ctx.text(X, s, 852, y + 2, { family: 'display', weight: 800, size: 38, color: '#FFFFFF', align: 'right' }); X.restore(); };
    row(1080, 'الضهر والرجلين بيشتغلوا لآخرهن', 1.1); row(1180, 'والقبضة ما بتوقّف السيت', 1.4);
    NK.words(ctx, lt, 'وبالسيتات الأخف: قوّي قبضتك بلاه', 540, 1305, { size: 48, t0: 2.0, color: NK.LILAC, gap: 0.05 });
    const kh = at(lt, 2.7, 3.0); if (kh > 0) { X.save(); X.globalAlpha = kh * 0.9;
      ctx.text(X, 'الستراب ما بيخفّف الحمل عن ضهرك، التكنيك هو اللي بيحميه', 540, 1395, { family: 'display', weight: 700, size: 32, color: NK.MUT, maxWidth: 900 }); X.restore(); }
  } });
