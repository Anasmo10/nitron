/* ═══ NITRON — INJURY BREAKDOWN · EP 05 «Barbell Drop · Bench Press» ═══
   Client, 14 Nov: Ahmad cut out frame by frame with no trace of the cloth; the hook is only the moment the bar falls on
   the man (everything after it cut, every text on the source removed); the Nitron look throughout.
   H    the bench press FULL SCREEN, slowed while the bar rolls out of his hands, the camera pushing in on the injury; no
        box, no words over it, no tags (v3, client: «بدنا شي يشدّه، يركّز على الإصابة») · his «ثلثين الإصابات اللي بتوصل للإسعاف
        بتكون لأنه الوزن وقع على صاحبه» over it, in the glass captions only
   P2   Ahmad: the episode's name on glass → the grip canvas: a 3D render of a hand pressing the bar (v2; v1's X-ray was
        refused: «ما بدنا إكس راي… اعمل رندر المسكة، رندر البار»).
        ١ no thumb round the bar (the closed thumb shown as a lilac ghost) · ٢ the wrist folds back under the load ·
        ٣ a slippery grip (sweat on the palm): the bar rolls out of the open side of the hand and falls
   P3   Ahmad (after the cut under the canvas): his two checks above his head, the sources orbit him
   P4   (under the protection canvas) a spotter drawn in the same ink taking the bar off him + the neck-compression deaths on record;
        then the SBD wrist wraps the moment he names them
   P5   his last line on glass (no caption) → end card.
   The T_*, WS/WE constants above this line come from gen5.py. */
const PURPLE='#76028A', LIL='#C77DDB';
SCENES=[{s:0,e:T_P2,m:R_FULL},{s:T_P2,e:T_C1IN+0.3,m:R_FULL,nocap:true},{s:T_C1IN+0.3,e:T_P3,m:R_FULL},{s:T_P3,e:T_C2IN+0.1,m:R_FULL,nocap:true},{s:T_C2IN+0.1,e:T_P5,m:R_FULL},{s:T_P5,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'05',name:'Barbell Drop · Bench Press',ar:'سقوط البار بالبنش برس'};
const BIM=nkUse('sbd.png');   /* the SBD wrist wraps (client, 15 Nov: «ذكرنا مشد الـSBD… حط لي مشد الميوت؟») */
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));
/* two canvases, 0.2 s in and out (a long blend over him read as blurred frames, EP04 v2) */
const CAN1=t=>ease(pr(t,T_C1IN,T_C1IN+0.2))*(1-ease(pr(t,T_C1OUT,T_C1OUT+0.2)));
const CAN2=t=>ease(pr(t,T_C2IN,T_C2IN+0.2))*(1-ease(pr(t,T_C2OUT,T_C2OUT+0.2)));
const CANA=t=>Math.max(CAN1(t),CAN2(t));
function rtlLine(parts,cx,y,size,ks){ X.save(); X.font='900 '+size+'px '+FONT; X.textBaseline='middle'; X.direction='rtl'; X.textAlign='right';
  const sp=size*0.26, ws=parts.map(p=>{ X.font='900 '+(p[2]||size)+'px '+FONT; return X.measureText(p[0]).width; }), tot=ws.reduce((a,b)=>a+b,0)+sp*(parts.length-1); let x=cx+tot/2;
  parts.forEach((p,i)=>{ const k=ks?ks[i]:1; if(k>0){ X.save(); X.globalAlpha*=k; X.font='900 '+(p[2]||size)+'px '+FONT; X.fillStyle=p[1]; X.fillText(p[0],x,y+(1-k)*16); X.restore(); } x-=ws[i]+sp; }); X.restore(); return tot; }
function tinted(img,col){ const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; const g=c.getContext('2d');
  g.drawImage(img,0,0); g.globalCompositeOperation='source-in'; g.fillStyle=col; g.fillRect(0,0,c.width,c.height); return c; }

/* 1) the hook: his words in the band above the picture; the tag and the study just above the band; a label on the ring */
function hookWords(t){ if(t>T_P2) return; const out=1-pr(t,T_P2-0.4,T_P2-0.12); if(out<=0) return;
  const kB=ik(t,WS.H[5]-0.12,0.25);
  if(kB<1){ const ks=[ik(t,0.10,0.22),ik(t,WS.H[1]-0.06,0.2)], k2=ik(t,WS.H[2]-0.06,0.25);
    X.save(); X.globalAlpha=out*(1-kB); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=24; rtlLine([['ثلثين',LIL,112],['الإصابات','#FFFFFF',112]],540,214-20*kB,112,ks);
    if(k2>0){ X.globalAlpha=out*(1-kB)*k2; nkTxt('اللي بتوصل للإسعاف',540,318+(1-k2)*12,58,'#FFFFFF','center'); } X.restore(); }
  if(kB>0){ const k1=ik(t,WS.H[6]-0.06,0.2), k2=ik(t,WS.H[7]-0.06,0.2), kC=ik(t,WS.H[8]-0.08,0.25);
    X.save(); X.globalAlpha=out; X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=24; rtlLine([['لأنه','#FFFFFF',80],['الوزن','#FFFFFF',104]],540,214,104,[kB,k2]);
    if(kC>0){ X.globalAlpha=out*kC; rtlLine([['وقع',LIL,72],['على','#FFFFFF',60],['صاحبه',LIL,72]],540,316+(1-kC)*12,72,[1,ik(t,WS.H[9]-0.06,0.2),ik(t,WS.H[10]-0.06,0.2)]); } X.restore(); } }
