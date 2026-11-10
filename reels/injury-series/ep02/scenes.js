const T_P2=4.8, T_P3=7.633, T_CAN=9.593, T_P4=12.767, T_P5=13.867, T_P6=18.4, T_P7=21.867, T_P8=24.2, T_P9=29.3;
/* ═══ NITRON — INJURY BREAKDOWN · EP 02 «Rotator Cuff Tendinopathy» ═══
   Client, 10 Nov: realistic gym backdrop (Higgsfield, no products), liquid glass, motion graphics first, words and
   studies orbiting Ahmad, few and smooth transitions (no hard cuts, no flashes), sound effects only where they mean something.
   H   injury footage, cleaned, slowed and pushed in on the moment · Ahmad's «لحظة… شوفوا هون» over it
   P2  Ahmad on the gym: the injury's name on liquid glass (qualified: «من شكل الحركة»)
   P3  Ahmad → we leave him: the shoulder is drawn in ink, line by line, then it moves (the cuff tendon under the acromion)
   P4–P6 still on the canvas: «ليش صار؟» load vs capacity graph · what it feels like (arm raise)
   P7–P9 back to Ahmad: the question behind his head · three tips orbit him · treatment on glass, the sources orbit him · end card.
   The T_* constants above this line are generated from timeline.json (gen_times.py). */
const PURPLE='#76028A', LIL='#C77DDB', INJ_INK='#0A0A0C';
SCENES=[{s:0,e:T_P3,m:R_FULL,nocap:true},{s:T_P3,e:99,m:R_FULL}];
nkNoBarUntil(99);
const INJ_EP={n:'02',name:'Rotator Cuff Tendinopathy',ar:'اعتلال أوتار الكفة المدوّرة'};
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));
const nkQ=(c,i)=>nkS(c+1,i);   /* card 0 is the hook's on-screen lead line; the spoken cards start at 1 */
const CAN1=t=>ease(pr(t,T_CAN,T_CAN+0.45))*(1-ease(pr(t,T_P7,T_P7+0.45)));
const CAN2=t=>ease(pr(t,T_P8-0.45,T_P8))*(1-ease(pr(t,T_P9,T_P9+0.45)));   /* the prevention canvas: in over the end of P7, out after the cut to P9 (both take changes are hidden under it) */
const CAN_IN=t=>Math.max(CAN1(t),CAN2(t));   /* the canvas dissolves in over Ahmad and out again: no cut */

/* ink: an SVG path drawn line by line (the «شلون يشتغل» look), then filled */
const INKC={};
function inkd(d,k,col,lw,fill,fa){ if(k<=0) return; const c=INKC[d]||(INKC[d]=(()=>{ const e=document.createElementNS('http://www.w3.org/2000/svg','path'); e.setAttribute('d',d); return {p:new Path2D(d),len:e.getTotalLength()}; })());
  X.save(); X.lineCap='round'; X.lineJoin='round';
  if(fill){ const f=Math.max(0,(k-0.75)/0.25)*(fa===undefined?1:fa); if(f>0){ X.globalAlpha*=f; X.fillStyle=fill; X.fill(c.p); X.globalAlpha/=f; } }
  X.strokeStyle=col; X.lineWidth=lw; X.setLineDash([c.len*Math.min(1,k)+0.01,c.len+10]); X.stroke(c.p); X.restore(); }

