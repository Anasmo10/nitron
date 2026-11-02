/* s8 v2.1 — end card: the real Figure 8 Strap photo on white liquid glass, the Nitron logo, one line, CTA chip + nitron.sport, disclaimer. */
MOTION.scene({ id: 's8',
  draw(t, lt, ctx) { const { X, at } = ctx;
    NK.bg2(ctx, t, { glowY: 600, glowA: 0.40 });
    const img = ctx.img('fig8'), kp = at(lt, 0.0, 0.45, 'expoOut');
    if (img && kp > 0) { X.save(); X.globalAlpha = Math.min(1, kp * 1.5); const s = 0.9 + 0.1 * kp; X.translate(540, 560 + (1 - kp) * 60 + Math.sin(lt * 2.2) * 5); X.scale(s, s);
      NK.glass(X, -250, -250, 500, 500, 60, { a0: 0.34, a1: 0.2 });
      const iw = 400, ih = iw * img.height / img.width; X.save(); X.shadowColor = 'rgba(0,0,0,0.45)'; X.shadowBlur = 34; X.shadowOffsetY = 16; X.drawImage(img, -iw / 2, -ih / 2 - 20, iw, ih); X.restore();
      X.font = ctx.font('num', 800, 30); const lw = X.measureText('FIGURE 8 STRAP').width + 56; X.fillStyle = NK.PURPLE; NK.rr(X, -lw / 2, 196, lw, 54, 27); X.fill();
      ctx.text(X, 'FIGURE 8 STRAP', 0, 225, { family: 'num', weight: 800, size: 30, color: '#FFFFFF', dir: 'ltr' }); X.restore(); }
    const logo = ctx.img('logo'), kl = at(lt, 0.35, 0.8, 'expoOut');
    if (logo && kl > 0) { X.save(); X.globalAlpha = kl; const w = 520, h = w * logo.height / logo.width; X.translate(540, 940 + (1 - kl) * 20); X.drawImage(logo, -w / 2, -h / 2, w, h); X.restore(); }
    NK.head(ctx, lt, 'قبضة أقوى… ورفعة أأمن', 0.6, { x: 540, y: 1135, size: 70, align: 'center', hi: [1, 3], gap: 0.1 });
    NK.chip(ctx, 540, 1255, 'اطلبه من نايترون', at(lt, 1.0, 1.35, 'expoOut'), { size: 46 });
    const kw = at(lt, 1.25, 1.55); if (kw > 0) ctx.text(X, 'nitron.sport', 540, 1335, { family: 'num', weight: 700, size: 34, color: NK.LILAC, dir: 'ltr', alpha: kw });
    const kd = at(lt, 1.4, 1.7); if (kd > 0) ctx.text(X, 'معلومات عامة، مو بديل عن استشارة الطبيب', 540, 1440, { family: 'display', weight: 600, size: 26, color: NK.MUT, alpha: kd * 0.8 });
  } });
