const T_P2=3.5, T_P3=8.767, T_P4=17.667, T_P5=19.1, T_P6=23.7, T_P7=28.233, T_P8=32.167, T_CA_IN=6.33, T_CA_OUT=12.947;
const WS={"H": [0.203, 0.564, 1.126, 1.426, 1.808, 1.928, 2.249], "P2": [3.724, 3.945, 4.346, 4.647, 5.148, 5.469, 5.79, 6.452, 6.672, 6.813, 7.053, 7.254, 7.575, 7.916, 8.397], "P3": [8.92, 9.081, 9.782, 10.062, 10.383, 10.823, 11.104, 11.484, 12.125, 12.265, 12.566, 13.487, 13.768, 13.988, 14.188, 14.549, 15.01, 15.791, 16.071, 16.532, 16.772, 17.033], "P4": [17.765, 17.966, 18.127, 18.389], "P5": [19.215, 19.576, 19.736, 20.499, 20.78, 21.101, 21.402, 22.104, 22.506, 22.606, 22.867, 23.148], "P6": [23.852, 24.253, 24.713, 25.114, 25.775, 26.156, 26.516, 26.937, 27.417, 27.678], "P7": [28.353, 28.518, 29.059, 29.481, 29.742, 30.103, 30.223, 30.504, 31.006, 31.147, 31.367], "P8": [32.309, 32.609, 32.769, 33.551, 34.392, 34.553, 34.633, 34.893, 35.093]}, WE={"H": [0.504, 0.885, 1.366, 1.747, 1.868, 2.149, 2.55], "P2": [3.905, 4.266, 4.566, 5.088, 5.409, 5.75, 6.251, 6.592, 6.752, 6.993, 7.174, 7.474, 7.856, 8.317, 8.598], "P3": [9.04, 9.461, 9.982, 10.322, 10.723, 11.044, 11.424, 11.765, 12.205, 12.466, 12.906, 13.688, 13.928, 14.048, 14.469, 14.93, 15.35, 15.971, 16.432, 16.712, 16.973, 17.393], "P4": [17.886, 18.087, 18.329, 18.631], "P5": [19.516, 19.676, 20.158, 20.74, 21.061, 21.322, 21.803, 22.445, 22.566, 22.827, 23.108, 23.529], "P6": [24.172, 24.653, 25.034, 25.374, 26.095, 26.436, 26.857, 27.297, 27.638, 28.018], "P7": [28.457, 28.779, 29.401, 29.682, 29.983, 30.143, 30.444, 30.705, 31.107, 31.327, 32.01], "P8": [32.569, 32.689, 33.11, 34.012, 34.532, 34.593, 34.853, 34.993, 35.354]};
/* ═══ NITRON — INJURY BREAKDOWN · EP 03 «Quadriceps Tendon Rupture» ═══
   Client, 11 Nov: one goal (saves and shares), the hook first, the house edit, text placed so it never scatters the eye,
   Ahmad bigger and inside the frame, the sources orbiting him, few soft transitions, sound held back, the leg-press clip
   as the hook with every caption on it removed, and the knee sleeve's photo when he names it.
   H    leg-press footage as a cinema band, his «تمرين واحد… وممكن يبعدك عن الجيم أشهر» in the band above it
   P2   Ahmad in the gym: the injury's name on liquid glass → we leave him: the knee is drawn in ink, the tendon tears
   P3   still on the canvas: the simple treatment (immobiliser + physio) → back to Ahmad, the sources orbit him
   P4   his question, close to the lens, the words above his head
   P5   canvas: the three ways to protect yourself, each on its word (no caption: the rows are his words)
   P6   Ahmad + the knee sleeve's photo on glass when he says «مشدّ الركبة»
   P7   canvas: the sleeve, what it is and what it is not
   P8   Ahmad: his last line on glass → end card.
   One thing to read at a time. The T_*, WS and WE constants above this line come from gen.py. */
