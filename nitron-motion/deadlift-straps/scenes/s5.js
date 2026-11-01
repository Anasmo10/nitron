/* s5 — the back: L3–S1 side view, compression building on L4/L5, counter to 17,192 N (Cholewicki, McGill & Norman,
   Med Sci Sports Exerc 1991 — average estimate in national-level powerlifters, linked-segment model). 17,192 N ≈ 1.75 t-force.
   Then physics, not a study: moment = weight × horizontal distance — keep the bar close. */
MOTION.scene({ id: 's5',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx;
    NK.bg(ctx, 760, 0.28);
    NK.words(ctx, lt, 'وضهرك؟', 540, 255, { size: 104, t0: 0.05 });
    NK.words(ctx, lt, 'بأتقل رفعات الأبطال', 540, 345, { size: 46, t0: 0.3, color: NK.MUT, gap: 0.05 });
    const ks = at(lt, 0.3, 0.8, 'expoOut'), press = at(lt, 0.7, 2.6, 'cubicInOut');
    if (ks > 0) { X.save(); X.globalAlpha = ks;
      const sx = 300; const names = ['L3', 'L4', 'L5', 'S1'];
      names.forEach((n, i) => { const y = 520 + i * 118 + press * i * 3; const hot = n === 'L4' || n === 'L5';
        // vertebral body + posterior process
        X.fillStyle = 'rgba(230,226,236,0.30)'; NK.rr(X, sx - 85, y, 170, 82, 22); X.fill();
        X.beginPath(); X.moveTo(sx + 85, y + 20); X.lineTo(sx + 170, y + 34); X.lineTo(sx + 168, y + 54); X.lineTo(sx + 85, y + 62); X.closePath(); X.fill();
        ctx.text(X, n, sx, y + 44, { family: 'num', weight: 700, size: 30, color: hot ? '#FFFFFF' : 'rgba(255,255,255,0.6)', dir: 'ltr' });
        if (i < 3) { const dy = y + 86, isHot = i === 1, sq = isHot ? press : press * 0.5;      // discs, L4/L5 is the hot one
          X.fillStyle = isHot ? `rgba(199,125,219,${0.55 + 0.4 * press * (0.7 + 0.3 * Math.sin(lt * 14))})` : 'rgba(118,2,138,0.7)';
          X.beginPath(); X.ellipse(sx, dy + 14, 80 + 12 * sq, 14 - 5 * sq, 0, 0, 7); X.fill(); } });
      // compression arrows
      for (const dx of [-55, 55]) NK.arrow(X, sx + dx, 410, sx + dx, 410 + 90 * press, 10 + 6 * press, NK.LILAC, 30);
      X.restore(); }
    // the number
    const kn = at(lt, 0.8, 1.1, 'expoOut'); if (kn > 0) { X.save(); X.globalAlpha = kn;
      const v = Math.round(17192 * at(lt, 0.9, 2.5, 'expoOut'));
      ctx.text(X, ctx.num(v), 760, 640, { family: 'num', weight: 800, size: 100, color: '#FFFFFF', dir: 'ltr' });
      ctx.text(X, 'نيوتن على L4/L5', 760, 725, { family: 'display', weight: 800, size: 40, color: NK.MUT });
      X.restore(); }
    NK.chip(ctx, 760, 820, '≈ 1.7 طن ضغط', at(lt, 2.5, 2.8, 'expoOut'), { size: 40 });
    const kc = at(lt, 2.7, 3.0); if (kc > 0) { X.save(); X.globalAlpha = kc * 0.85; ctx.text(X, 'تقدير بنموذج حسابي', 760, 905, { family: 'display', weight: 600, size: 30, color: NK.MUT }); X.restore(); }
    // lever: keep the bar close
    const kl = at(lt, 3.3, 3.7, 'expoOut'); if (kl > 0) { X.save(); X.globalAlpha = kl; X.translate(0, (1 - kl) * 30);
      NK.glass(X, 90, 1000, 900, 250, 40);
      const far = at(lt, 4.0, 4.8, 'cubicInOut'), d = lerp(150, 300, far), px = 780, py = 1120;
      X.fillStyle = '#FFFFFF'; X.beginPath(); X.arc(px, py, 14, 0, 7); X.fill();
      ctx.text(X, 'أسفل الضهر', px + 90, py + 6, { family: 'display', weight: 800, size: 28, color: NK.MUT });
      X.strokeStyle = 'rgba(255,255,255,0.7)'; X.lineWidth = 6; X.beginPath(); X.moveTo(px, py); X.lineTo(px - d, py); X.stroke();
      X.fillStyle = '#D5D8DE'; X.beginPath(); X.arc(px - d, py, 26, 0, 7); X.fill(); NK.arrow(X, px - d, py + 30, px - d, py + 100, 8, NK.LILAC, 22);
      ctx.text(X, far > 0.5 ? '2×' : '1×', px - d / 2, py - 30, { family: 'num', weight: 800, size: 34, color: '#FFFFFF', dir: 'ltr' });
      const tq = lerp(0.42, 0.84, far); X.fillStyle = 'rgba(255,255,255,0.12)'; NK.rr(X, 140, 1196, 300, 22, 11); X.fill(); X.fillStyle = NK.LILAC; NK.rr(X, 140, 1196, 300 * tq, 22, 11); X.fill();
      ctx.text(X, 'العزم على ضهرك', 290, 1170, { family: 'display', weight: 800, size: 30, color: '#FFFFFF' });
      X.restore(); }
    NK.words(ctx, lt, 'خلّي البار لازق بجسمك', 540, 1335, { size: 60, t0: 3.6, gap: 0.06 });
    NK.words(ctx, lt, 'كل ما يبعد، العزم على ضهرك بيكبر', 540, 1415, { size: 42, t0: 4.2, color: NK.LILAC, gap: 0.05 });
    NK.source(ctx, lt, 'Cholewicki, McGill & Norman, Med Sci Sports Exerc 1991', 1.0, 1478);
  } });