function hookTag(t){ if(t>T_P2) return; const k=ik(t,0.15,0.3)*(1-pr(t,T_P2-0.35,T_P2-0.1)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.fillStyle='rgba(255,255,255,0.94)'; rr(48,370,268,40,20); X.fill(); X.fillStyle=PURPLE; X.beginPath(); X.arc(74,390,7,0,7); X.fill();
  injLatin('REAL FOOTAGE',192,391,21,PURPLE,'center',800,3);
  const ks=ik(t,WS.H[0]+0.2,0.3); if(ks>0){ X.globalAlpha=k*ks; const s='Kerr et al. · Am J Sports Med 2010 · 65.5%'; X.font='700 22px Inter, '+FONT; const tw=X.measureText(s).width+40;
    X.fillStyle='rgba(10,10,12,0.66)'; rr(1032-tw,370,tw,40,20); X.fill(); X.strokeStyle='rgba(199,125,219,0.4)'; X.lineWidth=2; rr(1032-tw,370,tw,40,20); X.stroke(); injLatin(s,1032-tw/2,391,22,'#D9A6E8','center',700); }
  X.restore(); }
function ringLabel(t){ if(!RING.length||t<RING[0][0]||t>RING[RING.length-1][0]+0.2) return;
  let r=RING[0]; for(const q of RING){ if(q[0]<=t) r=q; } const k=Math.min(1,r[4]*1.4)*ik(t,RING[0][0]+0.15,0.25); if(k<=0) return;
  const ax=r[1]+r[3]*0.72, ay=r[2]-r[3]*0.70, lx=ax+70, ly=ay-60;
  X.save(); X.globalAlpha=k; X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(ax,ay); X.lineTo(lx,ly); X.lineTo(lx+40,ly); X.stroke();
  X.fillStyle=LIL; X.beginPath(); X.arc(ax,ay,6,0,7); X.fill(); X.restore();
  X.save(); X.globalAlpha=k; nkGlassPill(lx+40+92,ly,'القبضة',k,40); X.restore(); }

/* 2) Ahmad's layer: his two checks above his head (P3), the sources behind him, then he is drawn over them */
const ORB={cx:540,cy:1075,rx:300,ry:90,w:2*Math.PI/5.5,lift:[-70,5,80]};
function orbitDraw(t,items,front,s0,e0){ if(t<s0||t>=e0) return; const out=1-pr(t,e0-0.3,e0);
  items.forEach((it,ix)=>{ it.dy=ORB.lift[ix%3]; const k=ik(t,it.at-0.06,0.32); if(k<=0) return; const th=Math.PI/2-0.55+ORB.w*(t-it.at), d=Math.sin(th);
    if((d>=0)!==front) return; const x=ORB.cx+ORB.rx*Math.cos(th), y=ORB.cy+ORB.ry*d+(it.dy||0), sc=0.74+0.30*(d+1)/2;
    X.save(); X.globalAlpha=out*(front?1:0.62); X.translate(x,y); X.scale(sc,sc); X.translate(-x,-y);
    const fs=it.size||34; X.font='800 '+fs+'px Inter, '+FONT; const w=X.measureText(it.text).width+fs*1.9, h=fs*2.1;
    X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(x,y+(1-ease(k))*18); glassPane(-w/2,-h/2,w,h,h/2,{}); X.fillStyle=LIL; X.beginPath(); X.arc(-w/2+fs*0.75,0,6,0,7); X.fill(); injLatin(it.text,fs*0.3,2,fs,'#FFFFFF','center',800); X.restore();
    X.restore(); }); }
const SRC_S=T_C1OUT+0.45, SRC_E=T_C2IN+0.1;
const STUDIES=()=>[{text:'Am J Sports Med 2010',at:SRC_S},{text:'J Forensic Sci 2007',at:SRC_S+0.9},{text:'JMU · Exercise Technique',at:SRC_S+1.8}];
const ON_CAM=t=>(t>=T_P2&&t<T_C1IN+0.25)||(t>=T_C1OUT&&t<T_C2IN+0.25)||(t>=T_C2OUT&&t<VEND);
function checkPill(cx,cy,text,k,fs){ if(k<=0) return; fs=fs||44; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.3, x=cx-w/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18); glassPane(x,cy-h/2,w,h,h/2,{});
  X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,cy,h/2-12,0,7); X.fill();
  X.strokeStyle='#FFFFFF'; X.lineWidth=5; X.lineCap='round'; X.lineJoin='round'; const c=[x+w-h/2,cy]; X.beginPath(); X.moveTo(c[0]-11,c[1]+1); X.lineTo(c[0]-3,c[1]+9); X.lineTo(c[0]+12,c[1]-9); X.stroke();
  nkTxt(text,x+w-h-6,cy+3,fs,'#FFFFFF','right'); X.restore(); }
function ahmadBack(t){ if(!ON_CAM(t)) return;
  if(t>=T_C1OUT&&t<T_C2IN+0.25){ const out=1-ease(pr(t,T_C2IN-0.15,T_C2IN+0.1));   /* above his head: his hair never rises above y 355 here */
    checkPill(540,206,'القبضة صحيحة',ik(t,WS.P3[5]-0.1,0.35)*out,44); checkPill(540,296,'إيدك ناشفة',ik(t,WS.P3[7]-0.1,0.35)*out,44); }
  orbitDraw(t,STUDIES(),false,SRC_S,SRC_E);
  const inDis=t<T_P2+0.1;     /* the dissolve is in the frames */
  if(PRS_OK&&!inDis) X.drawImage(PRS,0,0,W,H); }
function ahmadFront(t){ orbitDraw(t,STUDIES(),true,SRC_S,SRC_E); }

/* 3) P2: the episode's name on liquid glass (no diagnosis is claimed: the footage shows the drop, not the injury) */
function titleCard(t){ if(t<T_P2||t>T_C1IN+0.3) return; const k=ik(t,T_P2+0.12,0.4), out=1-pr(t,T_C1IN-0.25,T_C1IN+0.05); if(k<=0||out<=0) return;
  const x=100,y=1170+(1-k)*60,w=830,h=270; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{});
  X.fillStyle=PURPLE; rr(x+w-20,y+38,8,h-76,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-54,y+62,24,LIL,'right',800,3);
  injLatin(INJ_EP.name,x+w-52,y+132,48,'#FFFFFF','right',900);
  nkTxt(INJ_EP.ar,x+w-52,y+208,58,LIL,'right'); X.restore(); }