const PURPLE='#76028A', LIL='#C77DDB';
SCENES=[{s:0,e:T_CA_IN,m:R_FULL,nocap:true},{s:T_CA_IN,e:T_P4,m:R_FULL},{s:T_P4,e:T_P6,m:R_FULL,nocap:true},{s:T_P6,e:T_P8,m:R_FULL},{s:T_P8,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'03',name:'Quadriceps Tendon Rupture',ar:'تمزّق وتر العضلة الرباعية'};
const PROD=nkUse('product.png');
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));
/* the three canvases dissolve in over Ahmad and leave AFTER the cut to the next take, so a take change is never seen */
const CA=t=>ease(pr(t,T_CA_IN,T_CA_IN+0.45))*(1-ease(pr(t,T_CA_OUT,T_CA_OUT+0.45)));
const CB=t=>ease(pr(t,T_P5-0.45,T_P5))*(1-ease(pr(t,T_P6,T_P6+0.45)));
const CC=t=>ease(pr(t,T_P7-0.45,T_P7))*(1-ease(pr(t,T_P8,T_P8+0.45)));
const CAN_IN=t=>Math.max(CA(t),CB(t),CC(t));
/* one RTL line in several colours, each word landing on its own time */
function rtlLine(parts,cx,y,size,ks){ X.save(); X.font='900 '+size+'px '+FONT; X.textBaseline='middle'; X.direction='rtl'; X.textAlign='right';
  const sp=size*0.26, ws=parts.map(p=>X.measureText(p[0]).width), tot=ws.reduce((a,b)=>a+b,0)+sp*(parts.length-1); let x=cx+tot/2;
  parts.forEach((p,i)=>{ const k=ks?ks[i]:1; if(k>0){ X.save(); X.globalAlpha*=k; X.fillStyle=p[1]; X.fillText(p[0],x,y+(1-k)*16); X.restore(); } x-=ws[i]+sp; }); X.restore(); return tot; }
/* a glass row: ✓ or ✕ on the right, the words to its left */
function glassRow(cx,cy,text,k,ok,fs,mk){ if(k<=0) return; fs=fs||44; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.5, x=cx-w/2, y=cy-h/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*20); glassPane(x,y,w,h,h/2,{}); nkMarkDot(x+w-h/2,cy,h/2-13,ok,mk===undefined?pr(k,0.3,1):mk); nkTxt(text,x+w-h-4,cy+3,fs,'#FFFFFF','right'); X.restore(); }

