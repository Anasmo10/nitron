/* ═══ NITRON — INJURY BREAKDOWN · EP 04 «Forearm Fracture» ═══
   Client, 14 Nov: Ahmad cut out and placed on the gym with his shoulders to the frame, the hook focused on the moment and
   on where the forearm broke (every image and caption on the source removed), more realistic motion graphics, the
   Nitron look with liquid glass, few transitions, every sound in its place.
   H    the replay band, slowed on the break, a ring on the forearm · his «ممكن يكون أنهى مسيرته بسبب غلطة كبيرة…» over it
   P2   Ahmad: the injury's name on glass · «الأولى: وزن عالي» above his head
        → the X-ray canvas: «٢ الرسغ مال لبرّا» — the hand and dumbbell tilt off the forearm, the load line leaves the bone,
          the bones bend, then both break
   P3   (under the canvas) the treatment, corrected on screen with its source: a cast only for one bone not out of place;
        most adult forearm fractures are fixed with plates and screws; recovery: usually several months
        → back to Ahmad, the sources orbit him
   P4   his last line on glass (no caption) → end card.
   The radiograph is rendered from physics in xray.py (projected path length through each bone, metal saturating).
   The T_*, WS/WE, XG and RING constants above this line come from gen.py. */
const PURPLE='#76028A', LIL='#C77DDB';
SCENES=[{s:0,e:6.2,m:R_FULL,nocap:true},{s:6.2,e:T_P4,m:R_FULL},{s:T_P4,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'04',name:'Forearm Fracture',ar:'كسر عظام الساعد'};
const XR={fore:nkUse('xr_forearm.png'),hand:nkUse('xr_hand.png'),bell:nkUse('xr_bell.png'),fix:nkUse('xr_fix.png'),cast:nkUse('xr_cast.png')};
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));
/* one canvas: in over Ahmad before «والتانية», out after the cut to P3 once «أشهر» is said (the take change is under it) */
const CAN=t=>ease(pr(t,T_CIN,T_CIN+0.45))*(1-ease(pr(t,T_COUT,T_COUT+0.45)));
function rtlLine(parts,cx,y,size,ks){ X.save(); X.font='900 '+size+'px '+FONT; X.textBaseline='middle'; X.direction='rtl'; X.textAlign='right';
  const sp=size*0.26, ws=parts.map(p=>{ X.font='900 '+(p[2]||size)+'px '+FONT; return X.measureText(p[0]).width; }), tot=ws.reduce((a,b)=>a+b,0)+sp*(parts.length-1); let x=cx+tot/2;
  parts.forEach((p,i)=>{ const k=ks?ks[i]:1; if(k>0){ X.save(); X.globalAlpha*=k; X.font='900 '+(p[2]||size)+'px '+FONT; X.fillStyle=p[1]; X.fillText(p[0],x,y+(1-k)*16); X.restore(); } x-=ws[i]+sp; }); X.restore(); return tot; }
function glassCard2(cx,y,top,big,k,fsTop,fsBig,w){ if(k<=0) return; fsTop=fsTop||32; fsBig=fsBig||56; X.save(); X.font='900 '+fsBig+'px '+FONT; const bw=X.measureText(big).width; X.font='800 '+fsTop+'px '+FONT;
  const tw=X.measureText(top).width, ww=w||Math.max(bw,tw)+96, h=fsTop+fsBig+64, x=cx-ww/2; X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18);
  glassPane(x,y,ww,h,30,{}); X.fillStyle=PURPLE; rr(x+ww-18,y+20,7,h-40,3.5); X.fill();
  nkTxt(top,x+ww-44,y+20+fsTop*0.62,fsTop,LIL,'right',1,800); nkTxt(big,x+ww-44,y+30+fsTop+fsBig*0.6,fsBig,'#FFFFFF','right'); X.restore(); }

