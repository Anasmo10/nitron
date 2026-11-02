/* s3 v2 — X-ray scan of the forearm on «الوزن معلّق على ساعدك وأوتار أصابعك»: a scan line sweeps down and reveals the
   finger flexors and tendons under the skin; heat builds on «بلا ستراب القبضة رح تتعب أكتر»; on «البار رح يوقع» the bar
   slips out of the fingers and falls. Grip fatigue / grip security: Jukic et al., Physiology & Behavior 2021, n = 16. Schematic. */
MOTION.scene({ id: 's3',
  draw(t, lt, ctx) { const { X, at, lerp } = ctx; const W_ = i => NK.W(ctx, 'l3', i);
    NK.bg2(ctx, t, { glowY: 760, glowA: 0.30 });
    NK.head(ctx, t, 'جوّا ساعدك', W_(0), { y: 300, size: 104, hi: [1], kicker: 'الوزن كلّه معلّق هون', times: [W_(0), W_(3)] });
    const k = at(lt, 0.1, 0.6, 'expoOut'), heat = at(t, W_(6), W_(11) + 0.3, 'sineInOut'), slip = at(t, W_(12), W_(16), 'cubicIn');
    const scan = at(t, W_(0), W_(3) + 0.35, 'cubicInOut'), dropT = t - W_(16), drop = dropT > 0 ? dropT : 0;
    const cx = 540, yE = 420, yW = 900, sx = v => cx + v * 1.8, push = 1 + 0.035 * at(lt, 0, 6, 'sineInOut');
    X.save(); X.globalAlpha = k; X.translate(540, 820); X.scale(push, push); X.translate(-540, -820);
    // skin silhouette (always), drawn like a glass body
    const skin = () => { X.beginPath(); X.moveTo(sx(-92), yE); X.bezierCurveTo(sx(-105), yE + 170, sx(-70), yW - 110, sx(-52), yW); X.lineTo(sx(-58), yW + 60);
      X.quadraticCurveTo(sx(-40), yW + 110, sx(30), yW + 104); X.lineTo(sx(60), yW + 56); X.lineTo(sx(50), yW);
      X.bezierCurveTo(sx(70), yW - 150, sx(98), yE + 150, sx(86), yE); X.closePath(); };
    skin(); const sk = X.createLinearGradient(sx(-100), 0, sx(100), 0); sk.addColorStop(0, 'rgba(255,255,255,0.12)'); sk.addColorStop(1, 'rgba(255,255,255,0.04)');
    X.fillStyle = sk; X.fill(); X.strokeStyle = 'rgba(255,255,255,0.40)'; X.lineWidth = 3; X.stroke();
    // anatomy, revealed above the scan line
    const yScan = lerp(yE - 20, yW + 260, scan);
    X.save(); skin(); X.rect(sx(-130), yW + 40, sx(130) - sx(-130), 260); X.clip(); X.beginPath(); X.rect(0, 0, ctx.W, yScan); X.clip();
    X.fillStyle = 'rgba(230,226,236,0.24)'; NK.rr(X, sx(-26), yE + 20, 36, yW - yE - 30, 16); X.fill(); NK.rr(X, sx(16), yE + 10, 32, yW - yE - 20, 14); X.fill();
    const mc = `rgba(${Math.round(lerp(118, 235, heat))},${Math.round(lerp(2, 155, heat))},${Math.round(lerp(138, 245, heat))},0.95)`;
    X.beginPath(); X.moveTo(sx(-70), yE + 40); X.bezierCurveTo(sx(-118), yE + 160, sx(-98), yE + 300, sx(-52), yE + 380); X.lineTo(sx(-30), yE + 380);
    X.bezierCurveTo(sx(-40), yE + 270, sx(-30), yE + 140, sx(-22), yE + 40); X.closePath();
    const g = X.createLinearGradient(0, yE, 0, yE + 380); g.addColorStop(0, '#4B0158'); g.addColorStop(0.5, mc); g.addColorStop(1, '#4B0158'); X.fillStyle = g; X.fill();
    X.strokeStyle = `rgba(255,255,255,${0.22 + 0.35 * heat})`; X.lineWidth = 1.8;
    for (let i = 0; i < 9; i++) { const f = i / 8; X.beginPath(); X.moveTo(lerp(sx(-66), sx(-26), f), yE + 50); X.bezierCurveTo(lerp(sx(-106), sx(-34), f), yE + 170, lerp(sx(-92), sx(-34), f), yE + 290, lerp(sx(-50), sx(-32), f), yE + 372); X.stroke(); }
    // second flexor layer on the other side
    X.globalAlpha *= 0.6; X.beginPath(); X.moveTo(sx(40), yE + 40); X.bezierCurveTo(sx(86), yE + 150, sx(76), yE + 280, sx(40), yE + 360); X.lineTo(sx(26), yE + 360);
    X.bezierCurveTo(sx(36), yE + 250, sx(30), yE + 130, sx(26), yE + 40); X.closePath(); X.fillStyle = g; X.fill(); X.globalAlpha /= 0.6;
    X.restore();
    // tendons (flow of tension) + hand + bar
    const barY0 = yW + 175 + 16 * slip, barY = barY0 + 1400 * drop * drop, barX = cx + 30;
    X.save(); X.beginPath(); X.rect(0, 0, ctx.W, yScan); X.clip();
    X.setLineDash([16, 12]); X.lineDashOffset = -t * 90; X.lineWidth = 4; X.strokeStyle = `rgba(255,255,255,${0.55 + 0.4 * heat})`;
    for (let i = 0; i < 4; i++) { const o = i * 12; X.beginPath(); X.moveTo(sx(-46) + o * 0.6, yE + 378); X.bezierCurveTo(sx(-44) + o * 0.6, yW - 40, sx(-44) + o, yW + 30, sx(-34) + o, yW + 80);
      X.quadraticCurveTo(barX - 70 + o * 0.5, barY0 - 40, barX - 48 + o * 0.5, barY0); X.stroke(); }
    X.setLineDash([]); X.restore();
    X.fillStyle = 'rgba(255,255,255,0.10)'; X.strokeStyle = 'rgba(255,255,255,0.5)'; X.lineWidth = 3; NK.rr(X, sx(-58), yW + 40, sx(60) - sx(-58), 100, 36); X.fill(); X.stroke();
    const wrap = drop > 0 ? 0.9 : lerp(2.5, 1.35, slip); X.lineCap = 'round';
    for (let i = 0; i < 4; i++) { X.strokeStyle = `rgba(255,255,255,${0.88 - i * 0.12})`; X.lineWidth = 22 - i * 2; X.beginPath(); X.arc(barX, barY0, 52 + i * 3, Math.PI * 1.1, Math.PI * 1.1 - wrap + i * 0.05, true); X.stroke(); }
    const bgr = X.createRadialGradient(barX - 10, barY - 10, 4, barX, barY, 34); bgr.addColorStop(0, '#F2F3F5'); bgr.addColorStop(1, '#8E939B');
    if (drop > 0) { X.strokeStyle = 'rgba(199,125,219,0.6)'; X.lineWidth = 6; for (let i = -1; i <= 1; i++) { X.beginPath(); X.moveTo(barX + i * 18, barY - 40); X.lineTo(barX + i * 18, barY - 40 - Math.min(220, 900 * drop)); X.stroke(); } }
    X.fillStyle = bgr; X.beginPath(); X.arc(barX, barY, 32, 0, 7); X.fill();
    // scan line
    if (scan > 0 && scan < 1) { const sg = X.createLinearGradient(0, yScan - 40, 0, yScan + 4); sg.addColorStop(0, 'rgba(199,125,219,0)'); sg.addColorStop(1, 'rgba(199,125,219,0.55)');
      X.fillStyle = sg; X.fillRect(sx(-150), yScan - 40, sx(150) - sx(-150), 44); X.fillStyle = NK.LILAC; X.fillRect(sx(-150), yScan, sx(150) - sx(-150), 4); }
    X.restore();
    NK.label(ctx, t, 'عضلات ثني الأصابع', 540 - 90 * 1.8, 420 + 200, 165, 420 + 90, W_(3), { size: 34 });
    NK.label(ctx, t, 'الأوتار', 540 - 36 * 1.8, 900 + 20, 860, 900 - 60, W_(4), { size: 38 });
    NK.note(ctx, t, 'بلا ستراب: القبضة بتتعب أكتر', W_(6), { y: 1360, size: 52, hi: [3, 4], out: W_(14) - 0.15 });
    NK.note(ctx, t, 'والبار رح يوقع', W_(14), { y: 1360, size: 60, hi: [2] });
    NK.source(ctx, t, 'Jukic et al., Physiology & Behavior 2021 · n = 16', W_(6), 1484);
  } });