/* 4) the dark canvas; C1 carries the radiograph film */
const FILM={x:214,y:488,w:652,h:820};
function medBg(t){ const a=CANA(t); if(a<=0) return; X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,900,40,560,900,900); g.addColorStop(0,'rgba(118,2,138,0.50)'); g.addColorStop(0.55,'rgba(75,1,88,0.16)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  X.restore(); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al,out){ const k1=ik(t,at,0.25)*(out===undefined?1:out), k2=ik(t,at+0.18,0.3)*(out===undefined?1:out); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.globalAlpha*=Math.min(1,k1*1.5); X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2/Math.max(0.001,Math.min(1,k1*1.5)); const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }

/* 5) the grip, drawn in the series' ink (client, 15 Nov: «نفس الرسم القديم اللي كنا نرسم فيه… ما بدنا نطلع عن هوية نايترون…
   اتأكد من البار نفسه بالأول، بعدين أكّد على الإيد، إنه ماسكة صحيح للبار، ما تحط الإيد جوّا البار، ومو يمسكه مطرح ما بينحط
   الوزن»). First the whole barbell, front view, line by k5line, its grip zones (the knurling, between the collars) in lilac;
   then into the right-hand grip, seen from the side along the bar: the bar's section first, then the forearm and the palm
   against it, the fingers round it, the thumb. Nothing crosses the bar: every finger runs outside its outline.
   ١ the thumb beside the bar, not round it (the closed thumb as a dashed lilac ghost) · ٢ the wrist folds back under the
   load · ٣ sweat: the bar rolls out of the open side of the hand and falls. */
function k5len(pts){ let L=0; for(let i=1;i<pts.length;i++) L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return L; }
function k5part(pts,k){ if(k>=1) return pts; const L=k5len(pts)*Math.max(0,k), o=[pts[0]]; let acc=0;
  for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); if(acc+d>=L){ const u=(L-acc)/Math.max(d,1e-6); o.push([pts[i-1][0]+(pts[i][0]-pts[i-1][0])*u,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*u]); return o; } acc+=d; o.push(pts[i]); } return o; }
function k5line(pts,k,w,col){ if(k<=0) return; const p=k5part(pts,k); X.save(); X.lineCap='round'; X.lineJoin='round'; X.strokeStyle=col; X.lineWidth=w; X.beginPath(); p.forEach((q,i)=>i?X.lineTo(q[0],q[1]):X.moveTo(q[0],q[1])); X.stroke(); X.restore(); }
const K5INK='rgba(236,230,242,0.92)', K5FILL='#241c2b';
function k5tube(pts,k,w,hot){ if(k<=0) return; k5line(pts,k,w+8,hot?LIL:K5INK); k5line(pts,k,w,K5FILL); }     /* an outlined limb, drawn along its length */
function k5shape(pts,k,hot,fa){ if(k<=0) return; X.save(); X.lineJoin='round'; const P_=new Path2D(); pts.forEach((q,i)=>i?P_.lineTo(q[0],q[1]):P_.moveTo(q[0],q[1])); P_.closePath();
  const f=Math.max(0,(k-0.6)/0.4)*(fa===undefined?1:fa); if(f>0){ X.globalAlpha*=f; X.fillStyle=K5FILL; X.fill(P_); X.globalAlpha/=f; }
  const L=k5len(pts.concat([pts[0]])); X.strokeStyle=hot?LIL:K5INK; X.lineWidth=4; X.setLineDash([L*Math.min(1,k)+0.01,L+10]); X.stroke(P_); X.restore(); }
function k5circ(cx,cy,r,k,fill,col,lw){ if(k<=0) return; X.save(); if(fill&&k>0.6){ X.globalAlpha*=Math.min(1,(k-0.6)/0.4); X.fillStyle=fill; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill(); X.restore(); X.save(); }
  X.strokeStyle=col||K5INK; X.lineWidth=lw||4; X.lineCap='round'; X.beginPath(); X.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.min(1,k)); X.stroke(); X.restore(); }
/* phase A: the whole barbell, front view — the bar first (client: «اتأكد من البار نفسه بالأول»), its grip zones on the knurling */
function barbell(t,k0,a,wa){ if(a<=0) return; const y=830, kk=u=>pr(t,k0+u[0],k0+u[1]); wa=(wa===undefined?1:wa);
  X.save(); X.globalAlpha*=a;
  k5tube([[214,y],[866,y]],kk([0,0.35]),18,false);
  for(const sd of [-1,1]){ const cx=540, m=x=>cx+sd*(x-cx);
    k5shape([[m(196),y-36],[m(214),y-36],[m(214),y+36],[m(196),y+36]],kk([0.25,0.45]),false);
    k5shape([[m(140),y-222],[m(194),y-222],[m(194),y+222],[m(140),y+222]],kk([0.3,0.55]),false);
    k5shape([[m(110),y-160],[m(140),y-160],[m(140),y+160],[m(110),y+160]],kk([0.38,0.6]),false);
    k5tube([[m(110),y],[m(58),y]],kk([0.45,0.6]),26,false); }
  const kz=kk([0.45,0.75]); if(kz>0){ X.save(); X.globalAlpha*=kz; X.strokeStyle=LIL; X.lineWidth=2.5; const WA=wa;
    for(const [x0,x1] of [[270,430],[650,810]]){ for(let x=x0;x<=x1;x+=11){ X.beginPath(); X.moveTo(x,y-7); X.lineTo(x+7,y+7); X.stroke(); }
      X.lineWidth=4; X.beginPath(); X.moveTo(x0,y-46); X.lineTo(x0,y-56); X.lineTo(x1,y-56); X.lineTo(x1,y-46); X.stroke(); X.lineWidth=2.5; }
    X.save(); X.globalAlpha*=WA; nkTxt('مكان المسكة',540,y-110,46,'#FFFFFF','center'); X.strokeStyle='rgba(199,125,219,0.7)'; X.lineWidth=3;
    for(const x of [350,730]){ X.beginPath(); X.moveTo(540+(x<540?-100:100),y-110); X.lineTo(x,y-62); X.stroke(); }
    nkTxt('على الخشونة · بعيد عن الأوزان',540,y+330,32,LIL,'center',1,800); X.restore(); X.restore(); }
  X.restore(); }
