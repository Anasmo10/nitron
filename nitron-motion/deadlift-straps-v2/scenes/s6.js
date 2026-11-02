/* s6 — long term, if the weight stays heavier than the grip:
   (1) forceful + repetitive activity is associated with medial epicondylitis (Shiri et al., Am J Epidemiol 2006, population study);
   (2) muscle and tendon don't adapt at the same rate; the imbalance is discussed as a tendinopathy risk factor
       (Mersmann, Bohm & Arampatzis, Front Physiol 2017, review). The chart is a concept sketch, not data. */
MOTION.scene({ id: 's6',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx;
    NK.bg2(ctx, t, { glowY: 760, glowA: 0.28 });
    NK.head(ctx, lt, 'وبعد سنين؟', 0.1, { y: 320, size: 120, hi: [1], kicker: 'إذا ضل الوزن أتقل من قبضتك' });
    // card 2 — muscle vs tendon adaptation (concept sketch)
    const k2 = at(lt, 0.5, 0.9, 'expoOut'); if (k2 > 0) { X.save(); X.globalAlpha = k2; X.translate((1 - k2) * 40, -330);
      NK.glass(X, 90, 790, 900, 560, 40);
      ctx.text(X, 'العضل بيقوى أسرع من الوتر', 540, 860, { family: 'display', weight: 900, size: 50, color: '#FFFFFF' });
      const gx0 = 160, gx1 = 920, gy0 = 1220, gy1 = 930, draw = at(lt, 0.9, 2.7, 'cubicInOut');
      X.strokeStyle = 'rgba(255,255,255,0.3)'; X.lineWidth = 3; X.beginPath(); X.moveTo(gx0, gy1 - 10); X.lineTo(gx0, gy0); X.lineTo(gx1, gy0); X.stroke();
      const mus = f => gy0 - (gy0 - gy1) * (1 - Math.exp(-3.2 * f)) * 0.95, ten = f => gy0 - (gy0 - gy1) * (1 - Math.exp(-1.1 * f)) * 0.95 * 0.9;
      const N = 60, n = Math.max(2, Math.round(N * draw));
      // the gap between the curves
      X.beginPath(); for (let i = 0; i < n; i++) { const f = i / (N - 1); X.lineTo(lerp(gx0, gx1, f), mus(f)); } for (let i = n - 1; i >= 0; i--) { const f = i / (N - 1); X.lineTo(lerp(gx0, gx1, f), ten(f)); }
      X.closePath(); X.fillStyle = 'rgba(199,125,219,0.20)'; X.fill();
      const curve = (fn, col, w) => { X.strokeStyle = col; X.lineWidth = w; X.beginPath(); for (let i = 0; i < n; i++) { const f = i / (N - 1); i ? X.lineTo(lerp(gx0, gx1, f), fn(f)) : X.moveTo(lerp(gx0, gx1, f), fn(f)); } X.stroke(); };
      curve(mus, NK.LILAC, 7); curve(ten, '#FFFFFF', 7);
      if (draw > 0.6) { const a = at(lt, 1.9, 2.3); X.save(); X.globalAlpha *= a;
        ctx.text(X, 'العضل', gx1 - 60, mus(1) - 28, { family: 'display', weight: 900, size: 34, color: NK.LILAC });
        ctx.text(X, 'الوتر', gx1 - 60, ten(1) + 44, { family: 'display', weight: 900, size: 34, color: '#FFFFFF' });
        ctx.text(X, 'الفجوة ممكن تزيد خطر التهاب الوتر', 470, mus(0.35) + 40, { family: 'display', weight: 800, size: 32, color: '#FFFFFF' }); X.restore(); }
      ctx.text(X, 'الوقت ←', gx1 - 40, gy0 + 40, { family: 'display', weight: 700, size: 26, color: NK.MUT });
      ctx.text(X, 'Mersmann et al., Front Physiol 2017 (review)', 400, 1318, { family: 'num', weight: 500, size: 23, color: 'rgba(255,255,255,0.5)', dir: 'ltr' });
      ctx.text(X, 'مخطط توضيحي', 860, 1318, { family: 'display', weight: 700, size: 24, color: 'rgba(255,255,255,0.5)' });
      X.restore(); }
    NK.note(ctx, lt, 'وكمان: البار ممكن يفلت ويوقع', 3.2, { y: 1110, size: 46, hi: [3, 4] });
  } });
