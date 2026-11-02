/* s1 v2.1 — HOOK: a real Olympic barbell (20 kg bar, 28 mm knurled shaft, 50 mm sleeves, 3 bumpers a side) on a gym floor.
   It's pulled: the shaft bends first while the plates stay down (bar whip), then the plates break off the floor.
   «بالديدلفت التقيل ضهرك مو هو اللي بيوقّفك… إيدك اللي بتوقّفك» → on screen: «ضهرك؟» struck · «قبضتك هي اللي بتوقّفك». Units = metres. */
MOTION.scene({ id: 's1',
  setup(ctx) { const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 34, camera: [1.2, 0.5, 4.4], env: 'room', tone: 'neutral', exposure: 1.0, vignette: 0.0 });
    const L = 1.31, N = 28, sl = L / N; this.L = L;
    const knurl = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.42, map: NK.knurlTex(THREE, [18, 9]), bumpMap: NK.knurlTex(THREE, [18, 9]), bumpScale: 1.2 });
    const smooth = new THREE.MeshStandardMaterial({ color: 0xc8cbd1, metalness: 1, roughness: 0.26 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe9ebef, metalness: 1, roughness: 0.12 });
    const black = new THREE.MeshStandardMaterial({ color: 0x1b1b20, metalness: 0.4, roughness: 0.45 });
    this.bar = new THREE.Group(); this.st.add(this.bar); this.segs = [];
    for (let i = 0; i < N; i++) { const x = -L / 2 + (i + 0.5) * sl, ax = Math.abs(x), kn = ax < 0.06 || (ax > 0.2 && ax < 0.6);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, sl * 1.02, 24), kn ? knurl : smooth); m.userData.x = x; this.bar.add(m); this.segs.push(m); }
    this.ends = []; this.shadows = [];
    for (const s of [-1, 1]) { const g = new THREE.Group(); this.bar.add(g); this.ends.push(g); g.userData.s = s;
      const cyl = (r, w, x, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 48), mat); m.rotation.z = Math.PI / 2; m.position.x = s * x; g.add(m); return m; };
      cyl(0.0165, 0.02, 0.008, smooth); cyl(0.038, 0.03, 0.033, chrome);                       // bushing + collar shoulder
      cyl(0.025, 0.415, 0.048 + 0.2075, chrome);                                                // sleeve
      for (let k = 0; k < 6; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.0251, 0.0009, 6, 40), smooth); r.rotation.y = Math.PI / 2; r.position.x = s * (0.36 + k * 0.012); g.add(r); }
      [[0.068, '25 KG'], [0.066, '20 KG'], [0.062, '20 KG']].reduce((x, [w, kg]) => { const p = NK.bumper(THREE, { w, kg, label: x < 0.1 ? false : true });
        p.rotation.z = -s * Math.PI / 2; p.position.x = s * (x + w / 2); g.add(p); return x + w + 0.002; }, 0.05);
      cyl(0.042, 0.04, 0.27, black); cyl(0.044, 0.008, 0.252, chrome);                          // lock collar
      const sh = NK.shadow(THREE, 0.42, 0.7, 0.9); this.st.add(sh); this.shadows.push(sh); }
    this.barShadow = NK.shadow(THREE, 1.6, 0.16, 0.45); this.st.add(this.barShadow);
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.92, metalness: 0,
      bumpMap: NK.noiseTex(THREE, [40, 40]), bumpScale: 0.4, alphaMap: NK.canvasTex(THREE, 256, (c, n) => { const r = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        r.addColorStop(0, '#fff'); r.addColorStop(0.55, '#777'); r.addColorStop(1, '#000'); c.fillStyle = r; c.fillRect(0, 0, n, n); }), transparent: true }));
    this.floor.rotation.x = -Math.PI / 2; this.st.add(this.floor);
    this.dust = ctx.particles3D({ count: 110, seed: 7, geometry: 'tetra', color: '#F4F0F7',
      spawn: (i, r) => ({ p: [r.range(-1.1, 1.1), r.range(0.0, 0.25), r.range(-0.35, 0.35)], v: [r.gauss() * 0.03, r.range(0.02, 0.09), r.gauss() * 0.03], s: r.range(0.003, 0.008), spin: r.range(-2, 2), delay: 0, life: 99 }) });
    this.st.add(this.dust.mesh);
    const key = new THREE.DirectionalLight(0xfff6ee, 2.2); key.position.set(2.5, 4, 3); this.st.add(key);
    const fill = new THREE.DirectionalLight(0xd8d0ff, 0.5); fill.position.set(-3, 1.5, 3); this.st.add(fill);
    const rim = new THREE.DirectionalLight(0xb070ff, 1.6); rim.position.set(-2, 2.5, -4); this.st.add(rim);
  },
  draw(t, lt, ctx) { const { X, at, lerp } = ctx; const W_ = i => NK.W(ctx, 'l1', i), L = this.L;
    NK.bg2(ctx, t, { glowY: 1000, glowA: 0.30 });
    // the pull: shaft bends first (plates still down), then the plates break off the floor; a little whip on the way up
    const pre = at(lt, 0.35, 1.05, 'sineInOut'), up = at(lt, 1.0, 2.3, 'cubicInOut');
    const hp = 0.32 * up, whip = 0.012 * Math.sin((lt - 1.0) * 11) * up * (1 - at(lt, 1.6, 3.0));
    const bend = 0.04 * pre * (1 - 0.6 * up) + whip, R0 = 0.225;
    const yOf = x => R0 + hp + bend * (1 - (2 * x / L) ** 2), dOf = x => -bend * 8 * x / (L * L);
    for (const m of this.segs) { const x = m.userData.x; m.position.set(x, yOf(x), 0); m.rotation.z = Math.PI / 2 + Math.atan(dOf(x)); }
    for (const g of this.ends) { const x = g.userData.s * L / 2; g.position.set(x, yOf(x), 0); g.rotation.z = Math.atan(dOf(x)); }
    this.bar.rotation.y = -0.98 + 0.10 * at(lt, 0, 4.8, 'sineInOut');
    const c = Math.cos(this.bar.rotation.y), s_ = Math.sin(this.bar.rotation.y);
    this.shadows.forEach((sh, i) => { const x = (i ? 1 : -1) * (L / 2 + 0.15); sh.position.set(x * c, 0.002, -x * s_); sh.rotation.z = this.bar.rotation.y;
      sh.scale.setScalar(1 + 1.4 * hp); sh.material.opacity = 0.9 * (1 - 0.75 * up); });
    this.barShadow.rotation.z = this.bar.rotation.y; this.barShadow.position.y = 0.001; this.barShadow.material.opacity = 0.45 * (1 - 0.6 * up);
    this.dust.update(lt);
    // camera: starts low and close on the near plate, pulls back to the whole bar
    const pb = at(lt, 0.0, 2.4, 'cubicInOut');
    this.st.camera.position.set(lerp(1.15, 0.3, pb), lerp(0.3, 0.72, pb), lerp(2.15, 4.7, pb)); this.st.camera.lookAt(lerp(0.42, 0.02, pb), lerp(0.25, 0.34, pb), lerp(0.55, 0, pb));
    ctx.resetTransform(X); X.save(); X.translate(0, 60); this.st.draw(X); X.restore(); ctx.resetTransform(X);
    // words on the voice
    NK.head(ctx, t, 'ضهرك؟', W_(2), { y: 470, size: 170, kicker: 'ديدلفت تقيل · بلا ستراب', kt: W_(0), strike: W_(3), out: W_(7) - 0.2 });
    NK.head(ctx, t, 'مو هو اللي بيوقّفك', W_(3), { y: 590, size: 60, color: NK.MUT, times: [W_(3), W_(4), W_(5), W_(6)], out: W_(7) - 0.2 });
    NK.head(ctx, t, 'قبضتك هي اللي بتوقّفك', W_(7), { y: 1330, size: 112, hi: [0], times: [W_(7), W_(7) + 0.14, W_(8), W_(9)] });
  } });
