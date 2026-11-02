/* s2 v2 — the body as a 3D steel chain carrying the bar: legs · back · grip. On «القبضة بتتعب أول» the grip link strains,
   turns lilac and snaps; the plate drops. Then on «وبدراسة» the study: 160.6 vs 177.0 kg (+10%), Jukic et al., JSCR 2020, n = 20.
   The chain is a metaphor (illustrative); only the study numbers are data. */
MOTION.scene({ id: 's2',
  setup(ctx) { const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 30, camera: [0, 0.2, 15], env: 'room', tone: 'neutral', exposure: 1.05 });
    const steel = () => new THREE.MeshStandardMaterial({ color: 0xd9dce2, metalness: 1, roughness: 0.3, roughnessMap: NK.noiseTex(THREE, [4, 1], 120, 220) });
    const torus = (arc) => new THREE.TorusGeometry(0.72, 0.17, 28, 96, arc);
    this.chain = new THREE.Group(); this.st.add(this.chain); this.links = [];
    [2.15, 0.25, -1.65].forEach((y, i) => { const m = new THREE.Mesh(torus(Math.PI * 2), steel()); m.scale.set(1, 1.55, 1); m.position.y = y; m.rotation.y = i % 2 ? Math.PI / 2 : 0; this.chain.add(m); this.links.push(m); });
    // the grip link also exists as two halves for the snap
    this.halves = [0, 1].map(j => { const h = new THREE.Mesh(torus(Math.PI), this.links[2].material); h.scale.set(1, 1.55, 1); h.rotation.z = j ? Math.PI : 0; h.visible = false; this.chain.add(h); return h; });
    // anchor bar on top, plate hanging below
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 32), steel()); top.rotation.z = Math.PI / 2; top.position.y = 3.35; this.chain.add(top);
    this.plate = new THREE.Group(); this.chain.add(this.plate);
    const bp = NK.bumper(THREE, { w: 0.066, kg: '20 KG' }); bp.scale.setScalar(1.25 / 0.225); bp.rotation.x = Math.PI / 2; this.plate.add(bp);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.07, 14, 40, Math.PI * 1.2), steel()); hook.position.y = 1.45; hook.rotation.z = -0.3; this.plate.add(hook);
    this.plateY0 = -4.05; this.plate.position.y = this.plateY0;
    const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(4, 5, 7); this.st.add(key);
    const rimL = new THREE.DirectionalLight(0xb070ff, 1.0); rimL.position.set(-5, 1, -4); this.st.add(rimL);
    this.v = new THREE.Vector3();
  },
  draw(t, lt, ctx) { const { X, at, lerp } = ctx; const W_ = i => NK.W(ctx, 'l2', i);
    NK.bg2(ctx, t, { glowY: 760, glowA: 0.32 });
    const tStudy = W_(8) - 0.15, chainOut = at(t, tStudy, tStudy + 0.4, 'cubicIn');
    const strain = at(t, W_(5) - 0.1, W_(6) + 0.3), snap = at(t, W_(7), W_(7) + 0.9, 'cubicOut'), snapped = t >= W_(7);
    // tension + vibration before the snap
    const vib = strain * (1 - (snapped ? 1 : 0)) * Math.sin(t * 60) * 0.03;
    this.links.forEach((m, i) => { m.scale.y = 1.55 * (1 + 0.04 * strain * (i === 2 ? 1.6 : 0.6)); m.position.x = vib * (i + 1); });
    const gl = this.links[2], col = gl.material.color; col.setRGB(lerp(0.85, 0.78, strain), lerp(0.86, 0.49, strain), lerp(0.89, 0.86, strain));
    gl.material.emissive = gl.material.emissive || new ctx.THREE.Color(0); gl.material.emissive.setRGB(0.25 * strain, 0.0, 0.32 * strain);
    gl.visible = !snapped; this.halves.forEach((h, j) => { h.visible = snapped; const s = j ? 1 : -1; h.position.set(-0 + s * 1.6 * snap, -1.65 - 0.6 * snap, 0.6 * snap); h.rotation.set(0.4 * snap * s, 0, (j ? Math.PI : 0) + s * 1.4 * snap); });
    const fall = snapped ? Math.min(1, (t - W_(7)) / 0.9) : 0; this.plate.position.y = this.plateY0 - 9 * fall * fall; this.plate.position.x = vib * 4; this.plate.rotation.z = 0.5 * fall;
    this.chain.rotation.y = 0.35 * Math.sin(lt * 0.5) - 0.25; this.chain.position.y = -0.5 + 0.15 * at(lt, 0, 2.5, 'sineOut'); this.chain.scale.setScalar(0.86);
    this.st.camera.position.set(0.6, 0.4, lerp(23.5, 21.0, at(lt, 0, 3.5, 'cubicOut'))); this.st.camera.lookAt(0, -0.3, 0);
    if (chainOut < 1) { X.save(); X.globalAlpha = 1 - chainOut; X.translate(0, -60 * chainOut); this.st.draw(X); X.restore();
      // labels next to the links (projected)
      const names = [['الرجلين', W_(0)], ['الضهر', W_(1)], ['القبضة', W_(5)]];
      names.forEach(([n, t0], i) => { const k = at(t, t0 - 0.05, t0 + 0.25, 'expoOut'); if (k <= 0) return; if (i === 2 && snapped) return;
        this.v.set(-0.9, this.links[i].position.y * 0.86 + this.chain.position.y, 0);
        const [sx, sy] = NK.proj(this.st, this.v, ctx); X.save(); X.globalAlpha = Math.min(1, k * 1.6) * (1 - chainOut);
        const col = i === 2 ? NK.LILAC : '#FFFFFF'; X.strokeStyle = 'rgba(255,255,255,0.45)'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(sx - 10, sy); X.lineTo(sx - 110 * k, sy); X.stroke();
        ctx.text(X, n, sx - 130 * k, sy + 2, { family: 'display', weight: 900, size: 54, color: col, align: 'right' }); X.restore(); });
      NK.head(ctx, t, 'القبضة بتتعب أول', W_(5), { y: 330, size: 100, hi: [0], kicker: 'الحلقة الأضعف', kt: W_(0), times: [W_(5), W_(6), W_(7)], out: tStudy });
      if (snapped) { const kf = 1 - at(t, W_(7) + 0.05, W_(7) + 0.35); if (kf > 0) { X.save(); X.globalAlpha = kf * 0.5; X.fillStyle = '#FFFFFF'; X.fillRect(0, 0, ctx.W, ctx.H); X.restore(); } }
    }
    // the study
    const kp = at(t, tStudy + 0.15, tStudy + 0.55, 'expoOut'); if (kp <= 0) return;
    X.save(); X.globalAlpha = kp; X.translate(0, (1 - kp) * 50);
    NK.head(ctx, t, 'أقصى رفعة ديدلفت', tStudy + 0.2, { y: 400, size: 84, hi: [2], kicker: 'دراسة · 20 رياضي مدرّب' });
    const base = 1180, hmax = 620, grow = at(t, tStudy + 0.4, tStudy + 1.6, 'expoOut'), grow2 = at(t, W_(11) - 0.1, W_(12) + 0.6, 'expoOut');
    const bar = (cx, kg, k, col, label, labCol) => { const h = hmax * (kg / 177) * k; NK.glass(X, cx - 150, base - hmax - 40, 300, hmax + 40, 34, { a0: 0.06, a1: 0.02 });
      const gr = X.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, col); gr.addColorStop(1, '#4B0158'); X.fillStyle = gr; NK.rr(X, cx - 110, base - h, 220, h, 22); X.fill();
      ctx.text(X, ctx.num(kg * k, 1), cx, base - h - 50, { family: 'num', weight: 800, size: 78, color: '#FFFFFF', dir: 'ltr', alpha: k > 0.02 ? 1 : 0 });
      ctx.text(X, label, cx, base + 60, { family: 'display', weight: 900, size: 46, color: labCol }); ctx.text(X, 'kg', cx, base + 112, { family: 'num', weight: 600, size: 30, color: NK.MUT, dir: 'ltr' }); };
    bar(760, 160.6, grow, '#B8A9C0', 'بلا ستراب', '#FFFFFF'); bar(320, 177.0, grow2, NK.LILAC, 'مع ستراب', NK.LILAC);
    X.restore();
    NK.chip(ctx, 540, 1395, '+10%', at(t, W_(13) - 0.05, W_(13) + 0.25, 'expoOut'), { size: 52 });
    NK.source(ctx, t, 'Jukic et al., J Strength Cond Res 2020 · n = 20 trained men', tStudy + 0.4, 1480);
  } });
