/* s4 — when the grip gives, people flip one hand (mixed grip). The palm-up arm: extended elbow, biceps tendon under load.
   Evidence: in deadlift videos all distal biceps ruptures were in the supinated arm (Kapicioglu et al., OJSM 2021);
   96.4% of 56 filmed ruptures happened with the forearm supinated and the elbow extended (Lappen et al., BMC MSK Disord 2022). */
MOTION.scene({ id: 's4',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx;
    NK.bg(ctx, 760, 0.28);
    NK.words(ctx, lt, 'لما القبضة تفلت…', 540, 255, { size: 96, t0: 0.05 });
    NK.words(ctx, lt, 'كتير ناس بيقلبوا إيد لفوق — Mixed grip', 540, 345, { size: 42, t0: 0.3, color: NK.MUT, gap: 0.05 });
    // top view of the bar with the two hands
    const kb = at(lt, 0.35, 0.8, 'expoOut'); if (kb > 0) { X.save(); X.globalAlpha = kb;
      X.fillStyle = '#D5D8DE'; NK.rr(X, 90, 528, 900, 18, 9); X.fill();
      const hand = (x, up) => { X.save(); X.translate(x, 537);
        X.fillStyle = up ? 'rgba(199,125,219,0.95)' : 'rgba(255,255,255,0.88)';
        NK.rr(X, -62, up ? -6 : -70, 124, 76, 26); X.fill();                                   // back of hand above the bar / palm below it
        X.strokeStyle = up ? '#4B0158' : 'rgba(10,10,12,0.55)'; X.lineWidth = 4;
        for (let i = 0; i < 4; i++) { const fx = -42 + i * 28; X.beginPath(); X.moveTo(fx, up ? 64 : -66); X.lineTo(fx, up ? 6 : -8); X.stroke(); }
        X.restore();
        ctx.text(X, up ? 'كف لفوق' : 'كف لتحت', x, up ? 650 : 452, { family: 'display', weight: 800, size: 32, color: up ? NK.LILAC : '#FFFFFF' }); };
      hand(760, false); hand(320, true); X.restore(); }
    // the palm-up arm, side view: humerus, extended elbow, forearm, biceps + distal tendon
    const ka = at(lt, 1.3, 1.8, 'expoOut'), pull = at(lt, 2.0, 3.6, 'sineInOut'), danger = at(lt, 3.4, 3.7);
    if (ka > 0) { X.save(); X.globalAlpha = ka; X.translate((1 - ka) * -40, 0);
      const ax = 290, yS = 720, yEl = 985, yWr = 1250;
      X.fillStyle = 'rgba(230,226,236,0.25)'; NK.rr(X, ax - 20, yS, 40, yEl - yS - 6, 18); X.fill();          // humerus
      X.beginPath(); X.arc(ax, yEl, 24, 0, 7); X.fill();                                                        // elbow
      NK.rr(X, ax - 14, yEl + 18, 22, yWr - yEl - 18, 10); X.fill(); NK.rr(X, ax + 12, yEl + 24, 16, yWr - yEl - 24, 8); X.fill();   // radius + ulna
      // biceps belly on the front of the humerus
      X.beginPath(); X.moveTo(ax - 18, yS + 30); X.bezierCurveTo(ax - 140, yS + 100, ax - 130, yEl - 100, ax - 30, yEl - 52); X.lineTo(ax - 18, yEl - 60);
      X.bezierCurveTo(ax - 50, yEl - 150, ax - 46, yS + 120, ax - 18, yS + 30); X.closePath();
      const bg = X.createLinearGradient(0, yS, 0, yEl); bg.addColorStop(0, '#4B0158'); bg.addColorStop(0.6, NK.PURPLE); bg.addColorStop(1, '#4B0158'); X.fillStyle = bg; X.fill();
      // distal tendon to the radius (pulsing under load)
      const tw = 7 + 4 * pull * (0.6 + 0.4 * Math.sin(lt * 18));
      X.strokeStyle = danger > 0 ? (Math.floor(lt * 12) % 2 ? '#FFFFFF' : NK.LILAC) : `rgba(255,255,255,${0.6 + 0.35 * pull})`; X.lineWidth = tw; X.lineCap = 'round';
      X.beginPath(); X.moveTo(ax - 28, yEl - 56); X.quadraticCurveTo(ax - 32, yEl - 6, ax - 6, yEl + 48); X.stroke();
      if (danger > 0) { X.strokeStyle = NK.LILAC; X.lineWidth = 4; X.beginPath(); const zx = ax - 60, zy = yEl - 20;
        X.moveTo(zx - 40, zy - 30); X.lineTo(zx - 20, zy - 8); X.lineTo(zx - 34, zy + 4); X.lineTo(zx - 8, zy + 30); X.stroke(); }
      // forces: the bar pulls the hand down, the biceps pulls up
      NK.arrow(X, ax, yWr + 10, ax, yWr + 10 + 110 * pull, 10, NK.LILAC, 30);
      NK.arrow(X, ax - 70, yS + 200, ax - 70, yS + 200 - 90 * pull, 8, 'rgba(255,255,255,0.8)', 24);
      X.restore();
      NK.label(ctx, lt, 'وتر الباي', ax - 26, yEl - 20, 150, yEl + 110, 2.2, { size: 36, align: 'center' }); }
    // evidence panel
    const kp = at(lt, 2.6, 3.0, 'expoOut'); if (kp > 0) { X.save(); X.globalAlpha = kp; X.translate((1 - kp) * 40, 0);
      NK.glass(X, 470, 700, 520, 520, 44);
      const v = 96.4 * at(lt, 2.8, 3.8, 'expoOut');
      ctx.text(X, ctx.num(v, 1) + '%', 730, 830, { family: 'num', weight: 800, size: 112, color: NK.LILAC, dir: 'ltr' });
      const L = ctx.text.layout(X, 'من 56 تمزّق موثّق بالفيديو: الساعد لفوق والكوع ممدود', { family: 'display', weight: 800, size: 38, maxWidth: 440, lineHeight: 1.3 });
      ctx.text.drawLayout(X, L, 730, 920, { align: 'center', color: '#FFFFFF' });
      X.fillStyle = 'rgba(255,255,255,0.18)'; X.fillRect(530, 1085, 400, 2);
      const L2 = ctx.text.layout(X, 'وبالديدلفت: كل التمزقات كانت بالإيد اللي كفّها لفوق', { family: 'display', weight: 800, size: 34, maxWidth: 440, lineHeight: 1.3 });
      ctx.text.drawLayout(X, L2, 730, 1135, { align: 'center', color: NK.MUT, perWord: () => ({ alpha: at(lt, 3.9, 4.2) }) });
      X.restore(); }
    NK.words(ctx, lt, 'الإيد اللي كفّها لفوق هي اللي بتنصاب', 540, 1400, { size: 50, t0: 4.4, gap: 0.06, maxWidth: 1000 });
    NK.source(ctx, lt, 'Kapicioglu et al., OJSM 2021 · Lappen et al., BMC Musculoskelet Disord 2022', 2.9, 1478);
  } });
