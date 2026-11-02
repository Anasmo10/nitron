/* cover — product on a glossy podium (no bar): headline, the real straps standing on a black podium with a purple rim light, 3 numbered steps. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 900, 40, 540, 960, 820); sp.addColorStop(0, 'rgba(118,2,138,0.55)'); sp.addColorStop(0.55, 'rgba(75,1,88,0.2)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    // light beam from above onto the podium
    const bm = X.createLinearGradient(0, 700, 0, 1230); bm.addColorStop(0, 'rgba(199,125,219,0)'); bm.addColorStop(1, 'rgba(199,125,219,0.10)');
    X.fillStyle = bm; X.beginPath(); X.moveTo(400, 700); X.lineTo(680, 700); X.lineTo(900, 1230); X.lineTo(180, 1230); X.closePath(); X.fill();
    // podium: cylinder side + top ellipse + purple rim
    const cx = 540, ty = 1215, rx = 330, ry = 52, hgt = 80;
    const side = X.createLinearGradient(cx - rx, 0, cx + rx, 0); side.addColorStop(0, '#060608'); side.addColorStop(0.45, '#1d1b22'); side.addColorStop(0.55, '#24212a'); side.addColorStop(1, '#060608');
    X.fillStyle = side; X.beginPath(); X.ellipse(cx, ty + hgt, rx, ry, 0, 0, Math.PI); X.lineTo(cx - rx, ty); X.ellipse(cx, ty, rx, ry, 0, Math.PI, 0, true); X.closePath(); X.fill();
    const top = X.createRadialGradient(cx, ty - 10, 10, cx, ty, rx); top.addColorStop(0, '#2a2630'); top.addColorStop(1, '#0d0c10'); X.fillStyle = top; X.beginPath(); X.ellipse(cx, ty, rx, ry, 0, 0, 7); X.fill();
    X.save(); X.shadowColor = NK.LILAC; X.shadowBlur = 26; X.strokeStyle = 'rgba(199,125,219,0.95)'; X.lineWidth = 4; X.beginPath(); X.ellipse(cx, ty, rx, ry, 0, 0, 7); X.stroke(); X.restore();
    X.save(); X.globalAlpha = 0.5; X.strokeStyle = NK.PURPLE; X.lineWidth = 3; X.beginPath(); X.ellipse(cx, ty + hgt, rx, ry, 0, 0, Math.PI); X.stroke(); X.restore();
    ctx.text(X, 'FIGURE 8 STRAP', cx, ty + 66, { family: 'num', weight: 800, size: 30, color: NK.LILAC, dir: 'ltr' });
    // the real straps standing on the podium: contact shadow, product, faint reflection on the glossy top
    const img = ctx.img('red8'); if (img) { const w = 596, h = w * img.height / img.width, ix = cx - w / 2, iy = ty - h + 22;
      const cs = X.createRadialGradient(cx, ty + 4, 10, cx, ty + 4, 300); cs.addColorStop(0, 'rgba(0,0,0,0.75)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.save(); X.scale(1, 0.16); X.fillStyle = cs; X.beginPath(); X.arc(cx, (ty + 4) / 0.16, 300, 0, 7); X.fill(); X.restore();
      X.save(); X.beginPath(); X.ellipse(cx, ty, rx - 6, ry - 4, 0, 0, 7); X.clip(); X.globalAlpha = 0.18; X.translate(0, 2 * ty + 44); X.scale(1, -1); X.drawImage(img, ix, iy, w, h); X.restore();
      X.save(); X.shadowColor = 'rgba(0,0,0,0.55)'; X.shadowBlur = 30; X.shadowOffsetY = 18; X.drawImage(img, ix, iy, w, h); X.restore(); }
    // headline
    ctx.text(X, 'كيف تلبس', 540, 600, { family: 'display', weight: 900, size: 124, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, 'الستراب صح؟', 540, 725, { family: 'display', weight: 900, size: 94, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    // 3 numbered steps (standard figure-8 method)
    const steps = [['١', 'إيدك', 'بالحلقة'], ['٢', 'الحلقة', 'تحت البار'], ['٣', 'امسك', 'وشد']], cw = 310, gap = 20, y0 = 1330;
    steps.forEach(([n, a, b], i) => { const x = 540 + (1 - i) * (cw + gap) - cw / 2; NK.glass(X, x, y0, cw, 130, 32, { tint: 'rgba(10,10,12,0.55)' });
      X.fillStyle = NK.PURPLE; X.beginPath(); X.arc(x + cw - 48, y0 + 65, 30, 0, 7); X.fill();
      ctx.text(X, n, x + cw - 48, y0 + 74, { family: 'display', weight: 900, size: 38, color: '#FFFFFF' });
      ctx.text(X, a, x + cw - 92, y0 + 56, { family: 'display', weight: 900, size: 36, color: '#FFFFFF', align: 'right' });
      ctx.text(X, b, x + cw - 92, y0 + 102, { family: 'display', weight: 800, size: 32, color: NK.LILAC, align: 'right' }); });
    const logo = ctx.img('logo'); if (logo) { const w = 340, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
