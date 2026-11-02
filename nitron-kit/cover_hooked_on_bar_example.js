/* s1 v2.1 — HOOK: a real Olympic barbell (20 kg bar, 28 mm knurled shaft, 50 mm sleeves, 3 bumpers a side) on a gym floor.
   It's pulled: the shaft bends first while the plates stay down (bar whip), then the plates break off the floor.
   «بالديدلفت التقيل ضهرك مو هو اللي بيوقّفك… إيدك اللي بتوقّفك» → on screen: «ضهرك؟» struck · «قبضتك هي اللي بتوقّفك». Units = metres. */
MOTION.scene({ id: 'cv',
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
  draw(t, lt, ctx) { const { X } = ctx, L = this.L, R0 = 0.225, T = -85;
    X.fillStyle = '#0A0A0C'; X.fillRect(0, 0, ctx.W, ctx.H);
    const sp = X.createRadialGradient(540, 980, 40, 540, 1000, 900); sp.addColorStop(0, 'rgba(118,2,138,0.55)'); sp.addColorStop(0.55, 'rgba(75,1,88,0.2)'); sp.addColorStop(1, 'rgba(10,10,12,0)'); X.fillStyle = sp; X.fillRect(0, 0, ctx.W, ctx.H);
    // bar on a rack height (no floor contact), close hero shot: knurled shaft across the frame, near plates at the right edge
    for (const m of this.segs) { m.position.set(m.userData.x, R0, 0); m.rotation.z = Math.PI / 2; }
    for (const g of this.ends) { g.position.set(g.userData.s * L / 2, R0, 0); g.rotation.z = 0; }
    this.bar.rotation.y = -0.22; this.floor.visible = false; this.shadows.forEach(s => s.visible = false); this.barShadow.visible = false; this.dust.mesh.visible = false;
    this.st.camera.position.set(0.25, 0.32, 2.5); this.st.camera.lookAt(0.05, 0.25, 0);
    ctx.resetTransform(X); X.save(); X.translate(0, T); this.st.draw(X); X.restore(); ctx.resetTransform(X);
    this.v = this.v || new ctx.THREE.Vector3(); const P = (x, y) => { this.v.set(x, y, 0).applyMatrix4(this.bar.matrixWorld); const q = NK.proj(this.st, this.v, ctx); return [q[0], q[1] + T]; };
    this.bar.updateMatrixWorld(true);
    const A = P(-0.32, R0), B = P(0.16, R0), ang = Math.atan2(B[1] - A[1], B[0] - A[0]), C = P(0.15, R0), rpx = Math.abs(P(0.15, R0 + 0.014)[1] - C[1]);
    // the straps: rotated so both left loops sit on the bar and the straps hang down
    const img = ctx.img('red8'); if (!img) return; const s = 1.34, rot = 2.437 + ang, mx = 179.5, my = 258.5;
    const hole = (hx, hy) => { const dx = (hx - mx) * s, dy = (hy - my) * s; return [C[0] + dx * Math.cos(rot) - dy * Math.sin(rot), C[1] + dx * Math.sin(rot) + dy * Math.cos(rot)]; };
    X.save(); X.translate(C[0], C[1]); X.rotate(rot); X.scale(s, s); X.shadowColor = 'rgba(0,0,0,0.6)'; X.shadowBlur = 40; X.shadowOffsetY = 26; X.drawImage(img, -mx, -my); X.restore();
    // thread the bar: on the left side of each loop the bar passes in front of the strap
    for (const h of [hole(80, 174), hole(279, 343)]) { X.save(); X.translate(h[0], h[1]); X.rotate(ang); X.beginPath(); X.rect(-150, -rpx + 1, 150, 2 * rpx - 2); X.rotate(-ang); X.translate(-h[0], -h[1]); X.clip();
      ctx.resetTransform(X); X.save(); X.translate(0, T); this.st.draw(X); X.restore(); X.restore(); }
    // text: headline top, FIGURE 8 STRAP tag on the bar, 3 numbered steps at the bottom (standard figure-8 method)
    ctx.text(X, 'كيف تلبس', 540, 560, { family: 'display', weight: 900, size: 132, color: '#FFFFFF', shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    ctx.text(X, 'الستراب صح؟', 540, 690, { family: 'display', weight: 900, size: 100, color: NK.LILAC, shadow: { color: 'rgba(0,0,0,0.5)', blur: 30, y: 10 } });
    X.font = ctx.font('num', 800, 28); const kw = X.measureText('FIGURE 8 STRAP').width + 52; X.fillStyle = NK.PURPLE; NK.rr(X, 40, C[1] - 150, kw, 50, 25); X.fill();
    ctx.text(X, 'FIGURE 8 STRAP', 40 + kw / 2, C[1] - 124, { family: 'num', weight: 800, size: 28, color: '#FFFFFF', dir: 'ltr' });
    const steps = [['١', 'إيدك', 'بالحلقة'], ['٢', 'الحلقة', 'تحت البار'], ['٣', 'امسك', 'وشد']], cw = 310, gap = 20, y0 = 1330;
    steps.forEach(([n, a, b], i) => { const x = 540 + (1 - i) * (cw + gap) - cw / 2; NK.glass(X, x, y0, cw, 150, 34, { tint: 'rgba(10,10,12,0.55)' });
      X.fillStyle = NK.PURPLE; X.beginPath(); X.arc(x + cw - 50, y0 + 75, 32, 0, 7); X.fill();
      ctx.text(X, n, x + cw - 50, y0 + 84, { family: 'display', weight: 900, size: 40, color: '#FFFFFF' });
      ctx.text(X, a, x + cw - 96, y0 + 64, { family: 'display', weight: 900, size: 38, color: '#FFFFFF', align: 'right' });
      ctx.text(X, b, x + cw - 96, y0 + 112, { family: 'display', weight: 800, size: 34, color: NK.LILAC, align: 'right' }); });
    const logo = ctx.img('logo'); if (logo) { const w = 360, h = w * logo.height / logo.width; X.drawImage(logo, 540 - w / 2, 1620 - h / 2, w, h); }
  } });
