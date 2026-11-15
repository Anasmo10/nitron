/* ═══ NITRON — INJURY BREAKDOWN · EP 05 «Barbell Drop · Bench Press» ═══
   Client, 14 Nov: Ahmad cut out frame by frame with no trace of the cloth; the hook is only the moment the bar falls on
   the man (everything after it cut, every text on the source removed); the Nitron look throughout.
   H    the bench press, slowed while the bar rolls out of his hands, a ring on his grip · Ahmad's «ثلثين الإصابات اللي بتوصل
        للإسعاف بتكون لأنه الوزن وقع على صاحبه» over it, with its study (Kerr et al., Am J Sports Med 2010: 65.5%)
   P2   Ahmad: the episode's name on glass → the X-ray canvas: a lateral radiograph of a hand pressing the bar.
        ١ no thumb round the bar (the closed thumb shown as a ghost) · ٢ the wrist folds back under the load ·
        ٣ a slippery grip: the bar rolls out of the open side of the hand and falls
   P3   Ahmad (after the cut under the canvas): his two checks above his head, the sources orbit him
   P4   (under the protection canvas) the real spotter lifting the bar off him + the neck-compression deaths on record;
        then the wrist wrap (BIMute) the moment he names it
   P5   his last line on glass (no caption) → end card.
   The T_*, WS/WE, XG and RING constants above this line come from gen5.py. */
const PURPLE='#76028A', LIL='#C77DDB';
SCENES=[{s:0,e:T_C1IN+0.3,m:R_FULL,nocap:true},{s:T_C1IN+0.3,e:T_P3,m:R_FULL},{s:T_P3,e:T_C2IN+0.1,m:R_FULL,nocap:true},{s:T_C2IN+0.1,e:T_P5,m:R_FULL},{s:T_P5,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'05',name:'Barbell Drop · Bench Press',ar:'سقوط البار بالبنش برس'};
const XR={fore:nkUse('x5_fore.png'),hand:nkUse('x5_hand.png'),toff:nkUse('x5_thumb_off.png'),ton:nkUse('x5_thumb_on.png'),bar:nkUse('x5_bar.png')};
const BIM=nkUse('bimute.png');
const SPOT=[]; for(let i=0;i<99;i++) SPOT.push(nkUse('spot/'+String(i).padStart(3,'0')+'.jpg'));
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
let TH_OFF=null, TH_ON=null;

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
  if(CAN1(t)>0){ X.globalAlpha=CAN1(t); X.save(); X.shadowColor='rgba(118,2,138,0.55)'; X.shadowBlur=60; X.fillStyle='rgba(5,6,12,0.96)'; rr(FILM.x,FILM.y,FILM.w,FILM.h,26); X.fill(); X.restore();
    X.strokeStyle='rgba(199,125,219,0.32)'; X.lineWidth=2; rr(FILM.x,FILM.y,FILM.w,FILM.h,26); X.stroke(); }
  X.restore(); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al,out){ const k1=ik(t,at,0.25)*(out===undefined?1:out), k2=ik(t,at+0.18,0.3)*(out===undefined?1:out); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.globalAlpha*=Math.min(1,k1*1.5); X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2/Math.max(0.001,Math.min(1,k1*1.5)); const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }

/* 5) the radiograph, moving. Layer space 1000×1400 → screen: scale 1.3 */
const XS=1.3, XO=[-136,-50];     /* the hand and the bar fill the film; the forearm runs out of its bottom edge */
const L2S=(x,y)=>[XO[0]+x*XS, XO[1]+y*XS];
const PV=XG.wrist, B0=XG.bar;
function rot(p,th){ const dx=p[0]-PV[0], dy=p[1]-PV[1]; return [PV[0]+dx*Math.cos(th)+dy*Math.sin(th), PV[1]-dx*Math.sin(th)+dy*Math.cos(th)]; }
function xrState(t){ const a1=WS.P2[9]-0.1, a2=WS.P2[13]-0.15, a2e=WE.P2[17], a3=WS.P2[21]-0.05;
  const th=0.55*ease(pr(t,a2,a2e));
  const slip=ease(pr(t,a3,a3+0.26)), tOut=a3+0.26;
  let bar=rot([B0[0]+92*slip,B0[1]+72*slip],th);
  if(t>tOut){ const u=t-tOut, p0=rot([B0[0]+92,B0[1]+72],th); bar=[p0[0]+260*u, p0[1]+120*u+0.5*5200*u*u]; }
  return {th,bar,a1,a2,a2e,a3,tOut,thumb:ik(t,a1,0.3)*(1-pr(t,a2-0.2,a2+0.1)),strain:ik(t,a2+0.3,0.5)*(1-pr(t,a3+0.4,a3+0.9)),
          sweat:ik(t,WS.P2[18]-0.1,0.4)*(1-pr(t,tOut,tOut+0.2)),load:ik(t,WS.P2[16]-0.15,0.3)*(1-pr(t,a3-0.1,a3+0.15))}; }