/* the close-up, front view (client, 15 Nov: «شكل الإيد بدّه تحسين، مو باينة إيد»): the classic grip picture, seen from his feet:
   the bar across, the four fingers curled over it toward us (each finger its own outline, two creases), the palm and the
   thumb's pad under the bar, the forearm below. Thumbless: the thumb goes up beside the index and over the top of the bar,
   it never crosses in front of the fingers; the closed thumb (a dashed lilac ghost) crosses in front of the fingertips.
   The fingers are drawn after the bar, in front of it: they wrap it, nothing goes into it. */
const HB={y:800,r:40}, WR=[548,1062];
const FG=[[500,46,738,884],[549,48,730,892],[598,45,738,884],[643,38,756,868]];       // cx, width, top (knuckle), bottom (tip)
const PALM=[[470,1062],[452,980],[444,880],[450,770],[668,770],[662,880],[640,1000],[628,1062]];
const TH_OFF=[[462,1000],[438,905],[436,820],[452,758],[478,728]],   /* behind the bar, its tip peeking over the top beside the index */ TH_ON=[[462,1000],[478,930],[540,898],[602,880]];
function xrState(t){ const a1=WS.P2[9]-0.1, a2=WS.P2[13]-0.15, a2e=WE.P2[17], a3=WS.P2[21]-0.05, tOut=a3+0.30;
  const th=ease(pr(t,a2,a2e)), slip=ease(pr(t,a3,a3+0.30));
  let barY=HB.y+150*slip; if(t>tOut){ const u=t-tOut; barY=HB.y+150+380*u+0.5*5200*u*u; }
  return {a1,a2,a2e,a3,tOut,th,slip,barY,strain:ik(t,a2+0.3,0.5)*(1-pr(t,a3+0.4,a3+0.9)),load:ik(t,WS.P2[16]-0.15,0.3)*(1-pr(t,a3-0.1,a3+0.15)),sweat:ik(t,WS.P2[18]-0.1,0.4)*(1-pr(t,tOut,tOut+0.2))}; }
function finger(cx,w,y0,y1,k,hot){ if(k<=0) return; const r=w/2; X.save(); X.globalAlpha*=Math.min(1,k*1.4); X.translate(0,(1-ease(k))*-18);
  X.beginPath(); X.moveTo(cx-r,y0+r); X.arc(cx,y0+r,r,Math.PI,0); X.lineTo(cx+r,y1-r); X.arc(cx,y1-r,r,0,Math.PI); X.closePath();
  X.fillStyle=K5FILL; X.fill(); X.strokeStyle=hot?LIL:K5INK; X.lineWidth=4; X.stroke();
  X.strokeStyle='rgba(236,230,242,0.45)'; X.lineWidth=2.5; for(const cy of [HB.y-12,(HB.y+y1)/2+8]){ X.beginPath(); X.arc(cx,cy-r*0.9,r*1.05,Math.PI*0.32,Math.PI*0.68); X.stroke(); }   // the joint creases
  X.restore(); }
