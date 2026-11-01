/* s1 — HOOK: a heavy 3D barbell leaves the floor and bends; «ضهرك مو هو اللي بيوقّفك بالديدلفت… إيدك هي.» */
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
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 6); this.st.add(key);
    const back = new THREE.DirectionalLight(0xb070ff, 0.8); back.position.set(-4, 2, -5); this.st.add(back);
  },
  draw(t, lt, ctx) { const { X, at, E } = ctx;
    NK.bg(ctx, 980, 0.30);
    const lift = at(lt, 0.25, 1.6, 'cubicInOut'), bend = 0.42 * lift + 0.04 * Math.sin(lt * 9) * lift * (1 - at(lt, 1.6, 2.6));
    const y0 = -0.9 + 0.95 * lift, L = 4.2;
    const yOf = x => y0 + bend * (1 - (2 * x / L) ** 2) * 0.5 - bend * 0.5;           // centre held up, ends droop
    for (const m of this.segs) { const x = m.userData.x, dy = -bend * 4 * x / (L * L); m.position.set(x, yOf(x), 0); m.rotation.z = Math.PI / 2 + Math.atan(dy); }
    for (const g of this.ends) { const s = g.userData.s, x = s * L / 2, slope = -bend * 4 * x / (L * L); g.position.set(x, yOf(x), 0); g.rotation.z = Math.atan(slope); }
    this.root.rotation.y = -1.08 + 0.14 * at(lt, 0, 4.6, 'sineInOut'); this.root.rotation.x = 0.16;
    this.st.camera.position.set(0.4, 0.9, 17.5 - 2.6 * at(lt, 0, 4.6, 'cubicOut')); this.st.camera.lookAt(0, -0.15, 0);
    ctx.resetTransform(X); X.save(); X.translate(0, -230); this.st.draw(X); X.restore(); ctx.resetTransform(X);
    // kicker
    const kk = at(lt, 0.1, 0.45, 'expoOut'); X.save(); X.globalAlpha = kk; ctx.text(X, 'ديدلفت تقيل · بلا ستراب', 540, 290 - (1 - kk) * 20, { family: 'display', weight: 800, size: 46, color: NK.MUT }); X.restore();
    // the claim, then the slam
    const out1 = 2.3;
    NK.words(ctx, lt, 'ضهرك مو هو اللي', 540, 1230, { size: 84, t0: 0.45, out: out1, maxWidth: 1000 });
    NK.words(ctx, lt, 'بيوقّفك بالديدلفت…', 540, 1345, { size: 84, t0: 0.85, out: out1, maxWidth: 1000 });
    const ks = at(lt, 2.45, 2.66, 'expoOut'); if (ks > 0) { X.save(); const sc = 1.35 - 0.35 * ks; X.translate(540, 1300); X.scale(sc, sc); X.globalAlpha = Math.min(1, ks * 2);
      ctx.text(X, 'إيدك هي.', 0, 0, { family: 'display', weight: 900, size: 172, color: NK.LILAC, shadow: { blur: 30, y: 8, color: 'rgba(0,0,0,0.6)' } }); X.restore();
      const kb = at(lt, 2.62, 2.95, 'expoOut'); X.fillStyle = NK.PURPLE; NK.rr(X, 540 - 260 * kb, 1380, 520 * kb, 14, 7); X.fill(); }
  } });
