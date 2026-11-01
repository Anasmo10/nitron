/* s4 v2 — «وكتير ناس بيقلبوا إيد لفوق»: the left hand flips palm-up on the bar. «وبفيديوهات الإصابات»: 96.4% card.
   «وتر الباي بيتمزّق»: elbow illustration, the distal biceps tendon's fibres fray. «بالإيد اللي كفّها لفوق».
   Kapicioglu et al., OJSM 2021 (deadlift ruptures all in the supinated arm) · Lappen et al., BMC MSK Disord 2022 (96.4% of 56). */
MOTION.scene({ id: 's4',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx; const W_ = i => NK.W(ctx, 'l4', i);
    NK.bg2(ctx, t, { glowY: 760, glowA: 0.28 });
    NK.slam(ctx, t, 'لما القبضة تفلت…', 540, 250, W_(0) - 0.1, { size: 92, from: 1.15 });
    // bar + two hands (top view); the left hand flips on «بيقلبوا»
    const kb = at(lt, 0.1, 0.5, 'expoOut'), flip = at(t, W_(2), W_(2) + 0.45, 'cubicInOut');
    if (kb > 0) { X.save(); X.globalAlpha = kb;
      const bgr = X.createLinearGradient(0, 520, 0, 546); bgr.addColorStop(0, '#F2F3F5'); bgr.addColorStop(1, '#8E939B'); X.fillStyle = bgr; NK.rr(X, 80, 520, 920, 24, 12); X.fill();
      const hand = (x, f) => { X.save(); X.translate(x, 532); const sy = Math.cos(Math.PI * f), up = f > 0.5; X.scale(1, Math.abs(sy) < 0.06 ? 0.06 : Math.abs(sy));
        X.fillStyle = up ? 'rgba(199,125,219,0.96)' : 'rgba(255,255,255,0.92)'; NK.rr(X, -66, -74, 132, 148, 40); X.fill();
        X.strokeStyle = up ? '#4B0158' : 'rgba(10,10,12,0.5)'; X.lineWidth = 5; for (let i = 0; i < 4; i++) { const fx = -45 + i * 30; X.beginPath(); X.moveTo(fx, up ? 70 : -70); X.lineTo(fx, up ? 8 : -8); X.stroke(); }
        X.restore(); };
      hand(760, 0); hand(320, flip);
      ctx.text(X, 'كف لتحت', 760, 640, { family: 'display', weight: 800, size: 34, color: '#FFFFFF' });
      ctx.text(X, flip > 0.5 ? 'كف لفوق' : 'كف لتحت', 320, 640, { family: 'display', weight: 800, size: 34, color: flip > 0.5 ? NK.LILAC : '#FFFFFF' });
      X.restore(); }
    // elbow + biceps tendon (enters on «وتر الباي», fibres fray on «بيتمزّق»)
    const ke = at(t, W_(7) - 0.35, W_(7) + 0.1, 'expoOut'), tear = at(t, W_(9), W_(9) + 0.5, 'expoOut');
    if (ke > 0) { X.save(); X.globalAlpha = ke; const ox = 290, oy = 730, s = 0.9 + 0.1 * ke; X.translate(ox, oy); X.scale(1.7 * s, 0.98 * s);
      X.fillStyle = 'rgba(230,226,236,0.26)'; NK.rr(X, -24, 0, 48, 330, 22); X.fill(); X.beginPath(); X.arc(0, 336, 30, 0, 7); X.fill();
      NK.rr(X, -20, 356, 26, 260, 12); X.fill(); NK.rr(X, 12, 362, 22, 250, 10); X.fill();
      // biceps belly with fibres
      X.beginPath(); X.moveTo(-26, 40); X.bezierCurveTo(-170, 110, -160, 250, -40, 300); X.lineTo(-24, 292); X.bezierCurveTo(-60, 210, -56, 110, -26, 40); X.closePath();
      const bg = X.createLinearGradient(0, 40, 0, 300); bg.addColorStop(0, '#4B0158'); bg.addColorStop(0.55, NK.PURPLE); bg.addColorStop(1, '#4B0158'); X.fillStyle = bg; X.fill();
      X.strokeStyle = 'rgba(255,255,255,0.25)'; X.lineWidth = 1.6; for (let i = 0; i < 7; i++) { const f = i / 6; X.beginPath(); X.moveTo(lerp(-30, -40, f), 50); X.bezierCurveTo(lerp(-150, -60, f), 120, lerp(-140, -58, f), 230, lerp(-44, -30, f), 294); X.stroke(); }
      // distal tendon: 10 fibres from the belly to the radius; on the tear, every other fibre snaps and recoils
      for (let i = 0; i < 10; i++) { const f = i / 9, x0 = lerp(-44, -24, f), y0 = 292, x1 = lerp(-12, 2, f), y1 = 380, broken = i % 2 === 0 && tear > 0;
        X.strokeStyle = broken ? NK.LILAC : `rgba(255,255,255,${0.75})`; X.lineWidth = 3.2;
        if (!broken) { X.beginPath(); X.moveTo(x0, y0); X.quadraticCurveTo(x0 - 6, (y0 + y1) / 2, x1, y1); X.stroke(); }
        else { const mid = 0.5, gap = 22 * tear; X.beginPath(); X.moveTo(x0, y0); X.quadraticCurveTo(x0 - 8 - 14 * tear, y0 + 30 - gap, lerp(x0, x1, mid) - 10 * tear, lerp(y0, y1, mid) - gap); X.stroke();
          X.beginPath(); X.moveTo(x1, y1); X.quadraticCurveTo(x1 + 10 * tear, y1 - 20 + gap, lerp(x0, x1, mid) + 8 * tear, lerp(y0, y1, mid) + gap); X.stroke(); } }
      if (tear > 0) { const fl = 1 - at(t, W_(9), W_(9) + 0.4); X.fillStyle = `rgba(199,125,219,${0.5 * fl})`; X.beginPath(); X.arc(-16, 336, 70 + 60 * tear, 0, 7); X.fill(); }
      // forces
      NK.arrow(X, 0, 630, 0, 630 + 90 * ke, 10, NK.LILAC, 28);
      X.restore();
      NK.label(ctx, t, 'وتر الباي', 290 - 34, 730 + 330, 130, 730 + 440, W_(7), { size: 36 });
      const kt = at(t, W_(9), W_(9) + 0.25, 'expoOut'); if (kt > 0) NK.chip(ctx, 420, 1000, 'تمزّق', kt, { size: 30 }); }
    // the evidence card
    const kp = at(t, W_(5) - 0.1, W_(5) + 0.3, 'expoOut'); if (kp > 0) { X.save(); X.globalAlpha = kp; X.translate((1 - kp) * 40, 0);
      NK.glass(X, 500, 720, 490, 520, 44);
      ctx.text(X, ctx.num(96.4 * at(t, W_(5), W_(6) + 0.8, 'expoOut'), 1) + '%', 745, 850, { family: 'num', weight: 800, size: 110, color: NK.LILAC, dir: 'ltr' });
      const L = ctx.text.layout(X, 'من 56 تمزّق موثّق بالفيديو: الساعد لفوق والكوع ممدود', { family: 'display', weight: 800, size: 37, maxWidth: 420, lineHeight: 1.3 });
      ctx.text.drawLayout(X, L, 745, 940, { align: 'center', color: '#FFFFFF' });
      X.fillStyle = 'rgba(255,255,255,0.18)'; X.fillRect(560, 1100, 370, 2);
      const L2 = ctx.text.layout(X, 'وبالديدلفت: كل التمزقات بالإيد اللي كفّها لفوق', { family: 'display', weight: 800, size: 32, maxWidth: 420, lineHeight: 1.3 });
      ctx.text.drawLayout(X, L2, 745, 1150, { align: 'center', color: NK.MUT });
      X.restore(); }
    NK.slam(ctx, t, 'بالإيد اللي كفّها لفوق', 540, 1415, W_(10), { size: 54, color: NK.LILAC, from: 1.12 });
    NK.source(ctx, t, 'Kapicioglu et al., OJSM 2021 · Lappen et al., BMC Musculoskelet Disord 2022', W_(5), 1484);
  } });
