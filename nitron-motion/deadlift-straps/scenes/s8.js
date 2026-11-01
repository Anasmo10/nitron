/* s8 — end card: Nitron logo, purple rule, one line, CTA, and a small "general information" note. */
MOTION.scene({ id: 's8',
  draw(t, lt, ctx) { const { X, at } = ctx;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const g = X.createRadialGradient(540, 760, 30, 540, 760, 760); g.addColorStop(0, 'rgba(118,2,138,0.32)'); g.addColorStop(1, 'rgba(118,2,138,0)'); X.fillStyle = g; X.fillRect(0, 0, ctx.W, ctx.H);
    const img = ctx.img('logo'), k1 = at(lt, 0.15, 0.65, 'expoOut');
    if (img && k1 > 0) { X.save(); X.globalAlpha = k1; const w = 780, h = w * img.height / img.width, s = 0.95 + 0.05 * k1; X.translate(540, 760); X.scale(s, s); X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); }
    const k2 = at(lt, 0.45, 0.85, 'expoOut'); if (k2 > 0) { X.fillStyle = NK.PURPLE; NK.rr(X, 540 - 260 * k2, 935, 520 * k2, 10, 5); X.fill(); }
    NK.words(ctx, lt, 'قبضة أقوى… ورفعة أأمن', 540, 1040, { size: 60, t0: 0.65, gap: 0.06 });
    NK.chip(ctx, 540, 1170, 'اطلبه من نايترون', at(lt, 0.95, 1.3, 'expoOut'), { size: 48 });
    const kd = at(lt, 1.3, 1.6); if (kd > 0) { X.save(); X.globalAlpha = kd * 0.8;
      ctx.text(X, 'معلومات عامة، مو بديل عن استشارة الطبيب', 540, 1400, { family: 'display', weight: 600, size: 28, color: NK.MUT }); X.restore(); }
  } });
