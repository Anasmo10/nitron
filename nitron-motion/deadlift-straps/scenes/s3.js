/* s3 — inside the forearm: the hanging arm, finger-flexor muscles heating up, tendons under tension through the wrist,
   the bar creeping toward the fingertips. Claim: grip fatigue greater and grip security lower without straps
   (Jukic et al., Physiology & Behavior 2021, n = 16). The diagram is schematic. */
MOTION.scene({ id: 's3',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx;
    NK.bg(ctx, 760, 0.28);
    NK.words(ctx, lt, 'جوّا ساعدك', 540, 260, { size: 100, t0: 0.05 });
    NK.words(ctx, lt, 'كل الوزن معلّق على أصابعك', 540, 352, { size: 46, t0: 0.3, color: NK.MUT, gap: 0.05 });
    const k = at(lt, 0.35, 1.0, 'expoOut'), heat = at(lt, 0.9, 4.2, 'sineInOut'), slip = at(lt, 2.4, 4.8, 'cubicInOut');
    X.save(); X.globalAlpha = k; X.translate(0, (1 - k) * 30);
    const cx = 520, yE = 440, yW = 900, sx = v => cx + v * 1.7;          // x offsets widened 1.7× for a fuller forearm
    // skin silhouette (elbow → wrist → hand)
    X.beginPath(); X.moveTo(sx(-92), yE); X.bezierCurveTo(sx(-105), yE + 170, sx(-70), yW - 110, sx(-52), yW); X.lineTo(sx(-58), yW + 60);
    X.quadraticCurveTo(sx(-40), yW + 110, sx(30), yW + 104); X.lineTo(sx(60), yW + 56); X.lineTo(sx(50), yW);
    X.bezierCurveTo(sx(70), yW - 150, sx(98), yE + 150, sx(86), yE); X.closePath();
    const sk = X.createLinearGradient(sx(-100), 0, sx(100), 0); sk.addColorStop(0, 'rgba(255,255,255,0.10)'); sk.addColorStop(1, 'rgba(255,255,255,0.03)');
    X.fillStyle = sk; X.fill(); X.strokeStyle = 'rgba(255,255,255,0.32)'; X.lineWidth = 3; X.stroke();
    // radius + ulna
    X.fillStyle = 'rgba(230,226,236,0.20)'; NK.rr(X, sx(-26), yE + 20, 34, yW - yE - 30, 16); X.fill(); NK.rr(X, sx(16), yE + 10, 30, yW - yE - 20, 14); X.fill();
    // finger-flexor muscle group (palm side), fibres heat up
    const mc = `rgba(${Math.round(lerp(118, 230, heat))},${Math.round(lerp(2, 150, heat))},${Math.round(lerp(138, 240, heat))},0.95)`;
    X.beginPath(); X.moveTo(sx(-70), yE + 40); X.bezierCurveTo(sx(-118), yE + 160, sx(-98), yE + 300, sx(-52), yE + 380); X.lineTo(sx(-30), yE + 380);
    X.bezierCurveTo(sx(-40), yE + 270, sx(-30), yE + 140, sx(-22), yE + 40); X.closePath();
    const g = X.createLinearGradient(0, yE, 0, yE + 380); g.addColorStop(0, '#4B0158'); g.addColorStop(0.5, mc); g.addColorStop(1, '#4B0158'); X.fillStyle = g; X.fill();
    X.strokeStyle = `rgba(255,255,255,${0.20 + 0.3 * heat})`; X.lineWidth = 1.8;
    for (let i = 0; i < 8; i++) { const f = i / 7; X.beginPath(); X.moveTo(lerp(sx(-66), sx(-26), f), yE + 50); X.bezierCurveTo(lerp(sx(-106), sx(-34), f), yE + 170, lerp(sx(-92), sx(-34), f), yE + 290, lerp(sx(-50), sx(-32), f), yE + 372); X.stroke(); }
    // tendons: muscle → wrist → fingers, tension flowing
    const barY = yW + 175 + 16 * slip, barX = cx + 30;
    X.setLineDash([16, 12]); X.lineDashOffset = -lt * 90; X.lineWidth = 4; X.strokeStyle = `rgba(255,255,255,${0.55 + 0.4 * heat})`;
    for (let i = 0; i < 4; i++) { const o = i * 12; X.beginPath(); X.moveTo(sx(-46) + o * 0.6, yE + 378); X.bezierCurveTo(sx(-44) + o * 0.6, yW - 40, sx(-44) + o, yW + 30, sx(-34) + o, yW + 80);
      X.quadraticCurveTo(barX - 70 + o * 0.5, barY - 40, barX - 48 + o * 0.5, barY); X.stroke(); }
    X.setLineDash([]);
    // palm + four fingers curled round the bar (the wrap opens as the grip fails)
    X.fillStyle = 'rgba(255,255,255,0.10)'; X.strokeStyle = 'rgba(255,255,255,0.5)'; X.lineWidth = 3;
    NK.rr(X, sx(-58), yW + 40, sx(60) - sx(-58), 100, 36); X.fill(); X.stroke();
    const wrap = lerp(2.5, 1.45, slip); X.lineCap = 'round';
    for (let i = 0; i < 4; i++) { X.strokeStyle = `rgba(255,255,255,${0.85 - i * 0.12})`; X.lineWidth = 22 - i * 2;
      X.beginPath(); X.arc(barX, barY, 52 + i * 3, Math.PI * 1.1, Math.PI * 1.1 - wrap + i * 0.05, true); X.stroke(); }
    // bar cross-section (steel)
    const bgr = X.createRadialGradient(barX - 10, barY - 10, 4, barX, barY, 34); bgr.addColorStop(0, '#F2F3F5'); bgr.addColorStop(1, '#8E939B');
    X.fillStyle = bgr; X.beginPath(); X.arc(barX, barY, 32, 0, 7); X.fill();
    if (slip > 0.3) { X.strokeStyle = `rgba(199,125,219,${slip})`; X.lineWidth = 5; for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(barX + 70, barY - 24 + i * 20); X.lineTo(barX + 104, barY - 16 + i * 20); X.stroke(); } }
    X.restore();
    // load arrow
    const ka = at(lt, 1.0, 1.4, 'expoOut'); if (ka > 0) { X.save(); X.globalAlpha = ka; X.translate(0, (1 - k) * 30); NK.arrow(X, 300, barY - 40, 300, barY - 40 + 130 * ka, 12, NK.LILAC, 34);
      ctx.text(X, 'الوزن كلّه', 300, barY - 70, { family: 'display', weight: 900, size: 40, color: NK.LILAC }); X.restore(); }
    NK.label(ctx, lt, 'عضلات ثني الأصابع', 520 - 90 * 1.7, 440 + 200, 175, 440 + 90, 1.3, { size: 34 });
    NK.label(ctx, lt, 'الأوتار', 520 - 36 * 1.7, 900 + 20, 840, 900 - 60, 1.7, { size: 38 });
    // claim + source
    NK.words(ctx, lt, 'بلا ستراب: القبضة بتتعب أكتر', 540, 1330, { size: 58, t0: 2.6, gap: 0.06 });
    NK.words(ctx, lt, 'وإحساسك إن البار رح يفلت أعلى', 540, 1408, { size: 46, t0: 3.3, color: NK.LILAC, gap: 0.05 });
    NK.source(ctx, lt, 'Jukic et al., Physiology & Behavior 2021 · n = 16', 2.8, 1478);
  } });