function xray(t){ const a=CAN1(t); if(a<=0||t<T_C1IN) return; const S=xrState(t), t0=T_C1IN+0.05;
  X.save(); X.globalAlpha=a;
  /* A → B: the whole barbell, then a push into the right-hand grip zone */
  const zm=ease(pr(t,t0+0.68,t0+0.98));
  if(zm<1){ X.save(); const z=1+2.2*zm; X.translate(730,830); X.scale(z,z); X.translate(-730,-830); barbell(t,t0,1-zm,1-Math.min(1,zm*4)); X.restore(); }
  const ks=ease(pr(t,t0+0.82,t0+1.02)); if(ks<=0){ X.restore(); return; }
  const k=u=>pr(t,t0+u[0],t0+u[1]);
  X.save(); X.globalAlpha*=ks;
  /* the forearm (fixed) */
  { const g=X.createLinearGradient(0,WR[1],0,1290); g.addColorStop(0,K5INK); g.addColorStop(0.55,K5INK); g.addColorStop(1,'rgba(236,230,242,0)');   /* the forearm's lines fade out downward: no box */
    k5line([[470,WR[1]],[476,1300]],k([0.95,1.2]),4,g); k5line([[628,WR[1]],[640,1300]],k([0.95,1.2]),4,g); }
  /* the hand folds back at the wrist: seen from the front it shortens (foreshortening) */
  const fs=1-0.34*S.th;
  X.save(); X.translate(WR[0],WR[1]); X.scale(1,fs); X.translate(-WR[0],-WR[1]);
    k5shape(PALM,k([1.0,1.35]),false);
    k5tube(TH_OFF,k([1.45,1.85]),44,S.a1<t&&t<S.a2);                  // thumbless: behind the bar, never across the fingers
    { const kp=k([1.2,1.45]); if(kp>0){ X.save(); X.globalAlpha*=kp; X.strokeStyle='rgba(236,230,242,0.5)'; X.lineWidth=3; X.beginPath(); X.ellipse(478,985,34,62,-0.15,-1.3,1.6); X.stroke(); X.restore(); } }   // the thumb's pad
  X.restore();
  /* the bar (behind the fingers): the hand holds it; when it slips it slides down behind them and drops */
  { const by=WR[1]-(WR[1]-S.barY)*(S.slip>0?1:fs), kb=k([0.85,1.05])*(1-pr(t,S.tOut,S.tOut+0.16)); if(kb>0){ X.save(); X.globalAlpha*=kb;
      const g=X.createLinearGradient(0,by-HB.r,0,by+HB.r); g.addColorStop(0,'#5a5560'); g.addColorStop(0.35,'#c9ccd2'); g.addColorStop(0.55,'#8d9098'); g.addColorStop(1,'#3a3440'); X.fillStyle=g; X.fillRect(0,by-HB.r,W,2*HB.r);
      X.strokeStyle=K5INK; X.lineWidth=4; X.beginPath(); X.moveTo(0,by-HB.r); X.lineTo(W,by-HB.r); X.moveTo(0,by+HB.r); X.lineTo(W,by+HB.r); X.stroke();
      X.strokeStyle='rgba(199,125,219,0.55)'; X.lineWidth=2; for(let x=-40;x<W+40;x+=16){ X.beginPath(); X.moveTo(x,by-HB.r+6); X.lineTo(x+14,by+HB.r-6); X.stroke(); }   // knurling
      if(t>S.tOut){ X.strokeStyle='rgba(236,230,242,0.35)'; X.lineWidth=3; for(const dx of [300,540,780]){ X.beginPath(); X.moveTo(dx,by-HB.r-24); X.lineTo(dx,by-HB.r-90); X.stroke(); } }
      X.restore(); } }
  X.save(); X.translate(WR[0],WR[1]); X.scale(1,fs); X.translate(-WR[0],-WR[1]);
    /* the fingers, curled over the bar toward us; they give as it slips (the tips lift) */
    FG.forEach((f,i)=>finger(f[0],f[1],f[2],f[3]-26*S.slip,k([1.15+i*0.08,1.45+i*0.08]),false));
    const kg=ik(t,S.a1+0.45,0.35)*(1-pr(t,S.a2-0.25,S.a2+0.05)); if(kg>0){ X.save(); X.globalAlpha*=kg; X.setLineDash([16,12]); k5line(TH_ON,1,52,'rgba(199,125,219,0.9)'); X.setLineDash([]); k5line(TH_ON,1,40,'rgba(36,28,43,0.55)'); X.restore(); }
    if(S.sweat>0){ [[500,850],[549,860],[598,846],[643,840],[520,940],[590,960],[470,900]].forEach((p,i)=>{ const tw_=0.55+0.45*Math.sin(t*9+i*1.7);
      X.save(); X.globalAlpha*=S.sweat*tw_; X.fillStyle='#FFFFFF'; X.beginPath(); X.ellipse(p[0],p[1],5,8,0,0,7); X.fill(); X.strokeStyle=LIL; X.lineWidth=2; X.stroke(); X.restore(); }); }
  X.restore();
  /* the wrist folding back: an arrow round it, a lilac heat */
  if(S.strain>0){ X.save(); X.globalCompositeOperation='lighter'; const g=X.createRadialGradient(WR[0],WR[1],6,WR[0],WR[1],150); g.addColorStop(0,`rgba(255,255,255,${0.10*S.strain})`); g.addColorStop(0.35,`rgba(199,125,219,${0.30*S.strain})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(WR[0]-160,WR[1]-160,320,320); X.restore();
    const ka=ik(t,S.a2+0.1,0.4)*(1-pr(t,S.a3-0.2,S.a3+0.1)); if(ka>0){ X.save(); X.globalAlpha*=ka; X.strokeStyle=LIL; X.lineWidth=6; X.lineCap='round'; X.beginPath(); X.arc(WR[0]+150,WR[1]-40,70,Math.PI*0.9,Math.PI*0.9+1.9*ka); X.stroke();
      const e=Math.PI*0.9+1.9*ka, ex=WR[0]+150+70*Math.cos(e), ey=WR[1]-40+70*Math.sin(e); X.fillStyle=LIL; X.beginPath(); X.arc(ex,ey,9,0,7); X.fill(); X.restore(); } }
  X.restore();
  xrOverlay(t,S,a*ks); X.restore(); }
function xrOverlay(t,S,a){ X.save(); X.globalAlpha=a; const fs=1-0.34*S.th, F=p=>[p[0],WR[1]-(WR[1]-p[1])*fs];
  /* ١ both names, English and Arabic (client: «سويسايد غريب بدها ترجمة… يكتبها الاتنين سوا») */
  { const tp=F([470,736]); injLabel(t,Math.max(S.a1,T_C1IN+1.9)+0.05,tp[0]-20,tp[1],70,tp[1]-170,'Suicide Grip','مسكة بلا إبهام','left',1-pr(t,S.a2-0.3,S.a2)); }
  { const gp=F([600,884]); injLabel(t,S.a1+0.75,gp[0]+18,gp[1]+6,1012,gp[1]+150,'Closed grip','المسكة الصح','right',1-pr(t,S.a2-0.3,S.a2)); }   /* the dashed ghost: where the thumb belongs */
  if(S.load>0){ const bx=560, by=F([0,HB.y])[1]; X.save(); X.globalAlpha*=S.load; X.strokeStyle='#FFFFFF'; X.lineWidth=6; X.lineCap='round';
    X.beginPath(); X.moveTo(bx,by-300); X.lineTo(bx,by-130); X.stroke(); X.fillStyle='#FFFFFF'; X.beginPath(); X.moveTo(bx-18,by-138); X.lineTo(bx+18,by-138); X.lineTo(bx,by-110); X.closePath(); X.fill();
    nkTxt('الوزن',bx+30,by-250,40,'#FFFFFF','left'); X.restore(); }
  injLabel(t,S.a2+0.35,WR[0]-70,WR[1]-10,70,WR[1]+90,'Wrist bent back','الرسغ انطوى لورا','left',1-pr(t,S.a3-0.3,S.a3));   /* left: the right column is under Instagram's buttons */
  const kf=ik(t,S.tOut+0.08,0.3); if(kf>0){ X.save(); X.globalAlpha*=kf; nkTxt('البار وقع عليه',540,600+(1-kf)*10,48,'#FFFFFF','center'); X.restore(); }
  X.restore(); }

/* 6) the step pills (what went wrong), the chapter headers */
function stepPillW(n,text,fs){ X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4; X.restore(); return w; }
function stepPill(cx,cy,n,text,k,fs,active){ if(k<=0) return; fs=fs||46; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4, x=cx-w/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18); glassPane(x,cy-h/2,w,h,h/2,{});
  if(active){ X.strokeStyle='rgba(199,125,219,0.9)'; X.lineWidth=3; rr(x+1.5,cy-h/2+1.5,w-3,h-3,h/2); X.stroke(); }
  X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,cy,h/2-12,0,7); X.fill(); nkTxt(n,x+w-h/2,cy+4,fs*0.8,'#FFFFFF','center'); nkTxt(text,x+w-h-6,cy+3,fs,'#FFFFFF','right'); X.restore(); }
function canvasText(t){ const a1=CAN1(t), a2=CAN2(t);
  if(a1>0){ X.save(); X.globalAlpha=a1; chapter(t,T_C1IN+0.05,T_C1OUT+0.2,'WHY THE BAR FELL','ليش وقع البار؟');
    const S=xrState(t), P_=[['١','مسكة بلا إبهام',S.a1],['٢','رسغ ضعيف',S.a2],['٣','قبضة زلقة',WS.P2[18]-0.1]], fs=32, gap=18;
    const ws=P_.map(p=>stepPillW(p[0],p[1],fs)), tot=ws.reduce((x,y)=>x+y,0)+gap*2; let x=540+tot/2;
    P_.forEach((p,i)=>{ const cx=x-ws[i]/2; x-=ws[i]+gap; const cur=(i===2?t>=p[2]:(t>=p[2]&&t<P_[i+1][2])); stepPill(cx,440,p[0],p[1],ik(t,p[2],0.35),fs,cur); });
    X.restore(); }
  if(a2>0){ X.save(); X.globalAlpha=a2; chapter(t,T_C2IN+0.05,T_C2OUT+0.2,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟'); X.restore(); } }
function chapterDots(t){ const a=CANA(t); if(a<=0) return; const done=CAN1(t)>0?1:2;
  X.save(); X.globalAlpha=a; ['١','٢'].forEach((n,i)=>{ const x=540+(0.5-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<1){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

/* 7) C2: the spotter (drawn), then the wrist wrap the moment he names it */
/* the spotter, drawn in the series' ink (v4, client: «إذا بترجع للفريم اللي عم ينزل ويرفع فيه البار… بتلاقيه عم يعمل كوعه لورا…
   لا حركة صحيحة ولا شي صحيح… راجع فريم باي فريم»). Bodies are tapered capsules joined into one silhouette (each group is
   outlined as a union: a light pass a few px wider, then the dark fill), with real proportions. Every limb is a two-bone
   chain solved each frame, and the bend is chosen anatomically: the lifter's elbows drop toward the floor, the spotter's
   elbows hang down and his knees go forward. The bar follows a bench press J-curve: from over the shoulders to the lower
   chest; it stalls there, the spotter hinges at the hips and bends his knees, takes it with both hands and lifts it off. */
function k5cap(P_,A,r1,B,r2){ const dx=B[0]-A[0], dy=B[1]-A[1], d=Math.max(Math.hypot(dx,dy),1e-3), th=Math.atan2(dy,dx), ph=Math.acos(Math.max(-1,Math.min(1,(r1-r2)/d)));
  P_.moveTo(A[0]+r1*Math.cos(th+ph),A[1]+r1*Math.sin(th+ph)); P_.arc(A[0],A[1],r1,th+ph,th+2*Math.PI-ph); P_.arc(B[0],B[1],r2,th-ph,th+ph); P_.closePath(); }
function k5two(S,T,l1,l2,pick){ const dx=T[0]-S[0], dy=T[1]-S[1], d=Math.max(Math.abs(l1-l2)+1,Math.min(Math.hypot(dx,dy),l1+l2-0.5)), a=Math.atan2(dy,dx);
  const c=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))); const e1=[S[0]+l1*Math.cos(a+c),S[1]+l1*Math.sin(a+c)], e2=[S[0]+l1*Math.cos(a-c),S[1]+l1*Math.sin(a-c)];
  return {E:pick(e1,e2), H:[S[0]+d*Math.cos(a),S[1]+d*Math.sin(a)]}; }
const LOWER=(p,q)=>p[1]>q[1]?p:q, FWD=(p,q)=>p[0]>q[0]?p:q;
/* draw a group of parts as one silhouette: parts = list of builders (P_ => …) */
function k5body(parts,k,hot,dim){ if(k<=0) return; const P_=new Path2D(); parts.forEach(f=>f(P_)); X.save(); X.globalAlpha*=Math.min(1,k*1.3); X.translate(0,(1-ease(k))*16);
  X.lineJoin='round'; X.strokeStyle=hot?LIL:(dim?'rgba(236,230,242,0.55)':K5INK); X.lineWidth=8; X.stroke(P_); X.fillStyle=K5FILL; X.fill(P_); X.restore(); }
const capP=(A,r1,B,r2)=>P_=>k5cap(P_,A,r1,B,r2), circP=(c,r)=>P_=>{ P_.moveTo(c[0]+r,c[1]); P_.arc(c[0],c[1],r,0,2*Math.PI); };
const polyP=pts=>P_=>{ pts.forEach((q,i)=>i?P_.lineTo(q[0],q[1]):P_.moveTo(q[0],q[1])); P_.closePath(); };
function spotter(t){ const t0=T_C2IN+0.15, kk=u=>pr(t,t0+u[0],t0+u[1]), tH=WS.P4[5];
  /* the bar: lockout over the shoulders → lower chest (J-curve) → stalls → lifted off and racked */
  const LOCK=[392,769], CHEST=[442,938], RACK=[376,752];          // lockout: arm straight over the shoulder (238 px from it)
  const down=ease(pr(t,t0+0.55,t0+1.25)), lift=ease(pr(t,tH-0.05,tH+0.85));
  const jx=LOCK[0]+(CHEST[0]-LOCK[0])*Math.pow(down,1.6), jy=LOCK[1]+(CHEST[1]-LOCK[1])*down;
  const stall=down*(1-lift), shake=stall*Math.sin(t*34)*3.5*pr(t,t0+1.25,t0+1.4);
  const bar=[jx+(RACK[0]-jx)*lift, jy+(RACK[1]-jy)*lift+shake];
  /* the lifter, lying on the bench, head to the left */
  const SH=[380,1006], HP=[642,1024];
  const l1=124*(1-0.35*down*(1-lift));                                    // the upper arm swings out from the body at the bottom: shorter on a side view
  const arm=k5two(SH,bar,l1,118,LOWER);                                     // elbow toward the floor, forearm under the bar
  /* the spotter at the head of the bench: hinge + knee bend while he reaches, back up as he lifts */
  const reach=ease(pr(t,tH-0.75,tH-0.1)), hinge=0.18+0.55*reach*(1-0.55*lift), sq=reach*(1-0.6*lift);
  const ANK=[188,1212], hip=[176-4*sq,846+26*sq], tor=252, sS=[hip[0]+tor*Math.sin(hinge),hip[1]-tor*Math.cos(hinge)];
  const knee=k5two(hip,ANK,190,186,FWD);                                   // knee a little forward
  const head=[sS[0]+50*Math.sin(hinge*0.8)+8,sS[1]-50*Math.cos(hinge*0.8)];
  const grip=[bar[0]-30,bar[1]+12], ready=[sS[0]+60+(grip[0]-sS[0]-60)*Math.min(1,reach*1.15),sS[1]+150+(grip[1]-sS[1]-150)*Math.min(1,reach*1.15)];
  const sArm=k5two([sS[0]+6,sS[1]+14],ready,124,118,LOWER);                 // elbows hang down
  X.save();
  /* floor and bench */
  k5line([[90,1236],[990,1236]],kk([0,0.25]),3,'rgba(236,230,242,0.35)');
  k5body([polyP([[262,1060],[722,1060],[722,1092],[262,1092]]),capP([300,1092],9,[300,1234],9),capP([690,1092],9,[690,1234],9)],kk([0.02,0.3]),false);
  /* the spotter (behind the lifter's head, a step deeper in the picture) */
  k5body([capP(hip,40,sS,46),capP(hip,30,knee.E,24),capP(knee.E,24,ANK,15),capP(ANK,13,[ANK[0]+58,ANK[1]+14],11),capP(sS,15,head,12),circP(head,34)],kk([0.18,0.45]),false,true);
  k5body([capP([sS[0]+6,sS[1]+14],18,sArm.E,15),capP(sArm.E,15,sArm.H,11),circP(sArm.H,15)],kk([0.3,0.55]),lift>0.02||reach>0.6,true);
  /* the lifter */
  k5body([polyP([[350,1058],[350,990],[372,968],[436,952],[520,962],[600,984],[668,1000],[676,1058]]),capP([330,1018],13,[362,1010],15),circP([302,1020],34),
          capP(HP,34,[818,1004],25),capP([818,1004],24,[836,1206],16),capP([836,1210],13,[898,1224],11)],kk([0.1,0.38]),false);
  k5body([capP(SH,20,arm.E,16),capP(arm.E,16,arm.H,12),circP(arm.H,16)],kk([0.25,0.5]),false);
  /* the bar from the side: the shaft's end and its plate, in front (the plate kept light so the hands read through it) */
  const kb=kk([0.3,0.55]); if(kb>0){ X.save(); X.globalAlpha*=kb; X.fillStyle='rgba(36,28,43,0.55)'; X.beginPath(); X.arc(bar[0],bar[1],82,0,7); X.fill(); X.strokeStyle=K5INK; X.lineWidth=5; X.stroke();
    X.strokeStyle='rgba(199,125,219,0.8)'; X.lineWidth=3; X.beginPath(); X.arc(bar[0],bar[1],62,0,7); X.stroke(); X.fillStyle='#cfd3d9'; X.beginPath(); X.arc(bar[0],bar[1],14,0,7); X.fill(); X.strokeStyle=K5INK; X.lineWidth=3; X.stroke(); X.restore(); }
  /* the danger while it sits on him */
  const kd=stall*pr(t,t0+1.2,t0+1.4); if(kd>0.05){ X.save(); X.globalCompositeOperation='lighter'; const g=X.createRadialGradient(CHEST[0]-40,CHEST[1]+40,6,CHEST[0]-40,CHEST[1]+40,130); g.addColorStop(0,`rgba(199,125,219,${0.45*kd})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(CHEST[0]-180,CHEST[1]-100,280,280); X.restore(); }
  X.restore();
  checkPill(700,560,'السبوتر بيشيل البار',ik(t,tH-0.05,0.35),38); }
const SP_E=WS.P4[8]-0.15;   /* the spotter until «وإذا بدك», then the wrist wrap */
function protect(t){ const a=CAN2(t); if(a<=0) return; X.save(); X.globalAlpha=a;
  /* the record: neck compression by a barbell (one k5line, under the header) */
  const ks=ik(t,T_C2IN+0.35,0.35)*(1-pr(t,SP_E-0.25,SP_E)); if(ks>0){ X.save(); X.globalAlpha*=ks; nkTxt('بأمريكا: ١١ وفاة على الأقل من بار ضغط على الرقبة (١٩٩٩–٢٠٠٢)',540,438,30,LIL,'center',1,800); X.restore(); }
  const kv=ik(t,T_C2IN+0.1,0.3)*(1-pr(t,SP_E-0.2,SP_E+0.1)); if(kv>0){ X.save(); X.globalAlpha*=kv; spotter(t); X.restore(); }
  /* the wrap: the line opens the card, the product lands with its name */
  const kp=ik(t,SP_E,0.35); if(kp>0){ const x=150,y=486+(1-kp)*40,w=780,h=810; X.save(); X.globalAlpha*=Math.min(1,kp*1.6); glassPane(x,y,w,h,44,{});
    X.fillStyle=PURPLE; rr(x+w-20,y+40,8,h-80,4); X.fill();
    nkTxt('حماية أكبر للرسغ',x+w-54,y+64,36,LIL,'right',1,800);
    const ki=ik(t,SP_E+0.1,0.45);   /* the photo comes with the card: never an empty glass panel */ if(ki>0&&BIM.naturalWidth){ const ih=500, iw=ih*BIM.naturalWidth/BIM.naturalHeight; X.save(); X.globalAlpha*=ki; X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=40; X.shadowOffsetY=18;
      X.drawImage(BIM,540-iw/2,y+120+(1-ki)*24,iw,ih); X.restore(); }
    const kn=ik(t,WS.P4[14]-0.08,0.3); if(kn>0){ X.save(); X.globalAlpha*=kn; nkTxt('مشدّ المعصم',540,y+680+(1-kn)*14,64,'#FFFFFF','center'); X.restore(); }
    const kc=ik(t,WS.P4[15]-0.05,0.3); if(kc>0){ X.save(); X.globalAlpha*=kc; nkTxt('سند إضافي للرسغ — مع القبضة الصح والسبوتر',540,y+756,30,LIL,'center',1,800); X.restore(); }
    X.restore(); }
  X.restore(); }

/* 8) P5: his last line on liquid glass; the card opens with it */
function takeaway(t){ if(t<T_P5||t>=VEND) return; const k=ik(t,WS.P5[0]-0.1,0.4), out=1-pr(t,VEND-0.3,VEND); if(k<=0||out<=0) return;
  const k2=ik(t,WS.P5[0]-0.05,0.3), k3=ik(t,WS.P5[2]-0.08,0.3), k4=ik(t,WS.P5[6]-0.08,0.3), g=ik(t,WS.P5[2]-0.25,0.4);
  const x=100,y=1170+(1-k)*60,w=830,h=170+120*g; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{}); X.fillStyle=PURPLE; rr(x+w-20,y+30,8,h-60,4); X.fill();
  nkTxt('تذكّر',x+w-54,y+52,32,LIL,'right',1,800);
  if(k2>0){ X.save(); X.globalAlpha*=k2; nkTxt('احمي حالك',x+w-52,y+124+(1-k2)*16,72,'#FFFFFF','right'); X.restore(); }
  if(k3>0){ X.save(); X.globalAlpha*=k3; X.font='900 46px '+FONT; rtlLine([['قبل أن تصير','#FFFFFF',46],['من','#FFFFFF',46],['الثلثين',LIL,56]],x+w-52-(X.measureText('قبل أن تصير من الثلثين').width+40)/2,y+222+(1-k3)*14,46,[1,1,k4]); X.restore(); }
  X.restore(); }

