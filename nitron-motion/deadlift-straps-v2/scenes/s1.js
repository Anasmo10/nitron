/* s1 — HOOK: a heavy 3D barbell leaves the floor and bends; «ضهرك مو هو اللي بيوقّفك بالديدلفت… قبضتك هي.» */
MOTION.scene({ id: 's1',
  setup(ctx) { const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 30, camera: [0, 0.4, 11], env: 'room', tone: 'neutral', exposure: 1.05, vignette: 0.0 });
    const steel = new THREE.MeshStandardMaterial({ color: 0xd5d8de, metalness: 1, roughness: 0.22 });
    const sleeve = new THREE.MeshStandardMaterial({ color: 0xe8eaee, metalness: 1, roughness: 0.15 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x121216, metalness: 0.05, roughness: 0.62 });
    const rim = new THREE.MeshStandardMaterial({ color: 0x76028a, metalness: 0.3, roughness: 0.35, emissive: 0x2a0033 });
    this.root = new THREE.Group(); this.st.add(this.root);
    this.segs = []; const N = 28, L = 4.2;                       // the shaft between the sleeves, in segments so it can bend
    for (let i = 0; i < N; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, L / N * 1.04, 20), steel); m.userData.x = -L / 2 + (i + 0.5) * L / N; this.root.add(m); this.segs.push(m); }
    this.ends = [];
    for (const s of [-1, 1]) { const g = new THREE.Group(); this.root.add(g); this.ends.push(g); g.userData.s = s;
      const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 28), sleeve); sl.rotation.z = Math.PI / 2; sl.position.x = s * 0.8; g.add(sl);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 28), sleeve); col.rotation.z = Math.PI / 2; col.position.x = s * 0.02; g.add(col);
      [[1.12, 0.2], [1.12, 0.2], [1.12, 0.2], [0.9, 0.16]].forEach(([r, w], i) => { const x = s * (0.16 + i * 0.215 + w / 2);
        const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 72), rubber); p.rotation.z = Math.PI / 2; p.position.x = x; g.add(p);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r - 0.02, 0.025, 10, 90), rim); ring.rotation.y = Math.PI / 2; ring.position.x = x + s * w / 2; g.add(ring);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, w + 0.01, 28), sleeve); hub.rotation.z = Math.PI / 2; hub.position.x = x; g.add(hub); }); }
    this.dust = ctx.particles3D({ count: 160, seed: 7, geometry: 'tetra', color: '#F4F0F7',
      spawn: (i, r) => ({ p: [r.range(-4, 4), r.range(-2.5, 2.5), r.range(-2, 3)], v: [r.gauss() * 0.05, r.range(0.04, 0.16), r.gauss() * 0.05], s: r.range(0.012, 0.035), spin: r.range(-2, 2), delay: 0, life: 99 }) });
    this.st.add(this.dust.mesh);
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 6); this.st.add(key);
    const back = new THREE.DirectionalLight(0xb070ff, 0.8); back.position.set(-4, 2, -5); this.st.add(back);
  },
  draw(t, lt, ctx) { const { X, at } = ctx; const W_ = i => NK.W(ctx, 'l1', i);
    NK.bg2(ctx, t, { glowY: 980, glowA: 0.30 });
    const lift = at(lt, 0.2, 1.7, 'cubicInOut'), bend = 0.42 * lift + 0.04 * Math.sin(lt * 9) * lift * (1 - at(lt, 1.7, 2.7));
    const y0 = -0.9 + 0.95 * lift, L = 4.2;
    const yOf = x => y0 + bend * (1 - (2 * x / L) ** 2) * 0.5 - bend * 0.5;
    for (const m of this.segs) { const x = m.userData.x, dy = -bend * 4 * x / (L * L); m.position.set(x, yOf(x), 0); m.rotation.z = Math.PI / 2 + Math.atan(dy); }
    for (const g of this.ends) { const s = g.userData.s, x = s * L / 2, slope = -bend * 4 * x / (L * L); g.position.set(x, yOf(x), 0); g.rotation.z = Math.atan(slope); }
    this.root.rotation.y = -1.08 + 0.16 * at(lt, 0, 4.8, 'sineInOut'); this.root.rotation.x = 0.16;
    this.dust.update(lt);
    // cinematic pull-back: from the knurl of the near sleeve to the whole bar
    const pb = at(lt, 0.0, 2.2, 'cubicInOut');
    this.st.camera.position.set(ctx.lerp(1.6, 0.4, pb), ctx.lerp(0.2, 0.9, pb), ctx.lerp(6.5, 16.8, pb)); this.st.camera.lookAt(ctx.lerp(1.4, 0, pb), ctx.lerp(-0.4, -0.15, pb), 0);
    ctx.resetTransform(X); X.save(); X.translate(0, -230); this.st.draw(X); X.restore(); ctx.resetTransform(X);
    // words on the voice
    const kk = at(t, W_(0) - 0.05, W_(0) + 0.3, 'expoOut'); X.save(); X.globalAlpha = kk; ctx.text(X, 'ديدلفت تقيل · بلا ستراب', 540, 290 - (1 - kk) * 20, { family: 'display', weight: 800, size: 46, color: NK.MUT }); X.restore();
    const kb = NK.slam(ctx, t, 'ضهرك؟', 540, 1290, W_(2), { size: 150, out: W_(7) - 0.15 });
    if (kb > 0) { const ks = at(t, W_(3), W_(3) + 0.3, 'expoOut'); if (ks > 0) { X.save(); X.globalAlpha = kb; X.strokeStyle = NK.LILAC; X.lineWidth = 16; X.lineCap = 'round';
      X.beginPath(); X.moveTo(780, 1300); X.lineTo(780 - 520 * ks, 1300); X.stroke(); X.restore(); } }
    const kh = NK.slam(ctx, t, 'قبضتك هي.', 540, 1290, W_(7), { size: 138, color: NK.LILAC, from: 1.4 });
    if (kh > 0) { const ku = at(t, W_(7) + 0.18, W_(7) + 0.5, 'expoOut'); X.fillStyle = NK.PURPLE; NK.rr(X, 540 - 250 * ku, 1372, 500 * ku, 14, 7); X.fill(); }
  } });