/* 1) the hook: his words in the band above the picture, the tag just above the band, a label on the ring */
function hookWords(t){ if(t>T_P2) return; const out=1-pr(t,T_P2-0.4,T_P2-0.12); if(out<=0) return;
  const kB=ik(t,WS.H[6]-0.12,0.25);
  if(kB<1){ const ks=[ik(t,0.10,0.22),ik(t,WS.H[3]-0.06,0.2),ik(t,WS.H[4]-0.06,0.2),ik(t,WS.H[5]-0.06,0.22)];
    X.save(); X.globalAlpha=out*(1-kB); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=24; rtlLine([['ممكن','#FFFFFF'],['يكون','#FFFFFF']],540,206-20*kB,84,ks.slice(0,2)); rtlLine([['أنهى','#FFFFFF'],['مسيرته',LIL]],540,314-20*kB,110,ks.slice(2)); X.restore(); }
  if(kB>0){ const k1=ik(t,WS.H[7]-0.06,0.2), k2=ik(t,WS.H[8]-0.06,0.2), kC=ik(t,WS.H[9]-0.08,0.25);
    X.save(); X.globalAlpha=out; X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=24; rtlLine([['بسبب','#FFFFFF',70],['غلطة',LIL,104],['كبيرة',LIL,104]],540,220,104,[kB,k1,k2]);
    if(kC>0){ X.globalAlpha=out*kC; nkTxt('بتمرين الشولدر برس',540,322+(1-kC)*12,54,'#FFFFFF','center'); } X.restore(); } }
function hookTag(t){ if(t>T_P2) return; const k=ik(t,0.15,0.3)*(1-pr(t,T_P2-0.35,T_P2-0.1)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.fillStyle='rgba(255,255,255,0.94)'; rr(48,368,268,40,20); X.fill(); X.fillStyle=PURPLE; X.beginPath(); X.arc(74,388,7,0,7); X.fill();
  injLatin('REAL FOOTAGE',192,389,21,PURPLE,'center',800,3); X.restore(); }
function ringLabel(t){ if(!RING.length||t<RING[0][0]||t>RING[RING.length-1][0]+0.2) return;
  let r=RING[0]; for(const q of RING){ if(q[0]<=t) r=q; } const k=Math.min(1,r[4]*1.4)*ik(t,RING[0][0]+0.15,0.25); if(k<=0) return;
  const ax=r[1]+r[3]*0.72, ay=r[2]-r[3]*0.70, lx=ax+70, ly=ay-60;
  X.save(); X.globalAlpha=k; X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(ax,ay); X.lineTo(lx,ly); X.lineTo(lx+40,ly); X.stroke();
  X.fillStyle=LIL; X.beginPath(); X.arc(ax,ay,6,0,7); X.fill(); X.restore();
  X.save(); X.globalAlpha=k; nkGlassPill(lx+40+92,ly,'الساعد',k,40); X.restore(); }

/* 2) Ahmad's layer: «الأولى: وزن عالي» above his head (P2), the sources behind him (P3 tail → P4), then he is drawn over them */
const ORB={cx:540,cy:1075,rx:300,ry:90,w:2*Math.PI/5.5,lift:[-70,5,80]};
function orbitDraw(t,items,front,s0,e0){ if(t<s0||t>=e0) return; const out=1-pr(t,e0-0.3,e0);
  items.forEach((it,ix)=>{ it.dy=ORB.lift[ix%3]; const k=ik(t,it.at-0.06,0.32); if(k<=0) return; const th=Math.PI/2-0.55+ORB.w*(t-it.at), d=Math.sin(th);
    if((d>=0)!==front) return; const x=ORB.cx+ORB.rx*Math.cos(th), y=ORB.cy+ORB.ry*d+(it.dy||0), sc=0.74+0.30*(d+1)/2;
    X.save(); X.globalAlpha=out*(front?1:0.62); X.translate(x,y); X.scale(sc,sc); X.translate(-x,-y);
    const fs=it.size||34; X.font='800 '+fs+'px Inter, '+FONT; const w=X.measureText(it.text).width+fs*1.9, h=fs*2.1;
    X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(x,y+(1-ease(k))*18); glassPane(-w/2,-h/2,w,h,h/2,{}); X.fillStyle=LIL; X.beginPath(); X.arc(-w/2+fs*0.75,0,6,0,7); X.fill(); injLatin(it.text,fs*0.3,2,fs,'#FFFFFF','center',800); X.restore();
    X.restore(); }); }
const SRC_S=T_COUT+0.35, SRC_E=WS.P4[3]-0.35;
const STUDIES=()=>[{text:'AAOS · OrthoInfo',at:SRC_S},{text:'Cleveland Clinic',at:SRC_S+0.9},{text:'ACE Fitness',at:SRC_S+1.8}];
const ON_CAM=t=>(t>=T_P2&&t<T_CIN+0.5)||(t>=T_COUT&&t<VEND);
function stepPill(cx,cy,n,text,k,fs,active){ if(k<=0) return; fs=fs||46; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4, x=cx-w/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18); glassPane(x,cy-h/2,w,h,h/2,{});
  if(active){ X.strokeStyle='rgba(199,125,219,0.9)'; X.lineWidth=3; rr(x+1.5,cy-h/2+1.5,w-3,h-3,h/2); X.stroke(); }
  X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,cy,h/2-12,0,7); X.fill(); nkTxt(n,x+w-h/2,cy+4,fs*0.8,'#FFFFFF','center'); nkTxt(text,x+w-h-6,cy+3,fs,'#FFFFFF','right'); X.restore(); }
