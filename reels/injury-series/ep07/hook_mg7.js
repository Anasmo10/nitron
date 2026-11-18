/* ═══ EP07 — the arm on the preacher pad, drawn in the series' ink (light outline, dark fill, the muscle in purple, lilac
   for what matters). One drawing, used three times: the hook (the tendon snaps), C1 (why: the elbow near straight, the
   biceps stretched under the weight) and C2 (the force beats what the tendon can hold, close up).
   Equipment first, then the body on it (EP05 rule): the pad on its post, the bar and its plate, then the arm lying on the
   pad, the hand round the bar. The upper arm's back lies on the pad; the biceps is on its upper side; its distal tendon
   crosses the elbow to the forearm. An illustration of the mechanism, not this lifter's diagnosis. */
const A7E=t=>t<=0?0:t>=1?1:t*t*(3-2*t), A7P=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
const A7INK='rgba(236,230,242,0.92)', A7FILL='#241c2b', A7PUR='#76028A', A7LIL='#C77DDB';
/* the pad: top surface from PA to PB (the arm lies on it), the body below it */
const A7={PA:[230,690],PB:[650,1090]};
A7.d=(()=>{ const dx=A7.PB[0]-A7.PA[0], dy=A7.PB[1]-A7.PA[1], l=Math.hypot(dx,dy); return [dx/l,dy/l]; })();
A7.nUp=[A7.d[1],-A7.d[0]];            /* away from the pad (the arm's side) */
A7.nDn=[-A7.d[1],A7.d[0]];            /* into the pad */
const a7add=(p,v,s)=>[p[0]+v[0]*s,p[1]+v[1]*s];
A7.S=a7add(a7add(A7.PA,A7.d,24),A7.nUp,60);       /* shoulder */
A7.E=a7add(a7add(A7.PA,A7.d,548),A7.nUp,46);      /* elbow, just past the pad's end */
const A7L2=430;
function a7rot(v,ang){ const c=Math.cos(ang), s=Math.sin(ang); return [v[0]*c-v[1]*s, v[0]*s+v[1]*c]; }
/* st: {phi elbow flex (rad, 0 = straight), k draw-in 0..1, stretch 0..1, tear (seconds after the snap or <0), recoil 0..1,
        hot (tendon lilac), fib (C2: fibres shown) , fail 0..1 (fibres breaking, C2)} */
