/* ═══ EP05 v5 — hook options (client, 16 Nov: Instagram cut the reel to 18+ «لأنه الإصابة كتير قوية»; «اعمل سلو موشن أول ما
   البار يقع عليه، واعمل كويك فليب فوراً على الموشن جرافيك… موشن جرافيك قوي، يبيّن عضلات الصدر وهي عم تتكسّر»).
   The footage never shows the bar touching him: it stops at HOOK.cut while the bar is still falling.
   A  the slip in slow motion → a quick flip (the frame turns like a card) into the chest, the bar slams onto the pectorals
   B  the frame freezes, turns into an ink tracing, the bench press is drawn, the bar falls, then the same impact close up
   C  no footage: the bench press drawn from the start, the bar trembles, slips, falls, then the impact close up
   The chest close-up: the torso from the front in the series' ink, both pectorals in purple with their fibres (from the
   sternum and the clavicle to the arm); the bar falls into frame and slams across the lower chest: a flash, the frame
   shakes, the chest gives and rebounds, shock rings, and the fibres under the bar crack and split, in slow motion.
   An illustration of the danger, not this lifter's diagnosis (fact-check). */
const hkE=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
const hkP=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
/* ── the chest, front view ── */
const HK_IMP=1010, HK_BR=36;
const hkO=[[300,628],[420,606],[520,600],[522,700],[524,800],[524,900],[526,1000],[522,1052]], hkI=[205,812];
function hkOat(s){ const P=hkO, L=[0]; for(let i=1;i<P.length;i++) L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const d=s*L[L.length-1]; let i=1; while(i<L.length-1&&L[i]<d) i++; const u=(d-L[i-1])/(L[i]-L[i-1]); return [P[i-1][0]+(P[i][0]-P[i-1][0])*u,P[i-1][1]+(P[i][1]-P[i-1][1])*u]; }
const HK_FIB=[]; for(let k=0;k<=16;k++){ const s=k/16, o=hkOat(s), c=[(o[0]+hkI[0])/2-18+30*s,(o[1]+hkI[1])/2+28*s+10]; HK_FIB.push({o,c,s}); }
const hkQ=(f,u)=>{ const a=(1-u)*(1-u), b=2*(1-u)*u, c=u*u; return [a*f.o[0]+b*f.c[0]+c*hkI[0], a*f.o[1]+b*f.c[1]+c*hkI[1]]; };
const HK_PEC=(()=>{ const p=hkO.slice(); for(const q of [[470,1066],[380,1062],[300,1012],[248,950],[214,880],hkI,[222,742],[262,668]]) p.push(q); return p; })();
const HK_CR=HK_FIB.filter(f=>f.o[1]>860).map((f,i)=>{ const pts=[]; for(let j=0;j<=22;j++){ const u=j/22*0.86, q=hkQ(f,u), q2=hkQ(f,Math.min(1,u+0.01)), nx=-(q2[1]-q[1]), ny=q2[0]-q[0], nl=Math.hypot(nx,ny)||1, z=(j%2?1:-1)*(3+5*Math.sin(j*1.7+i));
  pts.push([q[0]+nx/nl*z,q[1]+ny/nl*z]); } return pts; });