function ahmadBack(t){ if(!ON_CAM(t)) return;
  if(t>=T_P2&&t<T_CIN+0.5){ const k=ik(t,WS.P2[6]-0.12,0.35)*(1-ease(pr(t,T_CIN-0.05,T_CIN+0.3))); stepPill(540,262,'١','وزن عالي',k,52,false); }   /* above his head: his hair never rises above y 330 */
  orbitDraw(t,STUDIES(),false,SRC_S,SRC_E);
  const inDis=t<T_P2+0.22||Math.abs(t-T_P4)<0.15;     /* the dissolve and the settle are in the frames */
  if(PRS_OK&&!inDis) X.drawImage(PRS,0,0,W,H); }
function ahmadFront(t){ orbitDraw(t,STUDIES(),true,SRC_S,SRC_E); }

/* 3) P2: the injury's name on liquid glass. Read off the footage (the outlet's caption says «fratura do antebraço»), so it is qualified */
function titleCard(t){ if(t<T_P2||t>6.4) return; const k=ik(t,T_P2+0.12,0.4), out=1-pr(t,5.95,6.25); if(k<=0||out<=0) return;
  const x=100,y=1150+(1-k)*60,w=830,h=330; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{});
  X.fillStyle=PURPLE; rr(x+w-20,y+38,8,h-76,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-54,y+62,24,LIL,'right',800,3);
  injLatin(INJ_EP.name,x+w-52,y+134,52,'#FFFFFF','right',900);
  nkTxt(INJ_EP.ar,x+w-52,y+216,60,LIL,'right');
  X.globalAlpha=k*out*0.78; nkTxt('على الأغلب · من شكل الحركة',x+w-52,y+284,30,'#FFFFFF','right',1,700); X.restore(); }

/* 4) the dark canvas and the radiograph film on it */
const FILM={x:214,y:488,w:652,h:820};
function medBg(t){ const a=CAN(t); if(a<=0) return; X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,900,40,560,900,900); g.addColorStop(0,'rgba(118,2,138,0.50)'); g.addColorStop(0.55,'rgba(75,1,88,0.16)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  /* the film: near-black with a cold tint, a faint lilac edge, a soft lightbox glow behind it */
  X.save(); X.shadowColor='rgba(118,2,138,0.55)'; X.shadowBlur=60; X.fillStyle='rgba(5,6,12,0.96)'; rr(FILM.x,FILM.y,FILM.w,FILM.h,26); X.fill(); X.restore();
  X.strokeStyle='rgba(199,125,219,0.32)'; X.lineWidth=2; rr(FILM.x,FILM.y,FILM.w,FILM.h,26); X.stroke();
  X.restore(); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al){ const k1=ik(t,at,0.25), k2=ik(t,at+0.18,0.3); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2; const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }

/* 5) the radiograph, moving. Layer space 1000×1700 → screen: scale 0.56 about the film */
const XS=0.54, XO=[540-500*XS, 502];
const L2S=(x,y)=>[XO[0]+x*XS, XO[1]+y*XS];
const FR=XG.fracture, FC=[(FR.radius[0]+FR.ulna[0])/2,(FR.radius[1]+FR.ulna[1])/2];
const JAG=(()=>{ const p=[], x0=300, x1=720; for(let i=0;i<=24;i++){ const x=x0+(x1-x0)*i/24, f=(x-FR.ulna[0])/(FR.radius[0]-FR.ulna[0]);
  const yb=FR.ulna[1]+(FR.radius[1]-FR.ulna[1])*Math.min(1.4,Math.max(-0.4,f)); p.push([x,yb+(i%2?11:-9)+(i%5===0?6:0)]); } return p; })();
function clipAbove(){ X.beginPath(); X.moveTo(-10,-10); X.lineTo(1010,-10); X.lineTo(1010,JAG[JAG.length-1][1]); for(let i=JAG.length-1;i>=0;i--) X.lineTo(JAG[i][0],JAG[i][1]); X.lineTo(-10,JAG[0][1]); X.closePath(); X.clip(); }
function clipBelow(){ X.beginPath(); X.moveTo(-10,1710); X.lineTo(1010,1710); X.lineTo(1010,JAG[JAG.length-1][1]); for(let i=JAG.length-1;i>=0;i--) X.lineTo(JAG[i][0],JAG[i][1]); X.lineTo(-10,JAG[0][1]); X.closePath(); X.clip(); }
function xrState(t){ const aR=WS.P2[12]-0.15, aL=WE.P2[15], aP=WS.P2[16]-0.1, aB=WS.P2[22]-0.08, aT=T_P3+0.15;
  const tilt=0.38*ease(pr(t,aR,aL))*(1-ease(pr(t,aT,aT+0.7)));
  const bend=0.028*ease(pr(t,aP,aP+0.8))*(1-pr(t,aB,aB+0.05));
  const brk=ease(pr(t,aB,aB+0.18)), phi=bend+0.19*brk*(1-ease(pr(t,aT,aT+0.7)));
  const strain=pr(t,aP,aB)*(1-pr(t,aB+0.6,aB+1.4));
  return {tilt,phi,brk,strain,bell:1-ease(pr(t,aT+0.2,aT+0.7)),cast:ease(pr(t,WS.P3[3]-0.1,WS.P3[3]+0.35))*(1-ease(pr(t,WS.P3[4]-0.05,WS.P3[4]+0.4))),fix:ease(pr(t,WS.P3[4]-0.05,WS.P3[4]+0.5)),heal:ease(pr(t,aT,aT+0.7)),aR,aL,aP,aB}; }