function xray(t){ const a=CAN1(t); if(a<=0||t<T_C1IN) return; const S=xrState(t);
  if(!TH_OFF&&XR.toff.naturalWidth){ TH_OFF=tinted(XR.toff,'#C77DDB'); TH_ON=tinted(XR.ton,'#C77DDB'); }
  const scan=ease(pr(t,T_C1IN+0.2,T_C1IN+0.95)), sy=FILM.y+FILM.h*scan;
  X.save(); X.globalAlpha=a; X.beginPath(); rr(FILM.x+3,FILM.y+3,FILM.w-6,FILM.h-6,23); X.clip();
  X.save(); X.beginPath(); X.rect(0,0,W,sy); X.clip();
  X.translate(XO[0],XO[1]); X.scale(XS,XS); X.globalCompositeOperation='lighter';
  const flick=0.96+0.04*Math.sin(t*37)*Math.sin(t*11); X.globalAlpha=a*flick;
  X.drawImage(XR.fore,0,0);
  X.save(); X.translate(PV[0],PV[1]); X.rotate(-S.th); X.translate(-PV[0],-PV[1]);
    X.drawImage(XR.hand,0,0); X.globalAlpha=a*flick*0.8; X.drawImage(XR.toff,0,0);
    if(S.thumb>0&&TH_OFF){ const pulse=0.55+0.25*Math.sin((t-S.a1)*7); X.globalAlpha=a*S.thumb*pulse; X.drawImage(TH_OFF,0,0);
      const kg=ik(t,S.a1+0.45,0.35)*(1-pr(t,S.a2-0.2,S.a2+0.1)); if(kg>0&&TH_ON){ X.globalAlpha=a*kg*(0.30+0.10*Math.sin(t*5)); X.drawImage(TH_ON,0,0); } }
    /* sweat on the palm: small glints where the hand meets the bar */
    if(S.sweat>0){ X.globalCompositeOperation='lighter'; [[505,600],[512,648],[520,690],[568,592],[604,628],[530,566],[596,676]].forEach((p,i)=>{ const tw_=0.5+0.5*Math.sin(t*9+i*1.7);
      const g=X.createRadialGradient(p[0],p[1],1,p[0],p[1],16); g.addColorStop(0,`rgba(255,255,255,${0.95*S.sweat*tw_})`); g.addColorStop(0.4,`rgba(199,125,219,${0.5*S.sweat*tw_})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.globalAlpha=a; X.fillStyle=g; X.fillRect(p[0]-16,p[1]-16,32,32); }); }
  X.restore();
  X.globalAlpha=a*flick; X.drawImage(XR.bar,S.bar[0]-B0[0],S.bar[1]-B0[1]);
  /* the wrist under strain: a lilac heat at the joint */
  if(S.strain>0){ X.globalCompositeOperation='lighter'; const g=X.createRadialGradient(PV[0],PV[1]-20,8,PV[0],PV[1]-20,200); g.addColorStop(0,`rgba(255,255,255,${0.30*S.strain})`); g.addColorStop(0.3,`rgba(199,125,219,${0.42*S.strain})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.globalAlpha=a; X.fillStyle=g; X.fillRect(PV[0]-220,PV[1]-240,440,440); }
  X.restore();
  { const kd=ik(t,T_C1IN+0.9,0.4); if(kd>0){ X.save(); X.globalAlpha=a*kd*0.8; nkTxt('رسم توضيحي',FILM.x+FILM.w-22,FILM.y+FILM.h-26,24,LIL,'right',1,800); X.restore(); } }
  if(scan>0&&scan<1){ const g=X.createLinearGradient(0,sy-40,0,sy+4); g.addColorStop(0,'rgba(199,125,219,0)'); g.addColorStop(1,'rgba(230,200,245,0.85)'); X.fillStyle=g; X.fillRect(FILM.x,sy-40,FILM.w,44); }
  X.restore();
  xrOverlay(t,S,a); }
function xrOverlay(t,S,a){ X.save(); X.globalAlpha=a;
  /* ١ the thumb: not round the bar (the ghost shows where it belongs) */
  { const tp=L2S(...rot([452,612],S.th)); injLabel(t,S.a1+0.1,tp[0]-14,tp[1],70,tp[1]-110,'Thumbless grip','الإبهام مش ملفوف','left',1-pr(t,S.a2-0.3,S.a2)); }
  /* ٢ the load on the bar and the wrist folding back */
  if(S.load>0){ const b=L2S(S.bar[0],S.bar[1]); X.save(); X.globalAlpha*=S.load; X.strokeStyle='#FFFFFF'; X.lineWidth=6; X.lineCap='round';
    X.beginPath(); X.moveTo(b[0],b[1]-250); X.lineTo(b[0],b[1]-78); X.stroke(); X.fillStyle='#FFFFFF'; X.beginPath(); X.moveTo(b[0]-18,b[1]-86); X.lineTo(b[0]+18,b[1]-86); X.lineTo(b[0],b[1]-58); X.closePath(); X.fill();
    nkTxt('الوزن',b[0]+30,b[1]-200,40,'#FFFFFF','left'); X.restore(); }
  { const w=L2S(PV[0],PV[1]-10); injLabel(t,S.a2+0.35,w[0]+40,w[1],1012,w[1]+150,'Wrist extension','الرسغ انطوى لورا','right',1-pr(t,S.a3-0.3,S.a3)); }
  /* ٣ slippery: the bar leaves the open side of the hand and falls */
  const kf=ik(t,S.tOut+0.05,0.3); if(kf>0){ X.save(); X.globalAlpha*=kf; const y0=1150; X.fillStyle=LIL; X.beginPath(); X.moveTo(540-16,y0-22); X.lineTo(540+16,y0-22); X.lineTo(540,y0); X.closePath(); X.fill();
    nkTxt('البار وقع عليه',540,y0+40+(1-kf)*10,44,'#FFFFFF','center'); X.restore(); }
  X.restore(); }

/* 6) the step pills (what went wrong), the chapter headers */
function stepPillW(n,text,fs){ X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4; X.restore(); return w; }
function stepPill(cx,cy,n,text,k,fs,active){ if(k<=0) return; fs=fs||46; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4, x=cx-w/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18); glassPane(x,cy-h/2,w,h,h/2,{});
  if(active){ X.strokeStyle='rgba(199,125,219,0.9)'; X.lineWidth=3; rr(x+1.5,cy-h/2+1.5,w-3,h-3,h/2); X.stroke(); }
  X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,cy,h/2-12,0,7); X.fill(); nkTxt(n,x+w-h/2,cy+4,fs*0.8,'#FFFFFF','center'); nkTxt(text,x+w-h-6,cy+3,fs,'#FFFFFF','right'); X.restore(); }
function canvasText(t){ const a1=CAN1(t), a2=CAN2(t);
  if(a1>0){ X.save(); X.globalAlpha=a1; chapter(t,T_C1IN+0.05,T_C1OUT+0.2,'WHY THE BAR FELL','ليش وقع البار؟');
    const S=xrState(t), P_=[['١','سويسايد غريب',S.a1],['٢','رسغ ضعيف',S.a2],['٣','قبضة زلقة',WS.P2[18]-0.1]], fs=32, gap=18;
    const ws=P_.map(p=>stepPillW(p[0],p[1],fs)), tot=ws.reduce((x,y)=>x+y,0)+gap*2; let x=540+tot/2;
    P_.forEach((p,i)=>{ const cx=x-ws[i]/2; x-=ws[i]+gap; const cur=(i===2?t>=p[2]:(t>=p[2]&&t<P_[i+1][2])); stepPill(cx,440,p[0],p[1],ik(t,p[2],0.35),fs,cur); });
    X.restore(); }
  if(a2>0){ X.save(); X.globalAlpha=a2; chapter(t,T_C2IN+0.05,T_C2OUT+0.2,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟'); X.restore(); } }
function chapterDots(t){ const a=CANA(t); if(a<=0) return; const done=CAN1(t)>0?1:2;
  X.save(); X.globalAlpha=a; ['١','٢'].forEach((n,i)=>{ const x=540+(0.5-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<1){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

/* 7) C2: the real spotter, then the wrist wrap the moment he names it */
const SP={x:160,y:490,w:760,h:800}, SP_T0=T_C2IN+0.2, SP_E=WS.P4[8]-0.15;
function protect(t){ const a=CAN2(t); if(a<=0) return; X.save(); X.globalAlpha=a;
  /* the record: neck compression by a barbell (one line, under the header) */
  const ks=ik(t,T_C2IN+0.35,0.35)*(1-pr(t,SP_E-0.25,SP_E)); if(ks>0){ X.save(); X.globalAlpha*=ks; nkTxt('بأمريكا: ١١ وفاة على الأقل من بار ضغط على الرقبة (١٩٩٩–٢٠٠٢)',540,438,30,LIL,'center',1,800); X.restore(); }
  const kv=ik(t,T_C2IN+0.1,0.3)*(1-pr(t,SP_E-0.2,SP_E+0.1)); if(kv>0){ X.save(); X.globalAlpha*=kv;
    const i=Math.max(0,Math.min(98,Math.floor((t-SP_T0)*36))); X.save(); X.shadowColor='rgba(118,2,138,0.55)'; X.shadowBlur=60; X.fillStyle='#000'; rr(SP.x,SP.y+20,SP.w,SP.h-20,30); X.fill(); X.restore();
    X.save(); X.beginPath(); rr(SP.x,SP.y+20,SP.w,SP.h-20,30); X.clip(); const im=SPOT[i]; if(im&&im.naturalWidth) X.drawImage(im,SP.x,SP.y+20-30,SP.w,SP.w*860/760); X.restore();
    X.strokeStyle='rgba(199,125,219,0.45)'; X.lineWidth=2; rr(SP.x,SP.y+20,SP.w,SP.h-20,30); X.stroke();
    X.fillStyle='rgba(255,255,255,0.94)'; rr(SP.x+24,SP.y+44,232,36,18); X.fill(); X.fillStyle=PURPLE; X.beginPath(); X.arc(SP.x+46,SP.y+62,6,0,7); X.fill(); injLatin('REAL FOOTAGE',SP.x+150,SP.y+63,19,PURPLE,'center',800,3);
    checkPill(SP.x+SP.w-200,SP.y+SP.h-64,'سبوتر شال البار',ik(t,WS.P4[5]-0.1,0.35),36); X.restore(); }
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
SCENE_LIST.push(['hookTag',hookTag]);
SCENE_LIST.push(['hookWords',hookWords]);
SCENE_LIST.push(['ringLabel',ringLabel]);
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