/* 1) the hook: tag and credit under the band, his words in the band above it (never on the picture) */
function hookTag(t){ if(t>T_P2) return; const k=ik(t,0.15,0.3)*(1-pr(t,T_P2-0.35,T_P2-0.1)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.fillStyle='rgba(255,255,255,0.94)'; rr(48,1420,300,58,29); X.fill(); X.fillStyle=PURPLE; X.beginPath(); X.arc(82,1449,8,0,7); X.fill();
  injLatin('REAL FOOTAGE',212,1450,24,PURPLE,'center',800,3); injLatin('Video: Ranieri Lopes · via O Tempo',930,1450,22,'rgba(255,255,255,0.55)','right',600); X.restore(); }
function hookWords(t){ if(t>T_P2) return; const out=1-pr(t,T_P2-0.4,T_P2-0.15); if(out<=0) return;
  const kA=ik(t,WS.H[0]-0.1,0.25), kB=ik(t,WS.H[2]-0.12,0.25);
  /* one thing to read at a time: «تمرين واحد…» alone, then it gives way to the second line, each word on his voice */
  if(kA>0&&kB<1){ X.save(); X.globalAlpha=kA*out*(1-kB); nkTxt('تمرين واحد…',540,300+(1-kA)*20-30*kB,132,'#FFFFFF','center'); X.restore(); }
  if(kB>0){ const ks=[ik(t,WS.H[2]-0.06,0.2),ik(t,WS.H[3]-0.06,0.2),ik(t,WS.H[4]-0.06,0.2)], k4=ik(t,WS.H[6]-0.06,0.22);
    X.save(); X.globalAlpha=out; rtlLine([['ممكن','#FFFFFF'],['يبعدك','#FFFFFF'],['عن الجيم','#FFFFFF']],540,210,78,ks);
    if(k4>0){ X.globalAlpha=out*k4; nkTxt('أشهر',540,352+(1-k4)*18,122,LIL,'center'); X.globalAlpha=out; X.fillStyle=PURPLE; rr(540-120*k4,428,240*k4,10,5); X.fill(); } X.restore(); } }

/* 2) Ahmad's layer: what passes BEHIND him is drawn here, then he is drawn over it */
const ORB={cx:540,cy:1075,rx:300,ry:90,w:2*Math.PI/5.5,lift:[-70,5,80]};   /* one turn in 5.5 s · each source rides its own ring, so they never touch · rx keeps a chip inside the frame */
function orbitDraw(t,items,front,s0,e0){ if(t<s0||t>=e0) return; const out=1-pr(t,e0-0.3,e0);
  items.forEach((it,ix)=>{ it.dy=ORB.lift[ix%3]; const k=ik(t,it.at-0.06,0.32); if(k<=0) return; const th=Math.PI/2-0.55+ORB.w*(t-it.at), d=Math.sin(th);
    if((d>=0)!==front) return; const x=ORB.cx+ORB.rx*Math.cos(th), y=ORB.cy+ORB.ry*d+(it.dy||0), sc=0.74+0.30*(d+1)/2;
    X.save(); X.globalAlpha=out*(front?1:0.62); X.translate(x,y); X.scale(sc,sc); X.translate(-x,-y);
    const fs=it.size||30; X.font='800 '+fs+'px Inter, '+FONT; const w=X.measureText(it.text).width+fs*1.9, h=fs*2.1;
    X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(x,y+(1-ease(k))*18); glassPane(-w/2,-h/2,w,h,h/2,{}); X.fillStyle=LIL; X.beginPath(); X.arc(-w/2+fs*0.75,0,6,0,7); X.fill(); injLatin(it.text,fs*0.3,2,fs,'#FFFFFF','center',800); X.restore();
    X.restore(); }); }
const SRC_S=T_CA_OUT+0.3, SRC_E=T_P4-0.28;      /* the sources circle him while he gives the treatment; gone before the push-in to his question */
const STUDIES=()=>[{text:'AAOS · OrthoInfo',at:SRC_S,size:35},{text:'Cleveland Clinic',at:SRC_S+0.9,size:35},{text:'Quadriceps Tendon Tear',at:SRC_S+1.8,size:30}];
const ON_CAM=t=>(t>=T_P2&&t<T_CA_IN+0.5)||(t>=T_CA_OUT&&t<T_P5)||(t>=T_P6&&t<T_P7)||(t>=T_P8&&t<VEND);
function ahmadBack(t){ if(!ON_CAM(t)) return;
  /* P4: his question above his head (he is close to the lens and low in the frame: the top of the frame is free) */
  if(t>=T_P4&&t<T_P5){ const out=1-pr(t,T_P5-0.32,T_P5-0.08),   /* gone before the canvas title takes the same place */ k1=ik(t,WS.P4[1]-0.06,0.22), k2=ik(t,WS.P4[2]-0.06,0.22), k3=ik(t,WS.P4[3]-0.06,0.25);
    { const g=X.createLinearGradient(0,0,0,560); g.addColorStop(0,`rgba(10,10,12,${0.72*out*k1})`); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,560); }   /* the wall behind the words is lit purple: darken it so the lilac line reads */
    X.save(); X.globalAlpha=out; X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=30; rtlLine([['كيف','#FFFFFF'],['بحمي','#FFFFFF']],560,262,150,[k1,k2]);
    if(k3>0){ X.globalAlpha=out*k3; nkTxt('حالي؟',560,424+(1-k3)*18,170,LIL,'center'); } X.restore(); }
  orbitDraw(t,STUDIES(),false,SRC_S,SRC_E);
  /* he is redrawn over whatever passed behind him, except inside the two dissolves baked into the frames (footage → him, P3 → P4) */
  const inDis=t<T_P2+0.22||(t>T_P4-0.29&&t<T_P4+0.12);   /* the push-in and its dissolve are in the frames (camera.py, bake.py) */
  if(PRS_OK&&!inDis) X.drawImage(PRS,0,0,W,H); }
function ahmadFront(t){ orbitDraw(t,STUDIES(),true,SRC_S,SRC_E); }

/* 3) P2: the injury's name on liquid glass. The diagnosis is the one the press reported for this athlete */
function titleCard(t){ if(t<T_P2||t>T_CA_IN+0.4) return; const k=ik(t,WS.P2[1]-0.12,0.4), out=1-pr(t,T_CA_IN-0.35,T_CA_IN-0.05); if(k<=0||out<=0) return;   /* gone before the first caption of the canvas (6.35 s): no text over text */
  const x=100,y=1150+(1-k)*60,w=830,h=330; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{});   /* x ≤ 930 and y ≤ 1480: clear of Instagram's buttons and caption belt */
  X.fillStyle=PURPLE; rr(x+w-20,y+38,8,h-76,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-54,y+62,24,LIL,'right',800,3);
  injLatin(INJ_EP.name,x+w-52,y+134,47,'#FFFFFF','right',900);
  nkTxt(INJ_EP.ar,x+w-52,y+216,56,LIL,'right');
  X.globalAlpha=k*out*0.78; nkTxt('بحسب التقارير الصحفية عن الحادثة',x+w-52,y+284,30,'#FFFFFF','right',1,700); X.restore(); }