function xray(t){ const a=CAN(t); if(a<=0||t<T_CIN) return; const S=xrState(t);
  /* a scan line reveals the film as the canvas comes in */
  const scan=ease(pr(t,T_CIN+0.25,T_CIN+1.05)), sy=FILM.y+FILM.h*scan;
  X.save(); X.globalAlpha=a; X.beginPath(); rr(FILM.x+3,FILM.y+3,FILM.w-6,FILM.h-6,23); X.clip();
  X.save(); X.beginPath(); X.rect(0,0,W,sy); X.clip();
  X.translate(XO[0],XO[1]); X.scale(XS,XS); X.globalCompositeOperation='lighter';
  const flick=0.96+0.04*Math.sin(t*37)*Math.sin(t*11);
  X.globalAlpha=a*flick;
  X.save(); clipBelow(); X.drawImage(XR.fore,0,0); X.restore();
  X.save(); X.translate(FC[0],FC[1]); X.rotate(S.phi); X.translate(-FC[0],-FC[1]);
    X.save(); clipAbove(); X.drawImage(XR.fore,0,0); X.restore();
    X.save(); X.translate(XG.wrist[0],XG.wrist[1]); X.rotate(S.tilt); X.translate(-XG.wrist[0],-XG.wrist[1]);
      X.drawImage(XR.hand,0,0); if(S.bell>0){ X.globalAlpha=a*flick*S.bell; X.drawImage(XR.bell,0,0); X.globalAlpha=a*flick; } X.restore();
  X.restore();
  if(S.cast>0){ X.globalAlpha=a*S.cast*0.9; X.drawImage(XR.cast,0,0); }
  if(S.fix>0){ X.globalAlpha=a*S.fix; X.drawImage(XR.fix,0,0); }
  X.globalCompositeOperation='source-over'; X.globalAlpha=a;
  /* stress before the break: a lilac heat on the bending bones */
  if(S.strain>0){ const g=X.createRadialGradient(FC[0],FC[1],10,FC[0],FC[1],260); g.addColorStop(0,`rgba(255,255,255,${0.30*S.strain})`); g.addColorStop(0.25,`rgba(199,125,219,${0.42*S.strain})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(FC[0]-280,FC[1]-280,560,560); }
  /* the break: bright crack lines across both bones, a short glow */
  if(S.brk>0){ const gl=(1-pr(t,S.aB+0.2,S.aB+1.2))*S.brk*(1-S.heal*0.7); X.save(); X.globalCompositeOperation='lighter';
    for(const b of [FR.ulna,FR.radius]){ const g=X.createRadialGradient(b[0],b[1],4,b[0],b[1],120); g.addColorStop(0,`rgba(255,255,255,${0.75*gl})`); g.addColorStop(0.3,`rgba(199,125,219,${0.55*gl})`); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(b[0]-130,b[1]-130,260,260); }
    X.strokeStyle=`rgba(255,255,255,${0.9*S.brk*(1-0.6*S.heal)})`; X.lineWidth=3.2; X.lineJoin='round';
    for(const [lo,hi] of [[FR.ulna[0]-26,FR.ulna[0]+26],[FR.radius[0]-30,FR.radius[0]+30]]){ X.beginPath(); let st=false; for(const p of JAG){ if(p[0]<lo||p[0]>hi) continue; if(!st){ X.moveTo(p[0],p[1]); st=true; } else X.lineTo(p[0],p[1]); } X.stroke(); }
    X.restore(); }
  X.restore();
  /* it is a drawing, not this lifter's X-ray: said in the film's corner */
  { const kd=ik(t,T_CIN+0.9,0.4); if(kd>0){ X.save(); X.globalAlpha=a*kd*0.8; nkTxt('رسم توضيحي',FILM.x+FILM.w-22,FILM.y+FILM.h-26,24,LIL,'right',1,800); X.restore(); } }
  /* the scan line itself */
  if(scan>0&&scan<1){ const g=X.createLinearGradient(0,sy-40,0,sy+4); g.addColorStop(0,'rgba(199,125,219,0)'); g.addColorStop(1,'rgba(230,200,245,0.85)'); X.fillStyle=g; X.fillRect(FILM.x,sy-40,FILM.w,44); }
  X.restore();
  xrOverlay(t,S,a); }
/* what the eye should follow, drawn in screen space: the line of the load, the bending, the bones' names */
function xrOverlay(t,S,a){ X.save(); X.globalAlpha=a;
  const kL=ik(t,S.aR-0.5,0.4)*(1-pr(t,S.aB-0.2,S.aB+0.2));
  if(kL>0){ const hc=[XG.wrist[0]+360*Math.sin(S.tilt),XG.wrist[1]-360*Math.cos(S.tilt)], p0=L2S(hc[0],hc[1]), axisX=L2S(500,0)[0], yb=L2S(0,1240)[1];
    X.save(); X.globalAlpha*=kL; X.strokeStyle='rgba(255,255,255,0.85)'; X.lineWidth=4; X.setLineDash([14,12]); X.beginPath(); X.moveTo(p0[0],p0[1]); X.lineTo(p0[0],yb); X.stroke(); X.setLineDash([]);
    X.fillStyle='#FFFFFF'; X.beginPath(); X.moveTo(p0[0]-13,yb-6); X.lineTo(p0[0]+13,yb-6); X.lineTo(p0[0],yb+16); X.closePath(); X.fill();
    X.fillStyle=LIL; X.beginPath(); X.arc(p0[0],p0[1],9,0,7); X.fill();
    const off=p0[0]-axisX; if(off>24){ const ko=Math.min(1,(off-24)/60), yo=L2S(0,1000)[1];   /* the gap between the load and the bone */
      X.globalAlpha*=ko; X.strokeStyle=LIL; X.lineWidth=4; X.beginPath(); X.moveTo(axisX,yo-16); X.lineTo(axisX,yo+16); X.moveTo(axisX,yo); X.lineTo(p0[0],yo); X.moveTo(p0[0],yo-16); X.lineTo(p0[0],yo+16); X.stroke();
      nkTxt('الحمل برّا العظم',p0[0]+24,yo-44,34,LIL,'left',1,800); }
    X.restore(); }
  /* bending: two arcs and arrowheads either side of the forearm */
  const kb=ik(t,S.aP,0.35)*(1-pr(t,S.aB+0.3,S.aB+0.7)); if(kb>0){ const c=L2S(FC[0],FC[1]); X.save(); X.globalAlpha*=kb; X.strokeStyle=LIL; X.lineWidth=6; X.lineCap='round';
    for(const s of [-1,1]){ const cx=c[0]+s*150; X.beginPath(); X.arc(cx-s*120,c[1],140,s>0?-0.55:Math.PI-0.55,s>0?0.55:Math.PI+0.55); X.stroke();
      const ang=s>0?0.55:Math.PI+0.55, ex=cx-s*120+140*Math.cos(ang), ey=c[1]+140*Math.sin(ang); X.fillStyle=LIL; X.beginPath(); X.moveTo(ex,ey+14); X.lineTo(ex-12*s,ey-6); X.lineTo(ex+12*s,ey-6); X.closePath(); X.fill(); }
    X.restore(); X.save(); X.globalAlpha*=kb*(1-S.brk); nkGlassPill(L2S(FC[0],FC[1])[0],L2S(0,1290)[1],'ضغط انحناء',kb,40); X.restore(); }
  /* the break: the bones' names, the word */
  if(S.brk>0){ const lf=1-pr(t,T_P3-0.1,T_P3+0.3); if(lf>0){ X.save(); X.globalAlpha*=lf;
      const u=L2S(FR.ulna[0],FR.ulna[1]), r=L2S(FR.radius[0],FR.radius[1]);
      injLabel(t,WS.P2[23]-0.05,u[0]-10,u[1]+18,60,u[1]+150,'Ulna','الزند','left');
      injLabel(t,WS.P2[23]+0.15,r[0]+14,r[1]+6,930,r[1]+70,'Radius','الكعبرة','right');   /* ends above y 1100 and left of x 950: clear of Instagram's buttons */
      const kk=ik(t,S.aB+0.05,0.3); if(kk>0){ X.globalAlpha*=kk; nkTxt('كسر',318,u[1]-170+(1-kk)*14,96,'#FFFFFF','center'); }
      X.restore(); } }
  X.restore(); }

/* 6) the canvas header and the step chips (what went wrong), then the treatment cards */
function canvasText(t){ const a=CAN(t); if(a<=0) return; X.save(); X.globalAlpha=a;
  chapter(t,T_CIN+0.05,T_P3+0.2,'WHAT WENT WRONG','شو صار؟'); chapter(t,T_P3+0.2,T_COUT+0.6,'THE TREATMENT','العلاج');
  const kc=ik(t,T_CIN+0.4,0.35)*(1-pr(t,WS.P2[16]-0.3,WS.P2[16])); if(kc>0){ X.save(); X.globalAlpha*=kc;
    stepPill(316,428,'١','وزن عالي',0.6+0.4*kc,36,false); stepPill(754,428,'٢','الرسغ مال لبرّا',ik(t,WS.P2[10]-0.1,0.35),36,true); X.restore(); }
  const kA=ik(t,WS.P3[3]-0.05,0.3)*(1-pr(t,WS.P3[4]-0.15,WS.P3[4]+0.1)); glassCard2(540,398,'بس إذا انكسرت عظمة وحدة وما تزحزحت','جبيرة',kA,30,56,720);
  const kB=ik(t,WS.P3[4]+0.05,0.3)*(1-pr(t,WS.P3[7]-0.2,WS.P3[7]+0.05)); glassCard2(540,398,'أغلب كسور الساعد عند الكبار','عملية تثبيت بصفائح وبراغي',kB,30,52,720);
  const kC=ik(t,WS.P3[7]-0.05,0.3); glassCard2(540,398,'التعافي عادةً بياخد','عدّة أشهر — حسب الكسر والعلاج',kC,30,50,720);
  X.restore(); }

function chapterDots(t){ const a=CAN(t); if(a<=0) return; const done=t<T_P3+0.2?1:2;
  X.save(); X.globalAlpha=a; ['١','٢'].forEach((n,i)=>{ const x=540+(0.5-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<1){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

/* 7) P4: his last line on liquid glass; the card opens with it */
function takeaway(t){ if(t<T_P4||t>=VEND) return; const k=ik(t,WS.P4[0]-0.1,0.4), out=1-pr(t,VEND-0.3,VEND); if(k<=0||out<=0) return;
  const k2=ik(t,WS.P4[3]-0.08,0.3), k3=ik(t,WS.P4[7]-0.1,0.3), g=ik(t,WS.P4[3]-0.3,0.4);
  const x=100,y=1150+(1-k)*60,w=830,h=108+222*g; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{}); X.fillStyle=PURPLE; rr(x+w-20,y+30,8,h-60,4); X.fill();
  nkTxt('وآخر شي… تذكّر',x+w-54,y+56,34,LIL,'right',1,800);
  if(k2>0){ X.save(); X.globalAlpha*=k2; nkTxt('الوزن اللي بتقدر ترفعه',x+w-52,y+150+(1-k2)*16,66,'#FFFFFF','right'); X.restore(); }
  if(k3>0){ X.save(); X.globalAlpha*=k3; nkTxt('مش ضروري يكون اللي بتتحكم فيه بأمان',x+w-52,y+254+(1-k3)*14,36,LIL,'right');   /* 36 px: the line stays inside the card */ X.restore(); }
  X.restore(); }

/* sources: every medical claim shows where it came from, while it is said */
const INJ_SRC=[{s:T_CIN+0.9,e:WS.P2[16]-0.1,text:'المصدر: ACE Fitness — Seated Overhead Press'},{s:WS.P2[16],e:T_P3-0.05,text:'المصدر: Orthopaedic Trauma Association — Biomechanics'},
  {s:T_P3+0.25,e:T_COUT+0.15,text:'المصدر: AAOS OrthoInfo — Adult Forearm Fractures · Cleveland Clinic'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ if(t<c.s||t>c.e) return; const k=ik(t,c.s,0.3)*(1-pr(t,c.e-0.2,c.e)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.font='700 24px Inter, '+FONT; const tw=X.measureText(c.text).width+52; X.fillStyle='rgba(10,10,12,0.68)'; rr(540-tw/2,1450,tw,44,22); X.fill();
  X.strokeStyle='rgba(199,125,219,0.35)'; X.lineWidth=2; rr(540-tw/2,1450,tw,44,22); X.stroke();
  X.fillStyle='#D9A6E8'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(c.text,540,1473); X.restore(); }); }

SCENE_LIST.push(['ahmadBack',ahmadBack,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['xray',xray]);
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
outro=function(t){ const s=VEND; if(t<s-0.35) return; const a=ease(pr(t,s-0.35,s+0.1)); X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k0=ik(t,s+0.1,0.4); if(k0>0){ X.globalAlpha=k0; nkTxt('ابعتها لصاحبك',540,560+(1-k0)*16,96,'#FFFFFF','center'); nkTxt('اللي بيرفع دمبل أتقل من طاقته',540,668+(1-k0)*16,56,LIL,'center'); }
  const k1=ik(t,s+0.3,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=560, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,900-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.5,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-190*k2,1016,380*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1088,34,LIL,'center',800,6); injLatin('EP 04 / 10',540,1140,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1300,30,LIL,'center');
    ['AAOS OrthoInfo — Adult Forearm Fractures','Cleveland Clinic — Broken Arm','ACE Fitness — Seated Overhead Press','Orthopaedic Trauma Association — Biomechanics','Mayo Clinic — Weight training: Do’s and don’ts'].forEach((s2,i)=>injLatin(s2,540,1348+i*34,22,'rgba(255,255,255,0.75)','center',600)); }
  X.restore(); };
