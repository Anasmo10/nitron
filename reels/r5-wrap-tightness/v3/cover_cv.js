window.COVER = { l1: 'قدّيش لازم', l2: 'تشدّ المشد؟', w: 520, cy: 1140, rot: -0.06 };
/* cover — reel #5 v3 (client 5 Nov: plain question, no bracelet ring): one question, one object. Dark studio + Nitron purple spotlight (the approved product-hero look),
   the real BIMute wrap as the focal point, and a light-purple ring orbiting it like a bracelet — the same ring that
   circles the loose wrap in the reel's first frame. Hierarchy: «مشدّك» (white) → «ولا إسوارة؟» (lilac, biggest, purple bar). */
MOTION.scene({ id: 'cv',
  draw(t, lt, ctx) { const { X } = ctx, C = window.COVER;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 820, 40, 540, 1000, 900); sp.addColorStop(0, 'rgba(118,2,138,0.6)'); sp.addColorStop(0.5, 'rgba(75,1,88,0.22)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    const fl = X.createLinearGradient(0, 1240, 0, 1920); fl.addColorStop(0, 'rgba(40,30,50,0)'); fl.addColorStop(0.15, 'rgba(40,30,50,0.5)'); fl.addColorStop(1, 'rgba(10,10,12,1)'); X.fillStyle = fl; X.fillRect(0, 1240, 1080, 680);
    const ring = (a0, a1) => { X.save(); X.translate(540, C.cy + 40); X.rotate(-0.10); X.strokeStyle = NK.LILAC; X.lineWidth = 11; X.lineCap = 'round';
      X.shadowColor = 'rgba(0,0,0,0.5)'; X.shadowBlur = 16; X.shadowOffsetY = 6; X.beginPath(); X.ellipse(0, 0, 345, 112, 0, a0, a1); X.stroke(); X.restore(); };
    const img = ctx.img('prod'); if (img) { const w = C.w, h = w * img.height / img.width, cy = C.cy;
      const gl = X.createRadialGradient(540, cy, 20, 540, cy, w * 0.75); gl.addColorStop(0, 'rgba(199,125,219,0.42)'); gl.addColorStop(1, 'rgba(199,125,219,0)'); X.fillStyle = gl; X.fillRect(0, cy - w, 1080, 2 * w);
      X.save(); X.translate(540, cy + h * 0.47); X.scale(1, 0.12); const cs = X.createRadialGradient(0, 0, 10, 0, 0, w * 0.5); cs.addColorStop(0, 'rgba(0,0,0,0.85)'); cs.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = cs; X.beginPath(); X.arc(0, 0, w * 0.5, 0, 7); X.fill(); X.restore();
      X.save(); X.translate(540, cy); X.rotate(C.rot); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 50; X.shadowOffsetY = 30; X.drawImage(img, -w / 2, -h / 2, w, h); X.restore(); }
    ctx.text(X, C.l1, 540, 562, { family: 'display', weight: 900, size: 128, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, C.l2, 540, 736, { family: 'display', weight: 900, size: 160, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    X.font = ctx.font('display', 900, 160); const bw = X.measureText(C.l2).width * 0.62; X.fillStyle = NK.PURPLE; NK.rr(X, 540 - bw / 2, 812, bw, 14, 7); X.fill();
    const logo = ctx.img('logo'); if (logo) { const w = 330, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1600 - h / 2, w, h); }
  } });