function a7Arm(t,st){
  const k=st.k===undefined?1:st.k, kk=a=>Math.max(0,Math.min(1,(k-a)/0.3));
  const S=A7.S, E=A7.E, fd=a7rot(A7.d,-st.phi), fn=[fd[1],-fd[0]], H=a7add(E,fd,A7L2);
  /* 1) the pad and its post */
  { const k0=kk(0); if(k0>0){ X.save(); X.globalAlpha*=Math.min(1,k0*1.4);
      const pa=A7.PA, pb=A7.PB, th=86, pa2=a7add(pa,A7.nDn,th), pb2=a7add(pb,A7.nDn,th);
      const P_=new Path2D(); P_.moveTo(...a7add(pa,A7.d,-30)); P_.lineTo(...pb); P_.quadraticCurveTo(...a7add(a7add(pb,A7.d,40),A7.nDn,th/2),...pb2); P_.lineTo(...a7add(pa2,A7.d,-30)); P_.closePath();
      X.lineJoin='round'; X.strokeStyle=A7INK; X.lineWidth=7; X.stroke(P_); X.fillStyle='#1b1520'; X.fill(P_);
      X.strokeStyle='rgba(236,230,242,0.25)'; X.lineWidth=3; X.beginPath(); X.moveTo(...a7add(a7add(pa,A7.nDn,16),A7.d,-10)); X.lineTo(...a7add(a7add(pb,A7.nDn,16),A7.d,-10)); X.stroke();
      const mid=a7add(a7add(pa,A7.d,250),A7.nDn,th); const post=new Path2D(); post.moveTo(mid[0]-26,mid[1]-6); post.lineTo(mid[0]-26,1560); post.lineTo(mid[0]+26,1560); post.lineTo(mid[0]+26,mid[1]+18); post.closePath();
      X.strokeStyle=A7INK; X.lineWidth=6; X.stroke(post); X.fillStyle='#1b1520'; X.fill(post);
      X.beginPath(); X.moveTo(mid[0]-170,1560); X.lineTo(mid[0]+170,1560); X.lineWidth=10; X.lineCap='round'; X.stroke();
      X.restore(); } }
  /* 2) the lifter: the seat, the hips on it, the torso leaning over the pad's top, the head — one silhouette */
  { const k1=kk(0.12); if(k1>0){ X.save(); X.globalAlpha*=Math.min(1,k1*1.3);
      const seat=new Path2D(); seat.moveTo(-120,1060); seat.lineTo(150,1060); seat.quadraticCurveTo(176,1062,176,1086); seat.lineTo(176,1100); seat.lineTo(-120,1100); seat.closePath();
      X.lineJoin='round'; X.strokeStyle=A7INK; X.lineWidth=6; X.stroke(seat); X.fillStyle='#1b1520'; X.fill(seat);
      X.beginPath(); X.moveTo(40,1100); X.lineTo(40,1560); X.lineWidth=10; X.stroke(); X.beginPath(); X.moveTo(-90,1560); X.lineTo(170,1560); X.stroke();
      const neck=[S[0]-26,S[1]-118], head=[S[0]-6,S[1]-196];
      const body=new Path2D(); k5cap(body,[40,1010],92,[S[0]-40,S[1]-30],86);           /* hips → shoulders, leaning forward */
      k5cap(body,[S[0]-40,S[1]-30],70,neck,40); body.moveTo(head[0]+74,head[1]); body.arc(head[0],head[1],74,0,2*Math.PI);
      k5cap(body,[60,1040],70,[250,1070],58);                                              /* the thigh on the seat */
      X.strokeStyle=A7INK; X.lineWidth=8; X.stroke(body); X.fillStyle=A7FILL; X.fill(body);
      X.strokeStyle='rgba(236,230,242,0.35)'; X.lineWidth=3; X.beginPath(); X.arc(head[0]+30,head[1]-6,30,-0.6,0.8); X.stroke();   /* the ear */
      X.restore(); } }
  /* 3) the bar (end on) and its plate, held in the hand */
  { const k2=kk(0.2); if(k2>0){ X.save(); X.globalAlpha*=Math.min(1,k2*1.4); const pc=a7add(H,fd,6);
      X.fillStyle='rgba(36,28,43,0.85)'; X.beginPath(); X.arc(pc[0],pc[1],150,0,7); X.fill(); X.strokeStyle=A7INK; X.lineWidth=6; X.stroke();
      X.strokeStyle='rgba(236,230,242,0.35)'; X.lineWidth=3; X.beginPath(); X.arc(pc[0],pc[1],112,0,7); X.stroke(); X.beginPath(); X.arc(pc[0],pc[1],42,0,7); X.stroke();
      X.fillStyle='#cfd3d9'; X.beginPath(); X.arc(pc[0],pc[1],24,0,7); X.fill(); X.strokeStyle=A7INK; X.lineWidth=3; X.stroke();
      if(st.drop>0.05){ X.strokeStyle='rgba(236,230,242,0.4)'; X.lineWidth=3; for(const dx of [-60,0,60]){ X.beginPath(); X.moveTo(pc[0]+dx,pc[1]-170); X.lineTo(pc[0]+dx,pc[1]-170-150*st.drop); X.stroke(); } }
      X.restore(); } }
  /* 4) the arm: upper arm on the pad, forearm, hand round the bar — one silhouette */
  { const k3=kk(0.32); if(k3>0){ const P_=new Path2D(); k5cap(P_,S,64,E,44); k5cap(P_,E,44,a7add(H,fd,-30),32); P_.moveTo(H[0]+40,H[1]); P_.arc(H[0],H[1],40,0,2*Math.PI);
      X.save(); X.globalAlpha*=Math.min(1,k3*1.3); X.lineJoin='round'; X.strokeStyle=A7INK; X.lineWidth=8; X.stroke(P_); X.fillStyle=A7FILL; X.fill(P_);
      /* the fingers round the bar: three short arcs over the grip */
      X.strokeStyle='rgba(236,230,242,0.55)'; X.lineWidth=3; for(const r of [26,34]){ X.beginPath(); X.arc(H[0],H[1],r,Math.atan2(fd[1],fd[0])-1.1,Math.atan2(fd[1],fd[0])+1.1); X.stroke(); }
      X.restore(); } }
  /* 5) the biceps (purple) on the upper side of the upper arm, and its distal tendon over the elbow to the forearm */
  { const k4=kk(0.5); if(k4<=0) return {E,H,fd,fn};
    const L=Math.hypot(E[0]-S[0],E[1]-S[1]), str=st.stretch||0, rec=st.recoil||0;
    const u0=0.12+0.22*rec, u1=0.89-0.03*str-0.20*rec, thick=(1-0.28*str)*(1+0.55*rec);            /* stretched: longer and thinner · torn: bunched up toward the shoulder */
    const ax=u=>a7add(S,A7.d,0), at=u=>[S[0]+(E[0]-S[0])*u, S[1]+(E[1]-S[1])*u];
    const top=[], bot=[]; for(let j=0;j<=24;j++){ const u=u0+(u1-u0)*j/24, s=Math.sin(Math.PI*j/24), c=at(u), r=(18+52*s)*thick;
      top.push(a7add(c,A7.nUp,Math.min(62,8+r))); bot.push(a7add(c,A7.nUp,Math.max(-10,8+r*0.10-6))); }
    const shape=top.concat(bot.reverse()); const P_=new Path2D(); shape.forEach((q,i)=>i?P_.lineTo(...q):P_.moveTo(...q)); P_.closePath();
    X.save(); X.globalAlpha*=Math.min(1,k4*1.4); X.fillStyle=`rgba(118,2,138,${0.70+0.2*(st.glow||0)})`; X.fill(P_); X.strokeStyle=A7LIL; X.lineWidth=4; X.stroke(P_);
    X.save(); X.clip(P_); X.strokeStyle='rgba(199,125,219,0.55)'; X.lineWidth=3;
    for(let f=1;f<7;f++){ X.beginPath(); for(let j=0;j<=24;j++){ const u=u0+(u1-u0)*j/24, s=Math.sin(Math.PI*j/24), c=at(u), off=8+(18+52*s)*thick*(f/7); const q=a7add(c,A7.nUp,off); j?X.lineTo(...q):X.moveTo(...q); } X.stroke(); }
    if(str>0.05){ X.strokeStyle=`rgba(255,255,255,${0.35*str})`; X.lineWidth=2; X.setLineDash([10,16]); X.lineDashOffset=-t*60; for(let f=2;f<6;f+=2){ X.beginPath(); for(let j=0;j<=24;j++){ const u=u0+(u1-u0)*j/24, s=Math.sin(Math.PI*j/24), c=at(u); const q=a7add(c,A7.nUp,8+(18+52*s)*thick*(f/7)); j?X.lineTo(...q):X.moveTo(...q);} X.stroke(); } X.setLineDash([]); }
    X.restore(); X.restore();
    /* the tendon: from the muscle's end over the elbow to the forearm (radial tuberosity) */
    const m=a7add(at(u1),A7.nUp,12), ins=a7add(a7add(E,fd,78),fn,14), mid=a7add(a7add(E,A7.nUp,26),fd,10);
    const tw=12*(1-0.25*str), hot=st.hot||str>0.4, tear=st.tear===undefined?-1:st.tear;
    const tendon=(a,b,c,col,w)=>{ X.save(); X.lineCap='round'; X.strokeStyle=col; X.lineWidth=w; X.beginPath(); X.moveTo(...a); X.quadraticCurveTo(...b,...c); X.stroke(); X.restore(); };
    const tremble=(st.tremble||0)*Math.sin(t*63)*3;
    if(tear<0){ X.save(); X.globalAlpha*=Math.min(1,k4*1.4);
      if(hot){ X.save(); X.globalCompositeOperation='lighter'; tendon(m,a7add(mid,A7.nUp,tremble),ins,`rgba(199,125,219,${0.35+0.4*str})`,tw+14); X.restore(); }
      tendon(m,a7add(mid,A7.nUp,tremble),ins,A7INK,tw+6); tendon(m,a7add(mid,A7.nUp,tremble),ins,hot?'#F1D9F7':'#d9d2df',tw);
      if(st.fib){ const nf=7, fail=st.fail||0; for(let i=0;i<nf;i++){ const o=(i-(nf-1)/2)*2.2, broke=fail*nf>i+0.5; if(broke) continue; X.save(); X.strokeStyle='rgba(118,2,138,0.55)'; X.lineWidth=1.5; X.beginPath(); X.moveTo(m[0],m[1]+o); X.quadraticCurveTo(mid[0],mid[1]+o+tremble,ins[0],ins[1]+o); X.stroke(); X.restore(); } }
      X.restore(); }
    else { /* torn: the distal stub stays on the forearm, the proximal stub snaps back with the muscle; frayed ends */
      const sp=A7E(A7P(tear,0,0.18)), mm=[m[0]+(mid[0]-m[0])*0.45,m[1]+(mid[1]-m[1])*0.45], dd=[ins[0]+(mid[0]-ins[0])*0.55,ins[1]+(mid[1]-ins[1])*0.55];
      X.save(); X.globalAlpha*=Math.min(1,k4*1.4);
      tendon(m,[m[0]*0.5+mm[0]*0.5,m[1]*0.5+mm[1]*0.5],a7add(mm,A7.d,-30*sp),A7INK,tw+6); tendon(m,[m[0]*0.5+mm[0]*0.5,m[1]*0.5+mm[1]*0.5],a7add(mm,A7.d,-30*sp),'#F1D9F7',tw);
      tendon(ins,[ins[0]*0.5+dd[0]*0.5,ins[1]*0.5+dd[1]*0.5],dd,A7INK,tw+6); tendon(ins,[ins[0]*0.5+dd[0]*0.5,ins[1]*0.5+dd[1]*0.5],dd,'#F1D9F7',tw);
      X.strokeStyle=A7LIL; X.lineWidth=2.5; X.lineCap='round';
      for(const [p,dir] of [[a7add(mm,A7.d,-30*sp),A7.d],[dd,[-fd[0],-fd[1]]]]) for(let i=-2;i<=2;i++){ const q=a7add(a7add(p,dir,14+6*Math.abs(i)),A7.nUp,i*6); X.beginPath(); X.moveTo(...p); X.lineTo(...q); X.stroke(); }
      X.restore(); }
    return {E,H,fd,fn,ins,m,mid}; } }