/* 1) cold open: tag + his words, big, on the footage */
function hookTag(t){ if(t>T_P2) return; const k=ik(t,0.15,0.3)*(1-pr(t,T_P2-0.35,T_P2-0.1)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.shadowColor='rgba(0,0,0,0.25)'; X.shadowBlur=20; X.fillStyle='rgba(255,255,255,0.94)'; rr(48,190,300,58,29); X.fill(); X.shadowColor='transparent';
  X.fillStyle=PURPLE; X.beginPath(); X.arc(82,219,8,0,7); X.fill(); X.restore();
  X.save(); X.globalAlpha=k; injLatin('REAL FOOTAGE',212,220,24,PURPLE,'center',800,3); X.restore(); }
function hookWords(t){ if(t>T_P2) return; const a1=nkQ(0,0), a2=nkQ(1,0), out=1-pr(t,T_P2-0.4,T_P2-0.15); if(out<=0) return;
  const sh=ik(t,0.05,0.3); if(sh>0){ const g=X.createLinearGradient(0,1080,0,1700); g.addColorStop(0,'rgba(10,10,12,0)'); g.addColorStop(1,`rgba(10,10,12,${0.66*sh*out})`); X.fillStyle=g; X.fillRect(0,1080,W,840); }
  const k0=ik(t,0.10,0.28)*(1-pr(t,a1-0.3,a1-0.08)), k1=ik(t,a1-0.05,0.25), k2=ik(t,a2-0.05,0.25);
  if(k0>0){ X.save(); X.globalAlpha=k0; X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=24; nkTxt('ركّز على كتفه',540,1385+(1-ik(t,0.10,0.28))*24,124,'#FFFFFF','center'); X.restore();   /* frame 1: where to look, before he speaks */
    X.save(); X.globalAlpha=k0; X.fillStyle=PURPLE; rr(540-150,1474,300,12,6); X.fill(); X.restore(); }
  if(k1>0){ X.save(); X.globalAlpha=k1*out*(1-0.55*k2); X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=24; nkTxt('لحظة…',540,1262+(1-k1)*24,100,'#FFFFFF','center'); X.restore(); }
  if(k2>0){ X.save(); X.globalAlpha=k2*out; X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=24; nkTxt('شوفوا هون',540,1392+(1-k2)*24,140,LIL,'center'); X.restore();
    X.save(); X.globalAlpha=k2*out; X.fillStyle=PURPLE; rr(540-160*k2,1476,320*k2,12,6); X.fill(); X.restore(); } }

/* 2) Ahmad's layer: words and chips that pass BEHIND him are drawn here, then he is drawn over them */
const ORB={cx:552,cy:1090,rx:335,ry:96,w:2*Math.PI/6.5,lift:[-82,0,82]};   /* one turn in 6.5 s · each chip rides its own ring (stacked), so they never run into each other · rx keeps a chip inside the frame at the far left and right */
function orbitDraw(t,items,front,s0,e0){ if(t<s0||t>=e0) return; const out=1-pr(t,e0-0.3,e0);
  items.forEach((it,ix)=>{ it.dy=ORB.lift[ix%3]; const k=ik(t,it.at-0.06,0.32); if(k<=0) return; const th=Math.PI/2-0.55+ORB.w*(t-it.at), d=Math.sin(th);
    if((d>=0)!==front) return; const x=ORB.cx+ORB.rx*Math.cos(th), y=ORB.cy+ORB.ry*d+(it.dy||0), sc=0.74+0.30*(d+1)/2;
    X.save(); X.globalAlpha=out*(front?1:0.62); X.translate(x,y); X.scale(sc,sc); X.translate(-x,-y);
    if(it.lat){ const fs=it.size||30; X.font='800 '+fs+'px Inter, '+FONT; const w=X.measureText(it.text).width+fs*1.9, h=fs*2.1;
      X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(x,y+(1-ease(k))*18); glassPane(-w/2,-h/2,w,h,h/2,{}); X.fillStyle=LIL; X.beginPath(); X.arc(-w/2+fs*0.75,0,6,0,7); X.fill(); injLatin(it.text,fs*0.3,2,fs,'#FFFFFF','center',800); X.restore(); }
    else nkGlassPill(x,y,it.text,k,it.size||46);
    X.restore(); }); }
const STUDIES=()=>[{text:'AAOS · OrthoInfo',at:nkQ(31,0)-0.1,lat:true,size:32},{text:'Br J Sports Med · 2009',at:nkQ(31,0)+1.0,lat:true,size:32},{text:'Cook & Purdam',at:nkQ(31,0)+2.1,lat:true,size:32}];
function ahmadBack(t){ if(t<T_P2||t>=VEND) return; if((t>=T_CAN+0.5&&t<T_P7)||(t>=T_P8&&t<T_P9)) return;
  /* P7: the question on the wall behind his head */
  if(t>=T_P7&&t<T_P8){ const k=ik(t,T_P7+0.35,0.4), out=1-pr(t,T_P8-0.5,T_P8-0.2); if(k>0&&out>0){ X.save(); X.globalAlpha=k*out*CAN_OUT(t); X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=30;
      nkTxt('كيف تحمي',540,250+(1-k)*30,150,'#FFFFFF','center'); nkTxt('حالك؟',540,422+(1-k)*30,170,LIL,'center'); X.restore(); } }
  orbitDraw(t,STUDIES(),false,T_P9,VEND);
  /* he is redrawn over whatever passed behind him, except inside the soft dissolves between takes (they are baked into the frames) */
  const inDis=t<T_P2+0.22||Math.abs(t-T_P3)<0.09;
  if(PRS_OK&&!inDis) X.drawImage(PRS,0,0,W,H); }
const CAN_OUT=t=>ease(pr(t,T_P7,T_P7+0.45));   /* the canvas leaves AFTER the cut to P7, so only P7's frames show through */
function ahmadFront(t){ if(t<T_P9||t>=VEND) return; orbitDraw(t,STUDIES(),true,T_P9,VEND); }

/* 3) P2: the injury's name on liquid glass, qualified (series rule: no diagnosis without confirmation) */
function titleCard(t){ if(t<T_P2||t>T_P3+0.3) return; const k=ik(t,nkQ(3,0)-0.1,0.4), out=1-pr(t,T_P3-0.05,T_P3+0.3); if(k<=0||out<=0) return;
  const x=100,y=1150+(1-k)*60,w=830,h=330; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{});   /* x ≤ 930 and y ≤ 1480: clear of Instagram's buttons (right) and caption belt (bottom) */
  X.fillStyle=PURPLE; rr(x+w-20,y+38,8,h-76,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-54,y+62,24,LIL,'right',800,3);
  injLatin(INJ_EP.name,x+w-52,y+134,50,'#FFFFFF','right',900);
  nkTxt(INJ_EP.ar,x+w-52,y+216,56,LIL,'right');
  X.globalAlpha=k*out*0.78; nkTxt('على الأغلب · من شكل الحركة',x+w-52,y+284,30,'#FFFFFF','right',1,700); X.restore(); }

