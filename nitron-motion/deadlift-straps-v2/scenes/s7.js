/* s7 — the fix: straps on the heavy sets (the real figure-8 photo on white glass), grip trained on lighter sets without them,
   and the honest line: straps don't take load off the back — technique does. */
MOTION.scene({ id: 's7',
  draw(t, lt, ctx) { const { X, at } = ctx; const o = t - lt, W7 = i => NK.W(ctx, 'l7', i) - o;   // word starts in scene time
    NK.bg2(ctx, t, { glowY: 640, glowA: 0.36 });
    NK.head(ctx, lt, 'الحل؟', W7(0) - 0.1, { y: 300, size: 120, hi: [0], kicker: 'من نايترون' });
    // product card
    const img = ctx.img('fig8'), kp = at(lt, W7(2) - 0.1, W7(2) + 0.35, 'expoOut');
    if (kp > 0 && img) { X.save(); X.globalAlpha = Math.min(1, kp * 1.5); const s = 0.92 + 0.08 * kp; X.translate(540, 620 + (1 - kp) * 60 + Math.sin(lt * 2.2) * 4); X.scale(s, s);
      NK.glass(X, -230, -250, 460, 470, 54, { a0: 0.32, a1: 0.18 });
      const iw = 360, ih = iw * img.height / img.width; X.save(); X.shadowColor = 'rgba(0,0,0,0.4)'; X.shadowBlur = 30; X.shadowOffsetY = 14;
      X.drawImage(img, -iw / 2, -230, iw, ih); X.restore();
      X.font = ctx.font('num', 800, 30); const lw = X.measureText('FIGURE 8 STRAP').width + 56; X.fillStyle = NK.PURPLE; NK.rr(X, -lw / 2, 150, lw, 54, 27); X.fill();
      ctx.text(X, 'FIGURE 8 STRAP', 0, 179, { family: 'num', weight: 800, size: 30, color: '#FFFFFF', dir: 'ltr' }); X.restore(); }
    NK.words(ctx, lt, 'بالسيتات التقيلة: ستراب', 540, 980, { size: 68, t0: W7(5) - 0.05, gap: 0.06 });
  } });