/* sources: every medical claim shows where it came from, while it is said */
const INJ_SRC=[{s:WS.P2[9]-0.1,e:WS.P2[13]-0.25,text:'المصدر: James Madison Univ. — Exercise Technique & Spotting'},
  {s:T_C2IN+0.35,e:WS.P4[8]-0.2,text:'المصدر: Jumbelic — J Forensic Sci 2007 · CPSC'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ if(t<c.s||t>c.e) return; const k=ik(t,c.s,0.3)*(1-pr(t,c.e-0.2,c.e)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.font='700 24px Inter, '+FONT; const tw=X.measureText(c.text).width+52; X.fillStyle='rgba(10,10,12,0.68)'; rr(540-tw/2,1450,tw,44,22); X.fill();
  X.strokeStyle='rgba(199,125,219,0.35)'; X.lineWidth=2; rr(540-tw/2,1450,tw,44,22); X.stroke();
  X.fillStyle='#D9A6E8'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(c.text,540,1473); X.restore(); }); }

SCENE_LIST.push(['ahmadBack',ahmadBack,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['xray',xray]);
SCENE_LIST.push(['protect',protect]);
SCENE_LIST.push(['canvasText',canvasText]);
SCENE_LIST.push(['chapterDots',chapterDots]);
SCENE_LIST.push(['titleCard',titleCard]);
SCENE_LIST.push(['ahmadFront',ahmadFront]);
SCENE_LIST.push(['takeaway',takeaway]);
SCENE_LIST.push(['srcLine',srcLine]);

/* end card: fades in (no flash): the one thing to do with this video, the logo, the series tag, the sources */
outro=function(t){ const s=VEND; if(t<s) return; const a=ease(pr(t,s,s+0.3));   /* after his last word, never over it (and never over the video: Instagram's right column) */ X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k0=ik(t,s+0.1,0.4); if(k0>0){ X.globalAlpha=k0; nkTxt('ابعتها لصاحبك',540,560+(1-k0)*16,96,'#FFFFFF','center'); nkTxt('اللي بيلعب بنش بلا سبوتر',540,668+(1-k0)*16,56,LIL,'center'); }
  const k1=ik(t,s+0.3,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=560, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,900-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.5,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-190*k2,1016,380*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1088,34,LIL,'center',800,6); injLatin('EP 05 / 10',540,1140,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1300,30,LIL,'center');
    ['Kerr, Collins & Comstock — Am J Sports Med 2010;38(4):765–71','Jumbelic — Traumatic asphyxia in weightlifters, J Forensic Sci 2007','James Madison University — Exercise Technique & Spotting'].forEach((s2,i)=>injLatin(s2,540,1348+i*34,22,'rgba(255,255,255,0.75)','center',600)); }
  X.restore(); };