/* 4) the dark medical canvas */
function medBg(t){ const a=CAN_IN(t); if(a<=0) return; X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,950,40,560,950,900); g.addColorStop(0,'rgba(118,2,138,0.55)'); g.addColorStop(0.55,'rgba(75,1,88,0.18)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  X.restore(); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al){ const k1=ik(t,at,0.25), k2=ik(t,at+0.18,0.3); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2; const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }

/* 5) the knee, side view, as he sits on the leg press: bones, the quadriceps and its tendon over the kneecap, drawn in ink.
      q = 0 the knee bent under the load · q = 1 the leg straight in a knee immobiliser (the simple treatment) */
const LEG={H:[250,1060],L1:447,L2:366};
const al2=(p,u,d,n,e)=>[p[0]+u[0]*d+(n?n[0]*e:0),p[1]+u[1]*d+(n?n[1]*e:0)];
function seg(a,b,k,lw,col){ if(k<=0) return; X.strokeStyle=col; X.lineWidth=lw; X.lineCap='round'; X.beginPath(); X.moveTo(a[0],a[1]); X.lineTo(a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k+0.01); X.stroke(); }
function legPose(q){ const a1=(-60+50*q)*Math.PI/180, a2=(48-58*q)*Math.PI/180, H=LEG.H;
  const uf=[Math.cos(a1),Math.sin(a1)], nf=[uf[1],-uf[0]], ut=[Math.cos(a2),Math.sin(a2)], nt=[ut[1],-ut[0]];
  const K=al2(H,uf,LEG.L1), A=al2(K,ut,LEG.L2); let m=[nf[0]+nt[0],nf[1]+nt[1]]; const ml=Math.hypot(m[0],m[1]); m=[m[0]/ml,m[1]/ml];
  const tg=[-m[1],m[0]], P=al2(K,m,30+16*q); return {H,K,A,uf,nf,ut,nt,m,tg,P}; }
function drawLeg(G,kI,gap,strain,heal,t){ const {H,K,A,uf,nf,ut,nt,tg,P}=G, L1=LEG.L1, bone='rgba(199,125,219,0.95)', bf='#2C2333';
  /* soft flesh, so it reads as a leg */
  X.save(); X.globalAlpha*=0.11*Math.min(1,kI*3); seg(H,K,1,176,'#FFFFFF'); seg(K,A,1,128,'#FFFFFF'); seg(al2(A,ut,14),al2(A,ut,14,nt,96),1,46,'#FFFFFF'); X.restore();
  /* bones: outline pass, then fill pass (one clean silhouette) */
  const B=[[al2(H,uf,40),al2(K,uf,-44),29,0,0.5],[al2(K,uf,-52),al2(K,uf,-46),44,0.4,0.55],[al2(K,ut,46),al2(K,ut,52),39,0.45,0.6],[al2(K,ut,50),al2(A,ut,-18),24,0.5,0.95],[H,al2(H,uf,2),38,0,0.2]];
  for(const pass of [0,1]) B.forEach(([a,b,r,k0,k1])=>seg(a,b,pr(kI,k0,k1),pass?2*r:2*r+9,pass?bf:bone));
  /* quadriceps: the belly along the front of the thigh; it pulls back when the tendon lets go */
  const kM=pr(kI,0.45,0.85), rt=gap*1.15; if(kM>0){ const b0=al2(H,uf,0.07*L1,nf,36), c=al2(H,uf,0.38*L1-rt*0.5,nf,150), b1=al2(H,uf,0.74*L1-rt,nf,52), i1=al2(H,uf,0.74*L1-rt,nf,33), i0=al2(H,uf,0.07*L1,nf,33);
    X.save(); X.globalAlpha*=kM; X.beginPath(); X.moveTo(b0[0],b0[1]); X.quadraticCurveTo(c[0],c[1],b1[0],b1[1]); X.lineTo(i1[0],i1[1]); X.lineTo(i0[0],i0[1]); X.closePath();
    X.fillStyle='rgba(118,2,138,0.86)'; X.fill(); X.strokeStyle=LIL; X.lineWidth=3.5; X.lineJoin='round'; X.stroke();
    X.globalAlpha*=0.32; X.strokeStyle='#FFFFFF'; X.lineWidth=2.2; for(const e of [62,92,122]){ const f0=al2(H,uf,0.13*L1,nf,40), fc=al2(H,uf,0.40*L1-rt*0.5,nf,e), f1=al2(H,uf,0.72*L1-rt,nf,46); X.beginPath(); X.moveTo(f0[0],f0[1]); X.quadraticCurveTo(fc[0],fc[1],f1[0],f1[1]); X.stroke(); }
    X.restore(); }
  /* tendons: quadriceps tendon into the top of the kneecap (the one that tears), patellar tendon below it */
  const kT=pr(kI,0.72,1), q00=al2(H,uf,0.74*L1,nf,42), q0=al2(H,uf,0.74*L1-rt,nf,42), q1=al2(P,tg,-15), Tm=[(q00[0]+q1[0])/2,(q00[1]+q1[1])/2];
  if(kT>0){ const dq=[q1[0]-q00[0],q1[1]-q00[1]], dl=Math.hypot(dq[0],dq[1]), uq=[dq[0]/dl,dq[1]/dl], pt=al2(K,ut,112,nt,27), p0=al2(P,tg,15);
    seg(p0,pt,kT,19,'rgba(118,2,138,0.9)'); seg(p0,pt,kT,11,'rgba(199,125,219,0.85)');
    const g=gap*(1-heal), e1=[Tm[0]-uq[0]*g,Tm[1]-uq[1]*g], e2=[Tm[0]+uq[0]*g*0.45,Tm[1]+uq[1]*g*0.45];
    const hot=Math.min(1,strain), tc=`rgb(${Math.round(214+41*hot)},${Math.round(160+95*hot)},${Math.round(232+23*hot)})`;
    if(g<0.5){ seg(q0,q1,kT,34,'rgba(118,2,138,0.95)'); seg(q0,q1,kT,23,tc); }
    else { seg(q0,e1,1,34,'rgba(118,2,138,0.95)'); seg(q0,e1,1,23,tc); seg(q1,e2,1,34,'rgba(118,2,138,0.95)'); seg(q1,e2,1,23,tc);
      X.save(); X.strokeStyle='rgba(255,255,255,0.9)'; X.lineWidth=3.2; X.lineCap='round'; for(const [e,s] of [[e1,1],[e2,-1]]) for(const w of [-0.7,0,0.7]){ X.beginPath(); X.moveTo(e[0],e[1]); X.lineTo(e[0]+s*(uq[0]*Math.cos(w)-uq[1]*Math.sin(w))*13,e[1]+s*(uq[0]*Math.sin(w)+uq[1]*Math.cos(w))*13); X.stroke(); } X.restore(); }
    if(strain>0||heal>0){ const a=Math.min(1,strain)*(0.55+0.3*Math.sin(t*9))*(1-heal)+0.5*Math.sin(Math.PI*heal), gl=X.createRadialGradient(Tm[0],Tm[1],6,Tm[0],Tm[1],140);
      gl.addColorStop(0,`rgba(255,255,255,${Math.min(0.9,0.8*a)})`); gl.addColorStop(0.3,`rgba(199,125,219,${Math.min(0.9,0.6*a)})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(Tm[0]-150,Tm[1]-150,300,300); } }
  /* kneecap */
  const kP=pr(kI,0.6,0.8); if(kP>0){ X.save(); X.globalAlpha*=kP; seg(al2(P,tg,-13),al2(P,tg,13),1,45,bone); seg(al2(P,tg,-13),al2(P,tg,13),1,36,'#3A2E45'); X.restore(); }
  return Tm; }
function knee(t){ if(t<T_CA_IN||t>=T_CA_OUT+0.5) return; const a=CA(t); if(a<=0) return; const t0=T_CA_IN+0.2, aL=WS.P2[12]-0.1, aT=WS.P3[0]-0.12, aP2=WS.P3[2]-0.15, aBr=WS.P3[4]-0.1, aPT=WS.P3[9]-0.1;
  X.save(); X.globalAlpha=a;
  chapter(t,T_CA_IN+0.1,aP2,'WHAT HAPPENED','شو صار؟'); chapter(t,aP2,T_CA_OUT+0.5,'THE TREATMENT','العلاج');
  const q=ease(pr(t,aP2+0.1,aP2+0.85)), G=legPose(q), kI=pr(t,t0,t0+1.0), tear=ease(pr(t,aT,aT+0.22)), heal=ease(pr(t,aPT+0.1,aPT+0.8));
  const strain=pr(t,aL+0.1,aT)*(1-0.55*pr(t,aT+0.15,aT+0.6))*(1-pr(t,aP2,aP2+0.5)), gs=(1.32-0.32*q)*(1+0.02*pr(t,T_CA_IN,T_CA_OUT));
  const ox=540, oy=890+80*q, cxq=545+105*q, cyq=870+120*q, S=p=>[ox+gs*(p[0]-cxq),oy+gs*(p[1]-cyq)];   /* base → screen (labels are set in screen space, at fixed sizes) */
  X.save(); X.translate(ox,oy); X.scale(gs,gs); X.translate(-cxq,-cyq);
  /* the load on the footplate (phase 1) */
  const kL=ik(t,aL,0.4)*(1-pr(t,aP2-0.1,aP2+0.3)); if(kL>0){ const {A,ut,nt}=G, push=3*Math.sin(t*7)*kL, o=al2(A,ut,46-push);
    X.save(); X.globalAlpha*=kL; seg(al2(o,nt,-70),al2(o,nt,122),1,14,'rgba(255,255,255,0.85)');
    const wc=al2(o,ut,62+(1-kL)*60,nt,30); X.fillStyle='#1B1620'; X.strokeStyle='rgba(255,255,255,0.55)'; X.lineWidth=4; X.beginPath(); X.arc(wc[0],wc[1],48,0,7); X.fill(); X.stroke();
    X.strokeStyle='rgba(199,125,219,0.5)'; X.lineWidth=3; X.beginPath(); X.arc(wc[0],wc[1],38,0,7); X.stroke(); nkTxt('٤٠٠',wc[0],wc[1]-7,36,'#FFFFFF','center'); nkTxt('كغ',wc[0],wc[1]+22,20,LIL,'center');
    X.restore(); }
  const Tm=drawLeg(G,kI,15*tear,strain,heal,t);
  /* the tear: one soft ring from the tendon */
  const rg=pr(t,aT,aT+0.6); if(rg>0&&rg<1){ X.save(); X.globalAlpha*=(1-rg)*0.8; X.strokeStyle=LIL; X.lineWidth=4; X.beginPath(); X.arc(Tm[0],Tm[1],16+110*ease(rg),0,7); X.stroke(); X.restore(); }
  /* phase 2: a knee immobiliser holds the leg straight */
  const kB=pr(t,aBr,aBr+0.7); if(kB>0){ const {K,uf,nf}=G, e=100; X.save(); X.globalAlpha*=Math.min(1,kB*2.5)*q;
    X.save(); X.globalAlpha*=0.14; seg(al2(K,uf,-190),al2(K,uf,190),1,2*e,'#FFFFFF'); X.restore();
    for(const s of [1,-1]) seg(al2(K,uf,-190,nf,s*e),al2(K,uf,190,nf,s*e),pr(kB,0,0.6),6,'rgba(255,255,255,0.9)');
    [-136,-48,48,136].forEach((d,i)=>seg(al2(K,uf,d,nf,-e),al2(K,uf,d,nf,e),pr(kB,0.3+i*0.12,0.55+i*0.12),15,LIL)); X.restore(); }
  X.restore();
  /* the tendon's name, then what happened to it, read as one line: «وتر العضلة الرباعية: تمزّق» */
  const lf=1-pr(t,aP2-0.1,aP2+0.25), sT=S(Tm);
  if(lf>0){ X.save(); X.globalAlpha*=lf; injLabel(t,t0+0.85,sT[0]-8,sT[1]-8,70,520,'Quadriceps Tendon','وتر العضلة الرباعية','left');
    const kt=ik(t,aT+0.08,0.3); if(kt>0){ X.save(); X.globalAlpha*=kt; nkTxt('تمزّق',190,606+(1-kt)*14,88,'#FFFFFF','center'); X.restore(); }
    X.restore(); }
  glassRow(760,610,'تثبيت الركبة',ik(t,WS.P3[4]+0.15,0.35),true,46); glassRow(320,610,'علاج فيزيائي',ik(t,aPT+0.05,0.35),true,46);
  const kn=ik(t,WS.P3[4]+0.4,0.35); if(kn>0){ X.save(); X.globalAlpha*=kn; nkTxt('للتمزّق الجزئي الصغير',540,712,34,LIL,'center',1,800); X.restore(); }
  X.restore(); }

/* 6) how to protect yourself: three rows, each lands on its word (his own words, so this canvas has no caption) */
function heat(x,y,k,t){ X.save(); X.strokeStyle=LIL; X.lineWidth=11; X.lineCap='round'; for(const [dx,ph] of [[-54,0],[0,1.3],[54,2.6]]){ const kk=ease(pr(k,ph*0.1,0.5+ph*0.1)); if(kk<=0) continue; const w=Math.sin(t*3+ph)*6;
    X.beginPath(); X.moveTo(x+dx,y+62); X.bezierCurveTo(x+dx-32+w,y+62-44*kk,x+dx+32-w,y+62-80*kk,x+dx,y+62-124*kk); X.stroke(); } X.restore(); }
function bars(x,y,k){ X.save(); [[-60,48],[0,86],[60,124]].forEach(([dx,h],i)=>{ const kk=ease(pr(k,i*0.22,0.4+i*0.22)); if(kk<=0) return; X.fillStyle=i===2?'#FFFFFF':LIL; X.globalAlpha*=1; rr(x+dx-19,y+62-h*kk,38,h*kk,10); X.fill(); }); X.restore(); }
function protect(t){ if(t<T_P5-0.45||t>=T_P6+0.5) return; const a=CB(t); if(a<=0) return; X.save(); X.globalAlpha=a;
  chapter(t,T_P5-0.02,T_P6+1,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟');
  const rows=[[WS.P5[0],'الإحماء','قبل التمرين',0],[WS.P5[3],'زيادة الأوزان','بشكل تدريجي',1],[WS.P5[10]-0.15,'الأداء الصح','',2]];
  rows.forEach(([at,a1,a2,ic],i)=>{ const k=ik(t,at-0.1,0.38); if(k<=0) return; const y=600+i*250, dx=(1-k)*40; X.save(); X.globalAlpha*=k; X.translate(dx,0);
    X.fillStyle=PURPLE; X.beginPath(); X.arc(888,y,50,0,7); X.fill(); nkTxt(['١','٢','٣'][i],888,y+5,58,'#FFFFFF','center');   /* x ≤ 938: clear of Instagram's buttons on the last row */
    if(a2){ nkTxt(a1,806,y-32,70,'#FFFFFF','right'); nkTxt(a2,806,y+44,48,LIL,'right'); } else nkTxt(a1,806,y+4,70,'#FFFFFF','right');
    const kk=pr(t,at,at+0.9); if(ic===0) heat(200,y,kk,t); else if(ic===1) bars(200,y,kk); else { nkMarkDot(200,y,58,true,pr(kk,0.1,0.7)); }
    X.restore(); });
  X.restore(); }

/* 7) the knee sleeve: its photo on glass beside him when he names it (P6), then alone on the canvas with what it is and is not (P7) */
function sleeve(t){ if(t<T_P6||t>=T_P8+0.5) return; const at=WS.P6[2]-0.12, k=ik(t,at,0.4); if(k<=0) return; const kc=ease(pr(t,T_P7-0.45,T_P7)), out=1-ease(pr(t,T_P8,T_P8+0.45)); if(out<=0) return;
  const cx=181+(540-181)*kc, cy=1084+(760-1084)*kc, w=140+(330-140)*kc, h=w*(PROD.naturalHeight||431)/(PROD.naturalWidth||250), bob=Math.sin(t*1.7)*6*kc;
  X.save(); X.globalAlpha=out;
  if(kc>0){ chapter(t,T_P7-0.3,T_P8+1,'KNEE SLEEVE','مشدّ الركبة');
    const gl=X.createRadialGradient(540,760,30,540,760,420); gl.addColorStop(0,`rgba(199,125,219,${0.34*kc})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(100,380,880,840); }
  if(kc<1){ X.save(); X.globalAlpha*=Math.min(1,k*1.6)*(1-kc); const pw=250, ph=330, px=181-pw/2, py=949+(1-k)*40;   /* y 949–1279: clear of the caption (from 1320) and of his mic hand (x ≥ 380) */ glassPane(px,py,pw,ph,34,{}); nkTxt('مشدّ الركبة',181,py+ph-34,32,'#FFFFFF','center'); X.restore(); }
  if(PROD.naturalWidth){ X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(cx,cy+bob+(1-k)*40*(1-kc)); X.rotate(-0.05*kc); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=30; X.shadowOffsetY=14; X.drawImage(PROD,-w/2,-h/2,w,h); X.restore(); }
  glassRow(540,1120,'دعم إضافي للمفصل',ik(t,WS.P7[2]-0.05,0.35)*kc,true,42); glassRow(540,1212,'منع التمزّقات',ik(t,WS.P7[9]-0.05,0.35)*kc,false,42,1);
  X.restore(); }

function chapterDots(t){ const a=CAN_IN(t); if(a<=0) return; const done=t<T_P4?1:(t<T_P6+0.5?2:3);
  X.save(); X.globalAlpha=a; ['١','٢','٣'].forEach((n,i)=>{ const x=540+(1-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<2){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

/* 8) P8: his last line on liquid glass */
function takeaway(t){ if(t<T_P8||t>=VEND) return; const k=ik(t,WS.P8[0]-0.1,0.4), out=1-pr(t,VEND-0.3,VEND); if(k<=0||out<=0) return;
  const k2=ik(t,WS.P8[3]-0.08,0.3), k3=ik(t,WS.P8[4]-0.08,0.3), g=ik(t,WS.P8[3]-0.3,0.4);   /* the card opens when the line arrives: never a large empty panel */
  const x=100,y=1150+(1-k)*60,w=830,h=108+222*g; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{}); X.fillStyle=PURPLE; rr(x+w-20,y+30,8,h-60,4); X.fill();
  nkTxt('وآخر شي… تذكّر',x+w-54,y+56,34,LIL,'right',1,800);
  if(k2>0){ X.save(); X.globalAlpha*=k2; nkTxt('سلامتك أهم',x+w-52,y+158+(1-k2)*16,104,'#FFFFFF','right'); X.restore(); }
  if(k3>0){ X.save(); X.globalAlpha*=k3; nkTxt('من الوزن الذي ترفعه',x+w-52,y+262+(1-k3)*14,58,LIL,'right'); X.restore(); }
  X.restore(); }

/* sources: every medical claim shows where it came from, while it is said (on the canvases; around Ahmad they orbit him) */
const INJ_SRC=[{s:T_CA_IN+0.7,e:T_CA_OUT+0.15,text:'المصدر: AAOS OrthoInfo — Quadriceps Tendon Tear'},{s:T_P5+0.3,e:T_P6+0.15,text:'المصدر: AAOS OrthoInfo — Safe Exercise · Mayo Clinic'},
  {s:T_P7+0.7,e:T_P8+0.15,text:'المصدر: Sharif et al. — Phys Ther Sport, 2017'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ if(t<c.s||t>c.e) return; const k=ik(t,c.s,0.3)*(1-pr(t,c.e-0.2,c.e)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.font='700 24px Inter, '+FONT; const tw=X.measureText(c.text).width+52; X.fillStyle='rgba(10,10,12,0.68)'; rr(540-tw/2,1450,tw,44,22); X.fill();   /* y 1450–1494: under the caption, above Instagram's belt (1500) */
  X.strokeStyle='rgba(199,125,219,0.35)'; X.lineWidth=2; rr(540-tw/2,1450,tw,44,22); X.stroke();
  X.fillStyle='#D9A6E8'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(c.text,540,1473); X.restore(); }); }

SCENE_LIST.push(['ahmadBack',ahmadBack,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['knee',knee]);
SCENE_LIST.push(['protect',protect]);
SCENE_LIST.push(['sleeve',sleeve]);
SCENE_LIST.push(['chapterDots',chapterDots]);
SCENE_LIST.push(['hookTag',hookTag]);
SCENE_LIST.push(['hookWords',hookWords]);
SCENE_LIST.push(['titleCard',titleCard]);
SCENE_LIST.push(['ahmadFront',ahmadFront]);
SCENE_LIST.push(['takeaway',takeaway]);
SCENE_LIST.push(['srcLine',srcLine]);

/* end card: fades in (no flash): the one thing to do with this video, the logo, the series tag, the sources */
outro=function(t){ const s=VEND; if(t<s-0.35) return; const a=ease(pr(t,s-0.35,s+0.1)); X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k0=ik(t,s+0.1,0.4); if(k0>0){ X.globalAlpha=k0; nkTxt('ابعتها لصاحبك',540,560+(1-k0)*16,96,'#FFFFFF','center'); nkTxt('اللي بيحمّل فوق طاقته',540,668+(1-k0)*16,60,LIL,'center'); }
  const k1=ik(t,s+0.3,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=560, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,900-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.5,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-190*k2,1016,380*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1088,34,LIL,'center',800,6); injLatin('EP 03 / 10',540,1140,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1318,30,LIL,'center');
    ['AAOS OrthoInfo — Quadriceps Tendon Tear · Safe Exercise','Cleveland Clinic — Quadriceps Tendon Tear','Mayo Clinic — Weight training · Sharif et al., Phys Ther Sport 2017','Press reports on the accident: Milenio · Uno TV (Feb 2026)'].forEach((s2,i)=>injLatin(s2,540,1368+i*36,23,'rgba(255,255,255,0.75)','center',600)); }
  X.restore(); };