const HK_PART=(()=>{ const r=[]; let s=7; const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; }; for(let i=0;i<46;i++) r.push({x:300+rnd()*480,vx:(rnd()-0.5)*900,vy:-250-rnd()*700,r:2+rnd()*4,l:rnd()}); return r; })();
function hkMir(pts){ return pts.map(p=>[1080-p[0],p[1]]); }
function hkPath(pts,close){ const P=new Path2D(); pts.forEach((q,i)=>i?P.lineTo(q[0],q[1]):P.moveTo(q[0],q[1])); if(close) P.closePath(); return P; }
const HK_TORSO=(()=>{ const L=[[452,250],[446,560],[330,598],[190,636],[118,694],[82,800],[58,1100],[40,1920]]; return L.concat(hkMir(L).reverse()); })();
function hkChest(t,tF,tI){ /* tF: the bar enters the frame · tI: it lands */
  const u=hkP(t,tF,tI), by=-120+(HK_IMP+120)*u*u, after=t-tI, hit=after>=0;
  const bump=hit?Math.exp(-after/0.12)*Math.sin(Math.min(after,0.5)*30)*0.5+Math.exp(-after/0.09):0, sq=1-0.07*Math.max(0,Math.min(1,bump));
  const shake=hit?Math.exp(-after/0.16)*20:0, sx=shake*Math.sin(t*97), sy=shake*Math.cos(t*83);
  const zoom=1+0.10*hkE(hkP(t,tF,tI+1.6));
  X.save(); X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  { const g=X.createRadialGradient(540,900,40,540,900,1000); g.addColorStop(0,'rgba(118,2,138,0.55)'); g.addColorStop(0.6,'rgba(75,1,88,0.18)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  X.translate(540+sx,HK_IMP+sy); X.scale(0.8*zoom,0.8*zoom*sq); X.translate(-540,-HK_IMP);   /* 0.8: the arms stay clear of Instagram's right column */
  /* torso: neck, the trapezius' curve, round deltoids, the arms, the waist — one silhouette */
  { const P_=new Path2D(); for(const sd of [1,-1]){ const m=(x,y)=>[sd>0?x:1080-x,y];
      let a=m(462,470),b=m(452,540); P_.moveTo(...a); P_.lineTo(...b); let c=m(380,560),d=m(300,592); P_.quadraticCurveTo(...c,...d); c=m(232,612); d=m(196,640); P_.quadraticCurveTo(...c,...d);
      c=m(214,1100); d=m(300,1920); P_.lineTo(...m(232,880)); P_.quadraticCurveTo(...c,...d); P_.lineTo(...m(540,1920)); P_.lineTo(...m(540,330)); P_.closePath();
      k5cap(P_,m(176,742),104,m(150,1240),62); }                                  // deltoid and upper arm, out to the side
    X.save(); X.lineJoin='round'; X.strokeStyle=K5INK; X.lineWidth=8; X.stroke(P_); X.fillStyle=K5FILL; X.fill(P_); X.restore(); }
  X.strokeStyle='rgba(236,230,242,0.42)'; X.lineWidth=3;
  for(const side of [1,-1]){ const m=p=>side>0?p:[1080-p[0],p[1]];
    X.beginPath(); let p=m([300,622]); X.moveTo(p[0],p[1]); p=m([196,676]); let q=m([168,846]); X.quadraticCurveTo(p[0],p[1],q[0],q[1]); X.stroke();       // deltoid's front edge
    X.beginPath(); p=m([540,575]); X.moveTo(p[0],p[1]); p=m([420,572]); q=m([270,612]); X.quadraticCurveTo(p[0],p[1],q[0],q[1]); X.stroke(); }             // clavicle
  X.save(); X.strokeStyle='rgba(236,230,242,0.26)'; for(const y of [1110,1205,1300]) for(const x of [452,552]){ X.beginPath(); rr(x,y,76,80,22); X.stroke(); } X.restore();
  /* the pectorals, purple, with their fibres */
  for(const side of [1,-1]){ const mp=pts=>side>0?pts:hkMir(pts); const P_=hkPath(mp(HK_PEC),true);
    const glow=hit?0.35*Math.exp(-after/0.5):0; X.fillStyle=`rgba(118,2,138,${0.62+glow})`; X.fill(P_); X.strokeStyle=LIL; X.lineWidth=4; X.stroke(P_);
    X.save(); X.clip(P_); X.strokeStyle='rgba(199,125,219,0.55)'; X.lineWidth=3;
    for(const f of HK_FIB){ const o=side>0?f.o:[1080-f.o[0],f.o[1]], c=side>0?f.c:[1080-f.c[0],f.c[1]], e=side>0?hkI:[1080-hkI[0],hkI[1]];
      X.beginPath(); X.moveTo(o[0],o[1]); X.quadraticCurveTo(c[0],c[1],e[0],e[1]); X.stroke(); } X.restore();
    /* the fibres under the bar crack and split (slow motion after the hit) */
    if(hit){ HK_CR.forEach((cr,i)=>{ const pr_=hkE(hkP(after,0.02+i*0.06,0.9+i*0.12)); if(pr_<=0) return; const pts=mp(cr), n=Math.max(2,Math.round(pts.length*pr_)), seg=pts.slice(0,n);
        X.save(); X.lineCap='round'; X.lineJoin='round'; X.strokeStyle='#0A0A0C'; X.lineWidth=9; X.stroke(hkPath(seg));
        X.strokeStyle=`rgba(199,125,219,${0.55*Math.exp(-after/1.4)+0.25})`; X.lineWidth=12; X.globalCompositeOperation='lighter'; X.stroke(hkPath(seg)); X.globalCompositeOperation='source-over';
        X.strokeStyle='#FFFFFF'; X.lineWidth=3; X.stroke(hkPath(seg)); X.restore(); }); }
  }
  X.strokeStyle='rgba(236,230,242,0.5)'; X.lineWidth=3; X.beginPath(); X.moveTo(540,590); X.lineTo(540,1060); X.stroke();   // sternum
  { const g=X.createLinearGradient(0,440,0,540); g.addColorStop(0,'rgba(10,10,12,1)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,380,1080,162); }
  /* shock rings from the bar */
  if(hit){ for(const [d,k] of [[0,1],[0.08,0.7],[0.18,0.45]]){ const a2=hkP(after,d,d+0.7); if(a2<=0||a2>=1) continue; X.save(); X.globalAlpha*=(1-a2)*k; X.strokeStyle=LIL; X.lineWidth=6*(1-a2)+1;
      X.beginPath(); X.ellipse(540,HK_IMP,60+700*hkE(a2),12+150*hkE(a2),0,0,7); X.stroke(); X.restore(); } }
  /* the bar */
  if(by>-90){ X.save(); const g=X.createLinearGradient(0,by-HK_BR,0,by+HK_BR); g.addColorStop(0,'#55505c'); g.addColorStop(0.3,'#d7dae0'); g.addColorStop(0.55,'#8d9098'); g.addColorStop(1,'#2e2934'); X.fillStyle=g; X.fillRect(-60,by-HK_BR,1200,2*HK_BR);
    X.strokeStyle=K5INK; X.lineWidth=4; X.beginPath(); X.moveTo(-60,by-HK_BR); X.lineTo(1140,by-HK_BR); X.moveTo(-60,by+HK_BR); X.lineTo(1140,by+HK_BR); X.stroke();
    X.strokeStyle='rgba(199,125,219,0.45)'; X.lineWidth=2; for(let x=-60;x<1140;x+=15){ X.beginPath(); X.moveTo(x,by-HK_BR+6); X.lineTo(x+13,by+HK_BR-6); X.stroke(); }
    if(!hit&&u>0.1){ X.strokeStyle='rgba(236,230,242,0.35)'; X.lineWidth=3; for(const x of [180,420,660,900]){ X.beginPath(); X.moveTo(x,by-HK_BR-20); X.lineTo(x,by-HK_BR-20-220*u); X.stroke(); } }
    X.restore(); }
  /* debris */
  if(hit&&after<1.4){ HK_PART.forEach(p=>{ const tt=after*0.55, x=p.x+p.vx*tt, y=HK_IMP-10+p.vy*tt+900*tt*tt; const a3=Math.max(0,1-after/1.2); X.save(); X.globalAlpha*=a3; X.fillStyle=p.l>0.5?'#FFFFFF':LIL; X.beginPath(); X.arc(x,y,p.r,0,7); X.fill(); X.restore(); }); }
  X.restore();
  { const g=X.createLinearGradient(0,1430,0,1600); g.addColorStop(0,'rgba(10,10,12,0)'); g.addColorStop(1,'rgba(10,10,12,1)'); X.fillStyle=g; X.fillRect(0,1430,W,H-1430); }   /* the torso fades out above Instagram's bottom zone */
  /* the flash on the hit */
  if(hit&&after<0.16){ X.save(); X.globalAlpha=0.55*(1-after/0.16); X.fillStyle='#E9C9F2'; X.fillRect(0,0,W,H); X.restore(); } }
/* ── the bench press, side view (the spotter scene's figure, enlarged; no spotter) ── */
function hkBench(t,st){ /* st: {bar:[x,y], hand:[x,y], k:draw-in, hot} */
  X.save(); X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  { const g=X.createRadialGradient(540,880,40,540,880,950); g.addColorStop(0,'rgba(118,2,138,0.5)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const sh=st.shake||0; X.translate(540+sh*Math.sin(t*91),860+sh*Math.cos(t*77)); X.scale(1.55,1.55); X.translate(-540,-990);
  const SH=[380,1006], HP=[642,1024], kk=a=>Math.max(0,Math.min(1,(st.k-a)/0.35));
  k5line([[160,1236],[920,1236]],kk(0),3,'rgba(236,230,242,0.35)');
  k5body([polyP([[262,1060],[722,1060],[722,1092],[262,1092]]),capP([300,1092],9,[300,1234],9),capP([690,1092],9,[690,1234],9)],kk(0),false);
  k5body([polyP([[350,1058],[350,990],[372,968],[436,952],[520,962],[600,984],[668,1000],[676,1058]]),capP([330,1018],13,[362,1010],15),circP([302,1020],34),
          capP(HP,34,[818,1004],25),capP([818,1004],24,[836,1206],16),capP([836,1210],13,[898,1224],11)],kk(0.15),false);
  const d=Math.hypot(st.hand[0]-SH[0],st.hand[1]-SH[1]), l1=124*(0.65+0.35*Math.min(1,(d-80)/158));
  const arm=k5two(SH,st.hand,l1,118,LOWER); k5body([capP(SH,20,arm.E,16),capP(arm.E,16,arm.H,12),circP(arm.H,16)],kk(0.3),st.hot);
  const kb=kk(0.4); if(kb>0){ const b=st.bar; X.save(); X.globalAlpha*=kb; X.fillStyle='rgba(36,28,43,0.6)'; X.beginPath(); X.arc(b[0],b[1],82,0,7); X.fill(); X.strokeStyle=K5INK; X.lineWidth=5; X.stroke();
    X.strokeStyle='rgba(199,125,219,0.8)'; X.lineWidth=3; X.beginPath(); X.arc(b[0],b[1],62,0,7); X.stroke(); X.fillStyle='#cfd3d9'; X.beginPath(); X.arc(b[0],b[1],14,0,7); X.fill(); X.strokeStyle=K5INK; X.lineWidth=3; X.stroke();
    if(st.fall>0.05&&st.fall<1){ X.strokeStyle='rgba(236,230,242,0.4)'; X.lineWidth=3; for(const dx of [-50,0,50]){ X.beginPath(); X.moveTo(b[0]+dx,b[1]-95); X.lineTo(b[0]+dx,b[1]-95-120*st.fall); X.stroke(); } }
    X.restore(); }
  X.restore();
  if(st.flash>0){ X.save(); X.globalAlpha=st.flash; X.fillStyle='#F3E6F7'; X.fillRect(0,0,W,H); X.restore(); } }
function hkBenchState(t,tWob,tSlip,tHit){ const LOCK=[392,769], CHEST=[446,944];
  const wob=hkP(t,tWob,tSlip), fall=0.86*hkE(hkP(t,tSlip,tHit))**1.6, after=t-tHit;
  const tremble=wob*wob*7*Math.sin(t*41)*(t<tSlip?1:0);
  const bar=[LOCK[0]+(CHEST[0]-LOCK[0])*fall+tremble*0.4, LOCK[1]+(CHEST[1]-LOCK[1])*fall+tremble];
  const lag=Math.max(0,(fall-0.3)/0.7), hand=[LOCK[0]+(CHEST[0]-30-LOCK[0])*lag, LOCK[1]+(CHEST[1]-LOCK[1]-40)*lag+(t<tSlip?tremble:0)];
  return {bar,hand,fall,shake:0,flash:0,hot:t>=tSlip}; }    /* the side view cuts away before the bar reaches him: one impact only, on the close-up */
/* ── the option's timeline ── */
const HKT=(()=>{ const c=HOOK.cut; return {A:{flip:c,chF:c+0.1,chI:c+0.42},B:{frz:c,tr:c+0.22,bF:c+0.5,bH:c+0.86,chF:c+0.83,chI:c+1.06},C:{wob:0.5,slip:1.5,hit:1.95,chF:1.92,chI:2.16}}[HOOK.opt]; })();
const HK_END=T_P2+0.13, hkOut=t=>1-hkP(t,T_P2-0.07,HK_END);
function hookMG(t){ if(t>=HK_END) return; const o=HOOK.opt, T=HKT; X.save(); X.globalAlpha=hkOut(t);
  if(o==='A'){ if(t<T.flip){ X.restore(); return; }
    const f1=hkP(t,T.flip,T.flip+0.1), f2=hkP(t,T.flip+0.1,T.flip+0.2);
    if(f1<1){ X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const s=Math.cos(f1*Math.PI/2); X.save(); X.translate(540,960); X.scale(Math.max(0.001,s),1+0.06*(1-s)); X.translate(-540,-960);
      if(VF.naturalWidth) X.drawImage(VF,0,0,W,H); X.fillStyle=`rgba(118,2,138,${0.5*(1-s)})`; X.fillRect(0,0,W,H); X.restore();
      X.fillStyle=`rgba(199,125,219,${0.9*(1-s)})`; X.fillRect(540-6,0,12,H); }
    else { const s=Math.sin(f2*Math.PI/2); X.save(); X.translate(540,960); X.scale(Math.max(0.001,s),1+0.06*(1-s)); X.translate(-540,-960); hkChest(t,T.chF,T.chI); X.restore();
      if(f2<1){ X.fillStyle=`rgba(199,125,219,${0.8*(1-s)})`; X.fillRect(540-6,0,12,H); } } }
  else if(o==='B'){ if(t<T.frz){ X.restore(); return; }
    if(t<T.bF+0.02){ X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const d=hkP(t,T.frz,T.tr), e=hkP(t,T.tr-0.05,T.bF);
      if(VF.naturalWidth&&e<1){ X.save(); X.globalAlpha*=(1-e); X.filter=`grayscale(${d}) brightness(${1-0.6*d}) contrast(${1+0.3*d})`; X.drawImage(VF,0,0,W,H); X.filter='none'; X.restore(); }
      if(HK_TR.naturalWidth){ X.save(); X.globalAlpha*=hkP(t,T.frz+0.05,T.tr)*(1-hkP(t,T.bF-0.1,T.bF)); X.drawImage(HK_TR,0,0,W,H); X.restore(); }
      if(t>T.bF-0.12){ X.save(); X.globalAlpha*=hkP(t,T.bF-0.12,T.bF); hkBench(t,{...hkBenchState(t,T.bF-1,T.bF,T.bH),k:1}); X.restore(); } }
    else if(t<T.chF){ hkBench(t,{...hkBenchState(t,T.bF-1,T.bF,T.bH),k:1}); }
    else hkChest(t,T.chF,T.chI); }
  else { if(t<T.chF){ hkBench(t,{...hkBenchState(t,T.wob,T.slip,T.hit),k:hkP(t,0.02,0.75)}); } else hkChest(t,T.chF,T.chI); }
  X.restore(); }
const HK_TR=nkUse('hk_trace.png');
SCENE_LIST.push(['hookMG',hookMG]);
