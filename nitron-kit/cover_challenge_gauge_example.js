/* cover — collab "grip challenge": strength gauge 5–100 kg behind two crossed grippers, headline, NITRON × MED KNIGHT badge. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 1080, 60, 540, 1080, 780); sp.addColorStop(0, 'rgba(118,2,138,0.55)'); sp.addColorStop(0.6, 'rgba(75,1,88,0.16)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    // gauge 5 → 100 kg over the top half
    const cx = 540, cy = 1185, R = 350, a0 = Math.PI * 1.08, a1 = Math.PI * 1.92, A = kg => a0 + (a1 - a0) * (kg - 5) / 95;
    X.lineCap = 'round'; X.strokeStyle = 'rgba(255,255,255,0.10)'; X.lineWidth = 30; X.beginPath(); X.arc(cx, cy, R, a0, a1); X.stroke();
    const gg = X.createLinearGradient(cx - R, 0, cx + R, 0); gg.addColorStop(0, '#4B0158'); gg.addColorStop(0.6, NK.PURPLE); gg.addColorStop(1, NK.LILAC);
    X.save(); X.shadowColor = NK.LILAC; X.shadowBlur = 30; X.strokeStyle = gg; X.lineWidth = 30; X.beginPath(); X.arc(cx, cy, R, a0, A(92)); X.stroke(); X.restore();
    for (let kg = 5; kg <= 100; kg += 5) { const a = A(kg), big = kg % 25 === 0 || kg === 5; X.strokeStyle = big ? '#FFFFFF' : 'rgba(255,255,255,0.45)'; X.lineWidth = big ? 5 : 3;
      X.beginPath(); X.moveTo(cx + Math.cos(a) * (R - 34), cy + Math.sin(a) * (R - 34)); X.lineTo(cx + Math.cos(a) * (R - (big ? 66 : 52)), cy + Math.sin(a) * (R - (big ? 66 : 52))); X.stroke();
      if (big) ctx.text(X, String(kg), cx + Math.cos(a) * (R + 50), cy + Math.sin(a) * (R + 50) + 12, { family: 'num', weight: 800, size: 34, color: kg === 100 ? NK.LILAC : '#FFFFFF', dir: 'ltr' }); }
    ctx.text(X, 'KG', cx + Math.cos(A(100)) * (R + 50) + 6, cy + Math.sin(A(100)) * (R + 50) + 50, { family: 'num', weight: 800, size: 30, color: NK.MUT, dir: 'ltr' });
    // the two real grippers, crossed like a face-off
    const g1 = ctx.img('g100'), g2 = ctx.img('g60'); const put = (img, x, y, w, rot, flip) => { if (!img) return; const h = w * img.height / img.width; X.save(); X.translate(x, y); X.rotate(rot); X.scale(flip ? -1 : 1, 1);
      X.shadowColor = 'rgba(0,0,0,0.7)'; X.shadowBlur = 44; X.shadowOffsetY = 26; X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); };
    put(g2, 670, 1215, 430, -0.32, true); put(g1, 420, 1235, 550, 0.28, false);
    // headline
    ctx.text(X, 'تحدي القبضة', 540, 585, { family: 'display', weight: 900, size: 116, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, 'مين قبضته أقوى؟', 540, 695, { family: 'display', weight: 900, size: 78, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    // collab badge
    const by = 1420; X.font = ctx.font('num', 900, 40); const w1 = X.measureText('NITRON').width, w2 = X.measureText('MED KNIGHT').width, wx = X.measureText(' × ').width, bw = w1 + w2 + wx + 80;
    NK.glass(X, 540 - bw / 2, by - 44, bw, 88, 44, { tint: 'rgba(10,10,12,0.65)' }); let x = 540 - bw / 2 + 40;
    ctx.text(X, 'NITRON', x + w1 / 2, by + 14, { family: 'num', weight: 900, size: 40, color: '#FFFFFF', dir: 'ltr' }); x += w1;
    ctx.text(X, '×', x + wx / 2, by + 14, { family: 'num', weight: 900, size: 40, color: NK.LILAC, dir: 'ltr' }); x += wx;
    ctx.text(X, 'MED KNIGHT', x + w2 / 2, by + 14, { family: 'num', weight: 900, size: 40, color: '#F5A21B', dir: 'ltr' });
    const logo = ctx.img('logo'); if (logo) { const w = 320, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
