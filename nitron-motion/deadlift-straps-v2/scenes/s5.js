/* s5 v2 — a lit 3D lumbar segment (L3–S1, bodies + discs + posterior processes) slowly orbiting; on «بيتحمّل ضغط» the
   discs compress and L4/L5 heats up; counter to 17,192 N; on «أضعاف وزن جسمك» the chip. Then a short on-screen tip:
   keep the bar close (moment = weight × distance, physics). Cholewicki, McGill & Norman, Med Sci Sports Exerc 1991
   (average estimate, national-level powerlifters, model). 17,192 N ≈ 1.75 t-force ≈ many times body weight. */
MOTION.scene({ id: 's5',
  setup(ctx) { const { THREE } = ctx;
    this.st = ctx.stage3D({ fov: 30, camera: [5, 1.5, 17], env: 'room', tone: 'neutral', exposure: 0.78 });
    const lathe = (pts, seg = 72) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
    const BODY = lathe([[0.001, -0.36], [0.9, -0.36], [0.985, -0.33], [1.0, -0.27], [0.9, -0.1], [0.87, 0], [0.9, 0.1], [1.0, 0.27], [0.985, 0.33], [0.9, 0.36], [0.001, 0.36]]);
    const DISC = lathe([[0.001, -0.15], [0.88, -0.15], [0.96, -0.09], [0.995, 0], [0.96, 0.09], [0.88, 0.15], [0.001, 0.15]]);
    const bone = new THREE.MeshStandardMaterial({ color: 0x9e929c, roughness: 0.8, envMapIntensity: 0.2, metalness: 0.0, roughnessMap: NK.noiseTex(THREE, [3, 3], 170, 255) });
    this.spine = new THREE.Group(); this.st.add(this.spine); this.discs = [];
    const names = ['L3', 'L4', 'L5', 'S1'];
    names.forEach((n, i) => { const g = new THREE.Group(); const y = 1.65 - i * 1.1; g.position.y = y;
      const body = new THREE.Mesh(BODY, bone); body.scale.z = 0.78; g.add(body);
      if (n !== 'S1') { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 1.4), bone); sp.position.set(0, -0.08, -1.35); sp.rotation.x = 0.35; g.add(sp);
        for (const s of [-1, 1]) { const tp = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.22, 0.32), bone); tp.position.set(s * 0.95, 0.05, -0.75); tp.rotation.y = s * 0.3; g.add(tp); }
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.13, 12, 32, Math.PI), bone); arch.rotation.x = Math.PI / 2; arch.position.set(0, 0, -0.62); g.add(arch); }
      else { body.scale.set(1.15, 1.2, 0.9); }
      this.spine.add(g);
      if (i < 3) { const dm = new THREE.MeshPhysicalMaterial({ color: 0x8a1aa0, roughness: 0.5, clearcoat: 0.3, sheen: 0.6, envMapIntensity: 0.45, emissive: 0x1a0022 });
        const d = new THREE.Mesh(DISC, dm); d.scale.z = 0.78; d.position.y = y - 0.55; this.spine.add(d); this.discs.push(d); } });
    const key = new THREE.DirectionalLight(0xfff4ec, 1.5); key.position.set(8, 6, 1); this.st.add(key);
    const rim = new THREE.DirectionalLight(0xb070ff, 1.2); rim.position.set(-5, 2, -5); this.st.add(rim);
  },
  draw(t, lt, ctx) { const { X, at, lerp } = ctx; const W_ = i => NK.W(ctx, 'l5', i);
    NK.bg2(ctx, t, { glowY: 820, glowA: 0.30 });
    NK.head(ctx, t, 'وضهرك؟', W_(1) - 0.05, { y: 300, size: 112, hi: [0], kicker: 'أسفل الضهر' });
    const press = at(t, W_(7) - 0.1, W_(8) + 0.5, 'cubicInOut');
    this.discs.forEach((d, i) => { const hot = i === 1; d.scale.y = 1 - (hot ? 0.32 : 0.18) * press; d.material.color.setRGB(lerp(0.54, 0.86, hot ? press : press * 0.4), lerp(0.10, 0.48, hot ? press : press * 0.3), lerp(0.63, 0.92, hot ? press : press * 0.4));
      d.material.emissive.setRGB(0.10 + 0.25 * (hot ? press : 0), 0.0, 0.13 + 0.3 * (hot ? press : 0)); });
    this.spine.children.forEach(c => { if (c.isGroup) c.position.y += 0; });
    const az = -0.65 + 0.5 * at(lt, 0, 7.5, 'sineInOut'); this.st.camera.position.set(18 * Math.sin(az), 1.6, 18 * Math.cos(az)); this.st.camera.lookAt(0, 0.0, 0);
    this.spine.position.x = 0; this.spine.position.y = 0.3 - 0.05 * press;
    X.save(); X.translate(-200, -110); this.st.draw(X); X.restore();
    // compression arrows above the spine
    if (press > 0) for (const dx of [-60, 60]) NK.arrow(X, 340 + dx, 330, 340 + dx, 330 + 110 * press, 12 + 6 * press, NK.LILAC, 32);
    // the number
    const kn = at(t, W_(7) - 0.1, W_(7) + 0.2, 'expoOut'); if (kn > 0) { X.save(); X.globalAlpha = kn;
      ctx.text(X, ctx.num(Math.round(17192 * at(t, W_(7), W_(9), 'expoOut'))), 790, 700, { family: 'num', weight: 800, size: 96, color: '#FFFFFF', dir: 'ltr' });
      ctx.text(X, 'نيوتن على L4/L5', 790, 785, { family: 'display', weight: 800, size: 38, color: NK.MUT }); X.restore(); }
    NK.chip(ctx, 790, 885, 'أضعاف وزن جسمك', at(t, W_(9) - 0.05, W_(9) + 0.25, 'expoOut'), { size: 38 });
    const kc = at(t, W_(10), W_(10) + 0.3); if (kc > 0) ctx.text(X, '≈ 1.75 طن · تقدير بنموذج', 790, 965, { family: 'display', weight: 700, size: 30, color: NK.MUT, alpha: kc });
    // tip after the line: keep the bar close
    const tipT = ctx.lineSpan('l5').e + 0.15, kt = at(t, tipT, tipT + 0.35, 'expoOut');
    if (kt > 0) { X.save(); X.globalAlpha = kt; X.translate(0, (1 - kt) * 30); NK.glass(X, 90, 1290, 900, 150, 40, { tint: 'rgba(10,10,12,0.6)' });
      ctx.text(X, 'خلّي البار لازق بجسمك', 540, 1345, { family: 'display', weight: 900, size: 52, color: '#FFFFFF' });
      ctx.text(X, 'كل ما يبعد، العزم على ضهرك بيكبر', 540, 1405, { family: 'display', weight: 800, size: 34, color: NK.LILAC }); X.restore(); }
    NK.source(ctx, t, 'Cholewicki, McGill & Norman, Med Sci Sports Exerc 1991', W_(7), 1484);
  } });
