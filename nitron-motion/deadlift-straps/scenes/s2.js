/* s2 — the weakest link: legs · back · grip meters fill as the bar gets heavier; the grip runs out first.
   Then the study: 1RM 160.6 kg without straps vs 177.0 kg with (Jukic et al., JSCR 2020, n = 20). Meter capacities are illustrative. */
MOTION.scene({ id: 's2',
  draw(t, lt, ctx) { const { X, at } = ctx;
    NK.bg(ctx, 700, 0.30);
    NK.words(ctx, lt, 'الحلقة الأضعف', 540, 270, { size: 100, t0: 0.05 });
    NK.words(ctx, lt, 'مين بيستسلم أول تحت الوزن؟', 540, 365, { size: 46, t0: 0.3, color: NK.MUT, gap: 0.05 });
    const load = 60 + 100.6 * at(lt, 0.7, 3.0, 'cubicInOut');
    const kc = at(lt, 0.5, 0.8, 'expoOut');
    if (kc > 0) { X.save(); X.globalAlpha = kc; NK.glass(X, 300, 418, 480, 74, 37);
      ctx.text(X, 'الوزن على البار', 640, 457, { family: 'display', weight: 800, size: 34, color: NK.MUT });
      ctx.text(X, ctx.num(load, load >= 160.55 ? 1 : 0) + ' kg', 420, 459, { family: 'num', weight: 800, size: 40, color: '#FFFFFF', dir: 'ltr' }); X.restore(); }
    const rows = [['الرجلين', 260], ['الضهر', 230], ['القبضة', 160.6]], fail = at(lt, 3.0, 3.1);
    rows.forEach(([name, cap], i) => { const y = 560 + i * 130, k = at(lt, 0.55 + i * 0.07, 0.85 + i * 0.07, 'expoOut'); if (k <= 0) return;
      const isGrip = i === 2, shake = isGrip && fail > 0 && lt < 3.9 ? Math.sin(lt * 70) * 6 * (1 - at(lt, 3.1, 3.9)) : 0;
      X.save(); X.globalAlpha = k; X.translate((1 - k) * 40 + shake, 0); NK.glass(X, 90, y - 50, 900, 100, 30);
      ctx.text(X, name, 945, y + 2, { family: 'display', weight: 900, size: 44, color: '#FFFFFF', align: 'right' });
      const x1 = 760, x0 = 130, f = Math.min(1, load / cap), wv = (x1 - x0) * f;
      X.fillStyle = 'rgba(255,255,255,0.12)'; NK.rr(X, x0, y - 13, x1 - x0, 26, 13); X.fill();
      X.fillStyle = isGrip && f >= 0.999 ? (Math.floor(lt * 10) % 2 ? '#FFFFFF' : NK.LILAC) : NK.PURPLE; if (wv > 2) { NK.rr(X, x1 - wv, y - 13, wv, 26, 13); X.fill(); }
      ctx.text(X, Math.round(f * 100) + '%', x0 + 4, y - 30, { family: 'num', weight: 700, size: 24, color: 'rgba(255,255,255,0.6)', align: 'left', dir: 'ltr' });
      X.restore(); });
    NK.chip(ctx, 300, 900, 'القبضة فلتت أول', at(lt, 3.05, 3.35, 'expoOut'), { size: 34 });
    // the study
    const kp = at(lt, 3.5, 3.85, 'expoOut'); if (kp > 0) { X.save(); X.globalAlpha = kp; X.translate(0, (1 - kp) * 40);
      NK.glass(X, 90, 975, 900, 410, 44);
      ctx.text(X, 'دراسة على 20 رياضي مدرّب: أقصى رفعة', 540, 1035, { family: 'display', weight: 800, size: 36, color: NK.MUT });
      ctx.text(X, 'بلا ستراب', 770, 1105, { family: 'display', weight: 900, size: 42, color: '#FFFFFF' });
      ctx.text(X, 'مع ستراب', 310, 1105, { family: 'display', weight: 900, size: 42, color: NK.LILAC });
      ctx.text(X, '160.6', 770, 1225, { family: 'num', weight: 800, size: 104, color: '#FFFFFF', dir: 'ltr' });
      const v = 160.6 + 16.4 * at(lt, 3.9, 4.9, 'expoOut');
      ctx.text(X, ctx.num(v, 1), 310, 1225, { family: 'num', weight: 800, size: 104, color: NK.LILAC, dir: 'ltr' });
      ctx.text(X, 'kg', 770, 1290, { family: 'num', weight: 600, size: 34, color: NK.MUT, dir: 'ltr' }); ctx.text(X, 'kg', 310, 1290, { family: 'num', weight: 600, size: 34, color: NK.MUT, dir: 'ltr' });
      NK.arrow(X, 640, 1190, 470, 1190, 8, 'rgba(255,255,255,0.7)', 26);
      X.restore(); }
    NK.chip(ctx, 540, 1345, '+10%', at(lt, 4.8, 5.1, 'expoOut'), { size: 40 });
    NK.source(ctx, lt, 'Jukic et al., J Strength Cond Res 2020 · n = 20 trained men', 3.6);
  } });