/* 4) the dark medical canvas (dissolves in over Ahmad) */
function medBg(t){ const a=CAN_IN(t); if(a<=0) return; X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,950,40,560,950,900); g.addColorStop(0,'rgba(118,2,138,0.55)'); g.addColorStop(0.55,'rgba(75,1,88,0.18)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  X.restore(); }
function injDrift(t,s0,e0){ const z=1+0.02*pr(t,s0,e0); X.translate(540,900); X.scale(z,z); X.translate(-540,-900); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al){ const k1=ik(t,at,0.25), k2=ik(t,at+0.18,0.3); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2; const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }

/* 5) the shoulder, front view (the arm hangs on the left): drawn in ink, then the arm lifts and the cuff tendon works under the acromion */
const SH={hc:[430,800],
  hum:'M358 1290 L366 962 C352 912 318 882 314 822 A118 118 0 1 1 542 858 C522 900 472 922 462 962 L444 1290',
  scap:'M574 716 C560 760 560 842 576 886 L642 902 L802 1182 L862 1150 L882 702 L762 650 L642 690 Z',
  acr:'M846 644 C742 606 600 586 500 594 C440 598 390 622 390 646 C390 668 440 662 500 650 C600 634 724 650 826 694 Z',
  clav:'M586 566 C680 544 800 528 930 508 C946 506 952 538 938 544 C810 564 690 584 602 606 C584 610 572 572 586 566 Z',
  ten:'M820 700 C700 668 560 656 470 670 C410 680 362 704 340 752'};
function shoulder(t){ if(t<T_CAN||t>=T_P4+0.3) return; const t0=T_CAN+0.3, a=CAN_IN(t)*(1-pr(t,T_P4-0.05,T_P4+0.3)); if(a<=0) return;
  X.save(); X.globalAlpha=a; injDrift(t,T_CAN,T_P4);
  chapter(t,T_CAN+0.1,T_P4+0.3,'WHAT HAPPENED','شو صار؟');
  const bone='rgba(199,125,219,0.92)', bf='#2C2333';
  inkd(SH.scap,pr(t,t0,t0+0.55),bone,4,bf,0.92);
  inkd(SH.clav,pr(t,t0+0.2,t0+0.65),bone,4,bf,0.92);
  /* then it works: the arm lifts and comes back, the tendon takes the load under the acromion */
  const mv=pr(t,t0+1.45,t0+2.75), th=0.46*Math.sin(Math.PI*mv);
  X.save(); X.translate(SH.hc[0],SH.hc[1]); X.rotate(th); X.translate(-SH.hc[0],-SH.hc[1]); inkd(SH.hum,pr(t,t0+0.05,t0+0.7),bone,4,bf,0.96); X.restore();
  const tk=pr(t,t0+0.55,t0+0.95); if(tk>0){ inkd(SH.ten,tk,'rgba(118,2,138,0.95)',36); inkd(SH.ten,tk,'rgba(199,125,219,0.96)',26);
    X.save(); X.globalAlpha*=0.5; for(const o of [-8,0,8]){ X.save(); X.translate(0,o); inkd(SH.ten,tk,'rgba(255,255,255,0.55)',2); X.restore(); } X.restore(); }
  inkd(SH.acr,pr(t,t0+0.35,t0+0.8),bone,4,bf,0.96);   /* the acromion sits over the tendon */
  const sk=pr(t,t0+0.95,t0+1.2); if(sk>0){ const pulse=0.65+0.25*Math.sin((t-t0)*7)+0.6*Math.sin(Math.PI*mv), gx=448, gy=668;
    const gl=X.createRadialGradient(gx,gy,8,gx,gy,150); gl.addColorStop(0,`rgba(255,255,255,${Math.min(0.9,0.5*sk*pulse)})`); gl.addColorStop(0.25,`rgba(199,125,219,${Math.min(0.9,0.5*sk*pulse)})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(gx-160,gy-160,320,320); }
  injLabel(t,t0+1.0, 640,664, 1025,470, 'Rotator Cuff','أوتار الكفة المدوّرة','right');
  injLabel(t,t0+1.2, 420,812, 60,1010, 'Humerus','عظم العضد','left');
  injLabel(t,t0+1.4, 730,1050, 500,1262, 'Scapula','لوح الكتف','left');   /* not at the right edge: that column is Instagram's buttons */
  X.restore(); }

/* 6) why: training load climbs in steps, the body adapts on a slower curve; the gap is where it gets hurt */
function dumbbell(x,y,s,col){ X.save(); X.translate(x,y); X.scale(s,s); X.fillStyle=col; rr(-34,-6,68,12,6); X.fill(); rr(-50,-24,18,48,7); X.fill(); rr(32,-24,18,48,7); X.fill(); X.restore(); }
const GR={load:'M190 1180 H330 V1070 H470 V920 H610 V740 H750 V590 H900', cap:'M190 1180 C400 1152 650 1100 900 1020'};
function why(t){ if(t<T_P4-0.1||t>=T_P6+0.3) return; const a=1-pr(t,T_P6-0.05,T_P6+0.3); if(a<=0) return; X.save(); X.globalAlpha=a; injDrift(t,T_P4,T_P6);
  chapter(t,T_P4+0.05,T_P6+0.3,'WHY IT HAPPENED','ليش صار؟');
  const k0=ik(t,T_P4+0.25,0.5); if(k0>0){ X.save(); X.globalAlpha*=k0; X.strokeStyle='rgba(255,255,255,0.28)'; X.lineWidth=4; X.lineCap='round'; X.beginPath(); X.moveTo(170,540); X.lineTo(170,1230); X.lineTo(930,1230); X.stroke();
    nkTxt('الوقت',930,1275,30,'rgba(255,255,255,0.55)','right',1,700); X.restore(); }
  const aL=nkQ(12,0), aC=nkQ(14,1), kL=pr(t,aL-0.1,aL+1.5), kC=pr(t,aC-0.15,aC+0.9);
  inkd(GR.cap,kC,LIL,8);
  inkd(GR.load,kL,'#FFFFFF',8);
  [[260,1180,0.7,0.1],[400,1070,0.85,0.3],[540,920,1.0,0.52],[680,740,1.18,0.74],[826,590,1.36,0.94]].forEach(([x,y,s,at])=>{ const k=ease(pr(kL,at-0.08,at+0.06)); if(k>0){ X.save(); X.globalAlpha*=k; dumbbell(x,y-34-(1-k)*14,s,'#FFFFFF'); X.restore(); } });
  const kG=pr(t,aC+0.5,aC+1.1); if(kG>0){ X.save(); X.globalAlpha*=kG*(0.55+0.2*Math.sin(t*6)); const g=X.createLinearGradient(0,560,0,1100); g.addColorStop(0,'rgba(199,125,219,0.75)'); g.addColorStop(1,'rgba(118,2,138,0.10)'); X.fillStyle=g;
    X.beginPath(); X.moveTo(470,1070); X.lineTo(470,920); X.lineTo(610,920); X.lineTo(610,740); X.lineTo(750,740); X.lineTo(750,590); X.lineTo(900,590); X.lineTo(900,1020); X.bezierCurveTo(760,1066,620,1100,470,1128); X.closePath(); X.fill(); X.restore(); }
  const kl1=ik(t,aL+0.5,0.3); if(kl1>0){ X.save(); X.globalAlpha*=kl1; nkTxt('الحمل التدريبي',560,560,44,'#FFFFFF','right'); X.restore(); }
  const kl2=ik(t,aC+0.3,0.3); if(kl2>0){ X.save(); X.globalAlpha*=kl2; nkTxt('قدرة الجسم على التكيّف',900,1172,40,LIL,'right'); X.restore(); }
  injLabel(t,aC+1.0, 800,820, 1025,480, '', 'هون بتصير الإصابة','right');
  X.restore(); }

/* 7) what it feels like: the arm goes up, the shoulder lights up */
function feels(t){ if(t<T_P6-0.1||t>=T_P7+0.45) return; const a=ik(t,T_P6+0.05,0.35)*(1-CAN_OUT(t)); if(a<=0) return; X.save(); X.globalAlpha=a; injDrift(t,T_P6,T_P7);
  chapter(t,T_P6+0.05,T_P7+1,'HOW IT FEELS','شو بتحسّ؟');
  const col='rgba(255,255,255,0.72)', S=[400,880], L=270, aR=nkQ(17,1), up=ease(pr(t,aR-0.25,aR+1.1)), ph=0.2+2.55*up;   /* arm angle from hanging (0) to overhead (π) */
  X.lineCap='round'; X.lineJoin='round'; X.strokeStyle=col; X.fillStyle=col;
  X.beginPath(); X.arc(540,740,62,0,7); X.fill();                                   /* head */
  X.lineWidth=30; X.beginPath(); X.moveTo(400,880); X.lineTo(680,880); X.stroke();   /* shoulders */
  X.lineWidth=120; X.beginPath(); X.moveTo(540,900); X.lineTo(540,1150); X.stroke(); /* torso */
  X.lineWidth=26; X.beginPath(); X.moveTo(680,880); X.lineTo(712,1150); X.stroke();  /* resting arm */
  const hx=S[0]-L*Math.sin(ph), hy=S[1]+L*Math.cos(ph);
  X.strokeStyle='rgba(199,125,219,0.5)'; X.lineWidth=5; X.setLineDash([4,14]); X.beginPath(); X.arc(S[0],S[1],L,Math.PI/2+0.2,Math.PI/2+ph); X.stroke(); X.setLineDash([]);   /* the path of the hand */
  X.strokeStyle=LIL; X.lineWidth=28; X.beginPath(); X.moveTo(...S); X.lineTo(hx,hy); X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(hx,hy,20,0,7); X.fill();
  const pain=Math.min(1,up*1.6)*(0.6+0.4*Math.sin(Math.PI*Math.min(1,up*1.15))), gl=X.createRadialGradient(S[0],S[1],8,S[0],S[1],170);
  gl.addColorStop(0,`rgba(255,255,255,${0.75*pain})`); gl.addColorStop(0.3,`rgba(199,125,219,${0.6*pain})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(S[0]-180,S[1]-180,360,360);
  { const kk2=ik(t,aR+0.15,0.35); if(kk2>0){ X.save(); X.globalAlpha*=kk2; nkTxt('ألم عند رفع الذراع',540,486,52,LIL,'center'); X.restore(); } }
  const k1=ik(t,nkQ(19,0)-0.1,0.3), k2=ik(t,nkQ(19,1)-0.1,0.3); nkGlassPill(330,1250,'تمارين الصدر',k1,42); nkGlassPill(760,1250,'تمارين الكتف',k2,42);
  X.restore(); }

/* 7b) how to protect yourself, shown not told: weight added in small steady steps (✓) next to one reckless jump (✕), then the pain reminder */
const PRT={good:'M110 1000 H190 V950 H270 V900 H350 V850 H430 V800 H505', bad:'M585 1000 H760 V640 H965'};
function protect(t){ if(t<T_P8-0.45||t>=T_P9+0.45) return; const a=CAN2(t); if(a<=0) return; X.save(); X.globalAlpha=a; injDrift(t,T_P8,T_P9);
  chapter(t,T_P8-0.3,T_P9+1,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟');
  const aS=nkQ(23,1), aOK=nkQ(24,1), aJ=nkQ(25,0), aX=nkQ(25,1), aP=nkQ(26,0);
  X.save(); X.strokeStyle='rgba(255,255,255,0.20)'; X.lineWidth=4; X.lineCap='round'; X.beginPath(); X.moveTo(90,1006); X.lineTo(520,1006); X.moveTo(575,1006); X.lineTo(985,1006); X.stroke(); X.restore();
  const kS=pr(t,aS-0.1,aS+1.25); inkd(PRT.good,kS,LIL,8);
  [[150,1000,0.60,0.06],[230,950,0.68,0.28],[310,900,0.76,0.50],[390,850,0.84,0.72],[467,800,0.92,0.93]].forEach(([x,y,s,at])=>{ const k=ease(pr(kS,at-0.07,at+0.05)); if(k>0){ X.save(); X.globalAlpha*=k; dumbbell(x,y-30-(1-k)*12,s,'#FFFFFF'); X.restore(); } });
  const kJ=pr(t,aJ-0.05,aJ+0.42); inkd(PRT.bad,kJ,'rgba(255,255,255,0.78)',8);
  { const k=ease(pr(kJ,0.05,0.2)); if(k>0){ X.save(); X.globalAlpha*=k; dumbbell(672,1000-30,0.62,'#FFFFFF'); X.restore(); } }
  { const k=ease(pr(kJ,0.85,1)); if(k>0){ const wob=0.16*Math.sin((t-aJ)*15)*Math.max(0,1-(t-aJ-0.42)/1.4); X.save(); X.globalAlpha*=k; X.translate(862,640-52); X.rotate(wob); dumbbell(0,-(1-k)*18,1.75,'#FFFFFF'); X.restore(); } }
  const kOK=ik(t,aOK-0.05,0.3); if(kOK>0){ X.save(); X.globalAlpha*=kOK; nkMarkDot(400,1100,24,true,pr(kOK,0.3,1)); nkTxt('بوعي',360,1103,56,LIL,'right'); X.restore(); }
  const kX=ik(t,aX-0.05,0.3); if(kX>0){ X.save(); X.globalAlpha*=kX; nkMarkDot(872,1100,24,false,1); nkTxt('تهوّر',832,1103,56,'rgba(255,255,255,0.78)','right'); X.restore(); }
  const kP=ik(t,aP-0.05,0.35); if(kP>0){ const pulse=0.55+0.45*Math.sin((t-aP)*6.5); X.save(); X.globalAlpha*=kP;
    const gl=X.createRadialGradient(540,1232,10,540,1232,300); gl.addColorStop(0,`rgba(199,125,219,${0.30*pulse})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(200,1090,680,290);
    X.restore(); X.save(); nkGlassPill(540,1232,'الألم إنذار… مو تحدّي',kP,50);   /* not his words again (the caption carries those): what they mean */ X.restore(); }
  X.restore(); }

function chapterDots(t){ const a=CAN_IN(t); if(a<=0) return; const done=t<T_P4?1:(t<T_P7+1?2:3);
  X.save(); X.globalAlpha=a; ['١','٢','٣'].forEach((n,i)=>{ const x=540+(1-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<2){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

/* 8) P9: the treatment on liquid glass above his head, with the honest timeline from the source */
function treatment(t){ if(t<T_P9||t>=VEND) return; const out=1-pr(t,VEND-0.3,VEND); const rows=[['علاج فيزيائي',nkQ(31,0)],['تمارين تقوية تدريجية',nkQ(32,0)]];
  rows.forEach(([txt,at],i)=>{ const k=ik(t,at-0.08,0.32); if(k<=0) return; const w=560,h=76,x=540-w/2,y=180+i*88;   /* both rows end at y 344; his hair never rises above y 390 in any take (faces are placed at y 730) */
    X.save(); X.globalAlpha=k*out; X.translate(0,(1-k)*-24); glassPane(x,y,w,h,h/2,{}); nkMarkDot(x+w-h/2,y+h/2,h/2-13,true,pr(k,0.3,1)); nkTxt(txt,x+w-h-8,y+h/2+3,40,'#FFFFFF','right'); X.restore(); });
  const k3=ik(t,nkQ(29,3)+0.15,0.35);   /* right as he says «ما بتطوّل»: the honest range from the source */ if(k3>0){ X.save(); X.globalAlpha=k3*out; X.shadowColor='rgba(0,0,0,0.7)'; X.shadowBlur=14; nkTxt('التحسّن عادةً خلال أسابيع إلى أشهر',540,378,32,LIL,'center',1,800); X.restore(); } }

/* sources: every medical claim shows where it came from, while it is said */
const INJ_SRC=[{s:T_P3+0.5,e:T_P4-0.05,text:'المصدر: AAOS OrthoInfo — Rotator Cuff Tendinitis'},{s:T_P5+0.4,e:T_P6-0.05,text:'المصدر: Cook & Purdam — Br J Sports Med, 2009'},
  {s:T_P6+0.5,e:T_P7+0.1,text:'المصدر: AAOS OrthoInfo — Rotator Cuff Tendinitis'},{s:T_P9+1.5,e:0,text:'المصدر: AAOS OrthoInfo — Rotator Cuff Tendinitis'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ const ce=c.e||(VEND-0.05); if(t<c.s||t>ce) return; const k=ik(t,c.s,0.3)*(1-pr(t,ce-0.2,ce)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.font='700 24px Inter, '+FONT; const tw=X.measureText(c.text).width+52; X.fillStyle='rgba(10,10,12,0.68)'; rr(540-tw/2,1450,tw,44,22); X.fill();   /* y 1450–1494: under the caption, above Instagram's belt (1500) */
  X.strokeStyle='rgba(199,125,219,0.35)'; X.lineWidth=2; rr(540-tw/2,1450,tw,44,22); X.stroke();
  X.fillStyle='#D9A6E8'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(c.text,540,1473); X.restore(); }); }

SCENE_LIST.push(['ahmadBack',ahmadBack,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['shoulder',shoulder]);
SCENE_LIST.push(['why',why]);
SCENE_LIST.push(['feels',feels]);
SCENE_LIST.push(['protect',protect]);
SCENE_LIST.push(['chapterDots',chapterDots]);
SCENE_LIST.push(['hookTag',hookTag]);
SCENE_LIST.push(['hookWords',hookWords]);
SCENE_LIST.push(['titleCard',titleCard]);
SCENE_LIST.push(['ahmadFront',ahmadFront]);
SCENE_LIST.push(['treatment',treatment]);
SCENE_LIST.push(['srcLine',srcLine]);

/* end card: fades in (no flash), logo, series tag, the sources */
outro=function(t){ const s=VEND; if(t<s-0.35) return; const a=ease(pr(t,s-0.35,s+0.1)); X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k1=ik(t,s+0.15,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=640, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,860-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.45,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-210*k2,990,420*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1068,34,LIL,'center',800,6); injLatin('EP 02 / 10',540,1122,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1330,30,LIL,'center'); injLatin('AAOS OrthoInfo — Shoulder Impingement / Rotator Cuff Tendinitis',540,1385,24,'rgba(255,255,255,0.75)','center',600); injLatin('Cook & Purdam — Br J Sports Med 2009;43:409–416',540,1425,24,'rgba(255,255,255,0.75)','center',600); }
  X.restore(); };
