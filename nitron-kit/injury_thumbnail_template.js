window.EP = { n: '01', ar: 'شدّ أسفل الظهر', en: 'LUMBAR STRAIN', dx: -15, dy: 340, sc: 1.12, ring: [657, 1012, 135, 100, -0.2] };
/* NITRON — INJURY BREAKDOWN · series thumbnail (one template for all 10 episodes).
   The real injury frame, graded, sliding out of black; the injured spot circled in lilac (the series' highlight);
   series line + episode pill on top, Arabic injury name big, English name under it. Everything inside the 1:1 grid square. */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, E = window.EP;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const im = ctx.img('shot'); if (im) { const w = 1080 * (E.sc || 1); X.drawImage(im, E.dx || 0, E.dy, w, w * im.height / im.width); }
    const top = X.createLinearGradient(0, E.dy - 10, 0, E.dy + 420); top.addColorStop(0, 'rgba(10,10,12,1)'); top.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = top; X.fillRect(0, 0, 1080, E.dy + 420);
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, 1080, E.dy);
    const bot = X.createLinearGradient(0, 1080, 0, 1920); bot.addColorStop(0, 'rgba(10,10,12,0)'); bot.addColorStop(0.45, 'rgba(10,10,12,0.88)'); bot.addColorStop(1, 'rgba(10,10,12,1)'); X.fillStyle = bot; X.fillRect(0, 1080, 1080, 840);
    const vg = X.createRadialGradient(540, 960, 300, 540, 960, 1050); vg.addColorStop(0, 'rgba(10,10,12,0)'); vg.addColorStop(1, 'rgba(10,10,12,0.75)'); X.fillStyle = vg; X.fillRect(0, 0, 1080, 1920);
    const pg = X.createRadialGradient(540, 420, 20, 540, 420, 620); pg.addColorStop(0, 'rgba(118,2,138,0.55)'); pg.addColorStop(1, 'rgba(118,2,138,0)'); X.fillStyle = pg; X.fillRect(0, 0, 1080, 1100);
    const [rx, ry, ra, rb, rot] = E.ring;   /* the injured spot: soft lilac glow + one clean ring */
    const gl = X.createRadialGradient(rx, ry, 10, rx, ry, ra * 1.6); gl.addColorStop(0, 'rgba(199,125,219,0.45)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(rx - 260, ry - 260, 520, 520);
    X.save(); X.translate(rx, ry); X.rotate(rot); X.strokeStyle = NK.LILAC; X.lineWidth = 9; X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 16; X.beginPath(); X.ellipse(0, 0, ra, rb, 0, 0, 7); X.stroke(); X.restore();
    X.font = '800 34px Inter'; try { X.letterSpacing = '8px'; } catch (e) {}
    ctx.text(X, 'INJURY BREAKDOWN', 540, 470, { family: 'num', weight: 800, size: 34, color: NK.LILAC, dir: 'ltr' }); try { X.letterSpacing = '0px'; } catch (e) {}
    const pw = 150; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - pw / 2, 515, pw, 58, 29); X.fill();
    ctx.text(X, 'EP ' + E.n, 540, 545, { family: 'num', weight: 800, size: 30, color: '#FFFFFF', dir: 'ltr' });
    ctx.text(X, E.ar, 540, 1300, { family: 'display', weight: 900, size: 136, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.6)', blur: 30, y: 10 } });
    ctx.text(X, E.en, 540, 1428, { family: 'num', weight: 800, size: 58, color: NK.LILAC, dir: 'ltr' });
    const logo = ctx.img('logo'); if (logo) { const w = 300, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1640 - h / 2, w, h); }
  } });