/* the view: centre, zoom (the camera pushes in on the elbow) */
function a7View(t,cx,cy,z,shake){ const sx=(shake||0)*Math.sin(t*97), sy=(shake||0)*Math.cos(t*83); X.translate(540+sx,960+sy); X.scale(z,z); X.translate(-cx,-cy); }
function a7Bg(){ X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const g=X.createRadialGradient(560,960,40,560,960,1000); g.addColorStop(0,'rgba(118,2,138,0.52)'); g.addColorStop(0.6,'rgba(75,1,88,0.16)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }

/* ── the hook (series rule: the footage stops before the injury; the tear itself is only drawn) ──
   T_HCUT: a quick card flip from the last footage frame into the drawing (EP05 option A) · the forearm lowers the last
   degrees, the tendon glows and trembles · the snap lands on «Curl» · one lilac flash, the frame shakes, shock rings,
   the muscle bunches up toward the shoulder, the weight drops · the camera has pushed in on the elbow. */
const HK7={snap:3.36};   /* on «Curl» */
function hk7State(t){ const c=T_HCUT, u=A7E(A7P(t,c+0.1,HK7.snap)), af=t-HK7.snap;
  const phi=af<0? (1.60-1.52*u) : (0.08-0.30*A7E(A7P(af,0,0.35)));
  return {phi, k:1, stretch:af<0?0.3+0.7*u:0, tremble:af<0?u:0, hot:true, glow:af<0?u:0.3,
          tear:af>=0?af:-1, recoil:af>=0?Math.min(1.12,A7E(A7P(af,0,0.30))*1.12-0.12*A7E(A7P(af,0.30,0.55))):0, drop:af>=0?A7P(af,0.05,0.5):0}; }
function hookMG(t){ const c=T_HCUT, END=T_P1+0.13; if(t<c||t>=END) return; const out=1-A7P(t,T_P1-0.02,END);
  const f1=A7P(t,c,c+0.1), f2=A7P(t,c+0.1,c+0.2); X.save(); X.globalAlpha=out;
  if(f1<1){ X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const s=Math.cos(f1*Math.PI/2); X.save(); X.translate(540,960); X.scale(Math.max(0.001,s),1+0.06*(1-s)); X.translate(-540,-960);
    if(VF.naturalWidth) X.drawImage(VF,0,0,W,H); X.fillStyle=`rgba(118,2,138,${0.5*(1-s)})`; X.fillRect(0,0,W,H); X.restore(); X.fillStyle=`rgba(199,125,219,${0.9*(1-s)})`; X.fillRect(534,0,12,H); X.restore(); return; }
  const s=Math.sin(f2*Math.PI/2), st=hk7State(t), af=t-HK7.snap;
  X.save(); X.translate(540,960); X.scale(Math.max(0.001,s),1+0.06*(1-s)); X.translate(-540,-960);
  a7Bg();
  const pu=A7E(A7P(t,c+0.45,HK7.snap+0.15)), z=0.76+0.84*pu, cx=560+(A7.E[0]+30-560)*pu, cy=990+(A7.E[1]-20-990)*pu;
  const shake=af>=0?Math.exp(-af/0.16)*22:0;
  X.save(); X.translate(1080,0); X.scale(-1,1); a7View(t,cx,cy,z,shake); const g=a7Arm(t,st);   /* mirrored: the forearm reaches left, clear of the right column */
  if(af>=0&&g&&g.mid){ for(const [d,kk] of [[0,1],[0.07,0.7],[0.16,0.45]]){ const a2=A7P(af,d,d+0.6); if(a2<=0||a2>=1) continue; X.save(); X.globalAlpha*=(1-a2)*kk; X.strokeStyle=A7LIL; X.lineWidth=(6*(1-a2)+1)/z;
        X.beginPath(); X.arc(g.mid[0],g.mid[1],30+260*A7E(a2),0,7); X.stroke(); X.restore(); }
      if(af<1.0){ for(let i=0;i<26;i++){ const a=i*2.39, sp=180+((i*73)%140), tt=af*0.6, x=g.mid[0]+Math.cos(a)*sp*tt, y=g.mid[1]+Math.sin(a)*sp*tt+500*tt*tt; X.save(); X.globalAlpha*=Math.max(0,1-af/0.9); X.fillStyle=i%2?'#FFFFFF':A7LIL; X.beginPath(); X.arc(x,y,(2+(i%3))/z*1.4,0,7); X.fill(); X.restore(); } } }
  X.restore();
  { const g2=X.createLinearGradient(0,1430,0,1600); g2.addColorStop(0,'rgba(10,10,12,0)'); g2.addColorStop(1,'rgba(10,10,12,1)'); X.fillStyle=g2; X.fillRect(0,1430,W,H-1430); }
  X.restore();
  if(f2<1){ X.fillStyle=`rgba(199,125,219,${0.8*(1-s)})`; X.fillRect(534,0,12,H); }
  if(af>=0&&af<0.16){ X.save(); X.globalAlpha=0.55*(1-af/0.16); X.fillStyle='#E9C9F2'; X.fillRect(0,0,W,H); X.restore(); }
  X.restore(); }
SCENE_LIST.push(['hookMG',hookMG]);
