/* ═══ NITRON — INJURY BREAKDOWN · EP 07 «Distal Biceps Tendon Rupture · Preacher Curl» ═══
   H    the injury clip FULL SCREEN, slowed, pushing in on his elbow; it stops before his arm reaches full extension and
        flips into the drawing: the tendon snaps on «Curl» (series rule since EP05 v5: never the injury on a real person).
        His «تمزّق عضلة البايسبس أثناء تمرين الـ Preacher Curl» over it, in the glass captions only.
   P1   Ahmad: the episode's name on glass → C1 «ليش بهالتمرين؟»: the preacher pad, the arm lowering until the elbow is
        almost straight, the biceps stretched under the weight
   P2   Ahmad: «فإذا الحمل كبير…» → C2 «ليش بيتمزّق؟»: the force on the tendon grows past what it can hold, then the tendon
        close up, its fibres failing, and the tear
   P3   Ahmad asks «كيف تحمي حالك؟» → C3: the right movement (real footage, slowed, on a film card) + his three steps
   P4   Ahmad: «غالباً بيضطر لعمل جراحي», the sources orbit him → C4 «الاستشفاء»: 0 → 6 → 12 months, the return-to-sport figure
   P5   his last line on glass (no caption) → end card.
   The T_*, WS/WE constants and the drawing (a7Arm, hookMG) are above this part (gen7.py). */
const PURPLE='#76028A', LIL='#C77DDB';
SCENES=[{s:0,e:T_P1,m:R_FULL},{s:T_P1,e:T_C1IN+0.3,m:R_FULL,nocap:true},{s:T_C1IN+0.3,e:T_C2OUT,m:R_FULL},{s:T_C2OUT,e:T_C3IN+0.3,m:R_FULL,nocap:true},
        {s:T_C3IN+0.3,e:T_C3OUT,m:R_FULL,nocap:true},{s:T_C3OUT,e:T_P5,m:R_FULL},{s:T_P5,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'07',name:'Distal Biceps Tendon Rupture',ar:'تمزّق وتر البايسبس'};
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));
const CANx=(t,a,b)=>ease(pr(t,a,a+0.2))*(1-ease(pr(t,b,b+0.2)));
const CAN1=t=>CANx(t,T_C1IN,T_C1OUT), CAN2=t=>CANx(t,T_C2IN,T_C2OUT), CAN3=t=>CANx(t,T_C3IN,T_C3OUT), CAN4=t=>CANx(t,T_C4IN,T_C4OUT);
const CANA=t=>Math.max(CAN1(t),CAN2(t),CAN3(t),CAN4(t));
function rtlLine(parts,cx,y,size,ks){ X.save(); X.font='900 '+size+'px '+FONT; X.textBaseline='middle'; X.direction='rtl'; X.textAlign='right';
  const sp=size*0.26, ws=parts.map(p=>{ X.font='900 '+(p[2]||size)+'px '+FONT; return X.measureText(p[0]).width; }), tot=ws.reduce((a,b)=>a+b,0)+sp*(parts.length-1); let x=cx+tot/2;
  parts.forEach((p,i)=>{ const k=ks?ks[i]:1; if(k>0){ X.save(); X.globalAlpha*=k; X.font='900 '+(p[2]||size)+'px '+FONT; X.fillStyle=p[1]; X.fillText(p[0],x,y+(1-k)*16); X.restore(); } x-=ws[i]+sp; }); X.restore(); return tot; }
function k5cap(P_,A,r1,B,r2){ const dx=B[0]-A[0], dy=B[1]-A[1], d=Math.max(Math.hypot(dx,dy),1e-3), th=Math.atan2(dy,dx), ph=Math.acos(Math.max(-1,Math.min(1,(r1-r2)/d)));
  P_.moveTo(A[0]+r1*Math.cos(th+ph),A[1]+r1*Math.sin(th+ph)); P_.arc(A[0],A[1],r1,th+ph,th+2*Math.PI-ph); P_.arc(B[0],B[1],r2,th-ph,th+ph); P_.closePath(); }

/* ── Ahmad's layer: the sources behind him (P4), then he is drawn over them ── */
const ORB={cx:540,cy:1075,rx:300,ry:90,w:2*Math.PI/5.5,lift:[-70,5,80]};
function orbitDraw(t,items,front,s0,e0){ if(t<s0||t>=e0) return; const out=1-pr(t,e0-0.3,e0);
  items.forEach((it,ix)=>{ it.dy=ORB.lift[ix%3]; const k=ik(t,it.at-0.06,0.32); if(k<=0) return; const th=Math.PI/2-0.55+ORB.w*(t-it.at), d=Math.sin(th);
    if((d>=0)!==front) return; const x=ORB.cx+ORB.rx*Math.cos(th), y=ORB.cy+ORB.ry*d+(it.dy||0), sc=0.74+0.30*(d+1)/2;
    X.save(); X.globalAlpha=out*(front?1:0.62); X.translate(x,y); X.scale(sc,sc); X.translate(-x,-y);
    const fs=it.size||34; X.font='800 '+fs+'px Inter, '+FONT; const w=X.measureText(it.text).width+fs*1.9, h=fs*2.1;
    X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate(x,y+(1-ease(k))*18); glassPane(-w/2,-h/2,w,h,h/2,{}); X.fillStyle=LIL; X.beginPath(); X.arc(-w/2+fs*0.75,0,6,0,7); X.fill(); injLatin(it.text,fs*0.3,2,fs,'#FFFFFF','center',800); X.restore();
    X.restore(); }); }
const SRC_S=T_C3OUT+0.35, SRC_E=T_C4IN+0.1;
const STUDIES=()=>[{text:'Bull Hosp Jt Dis 2014',at:SRC_S},{text:'Clin Orthop Surg 2024',at:SRC_S+0.9},{text:'J Bone Joint Surg 2010',at:SRC_S+1.8}];
const ON_CAM=t=>(t>=T_P1&&t<T_C1IN+0.25)||(t>=T_C1OUT&&t<T_C2IN+0.25)||(t>=T_C2OUT&&t<T_C3IN+0.25)||(t>=T_C3OUT&&t<T_C4IN+0.25)||(t>=T_C4OUT&&t<VEND);
/* behind Ahmad (client, 17 Nov: «حط شي ورا احمد مو كله قدام»): words on the wall behind his head, the person layer back on top.
   P1: the exercise's name in English while he says «هالتمرين» · P2: «حمل كبير» → «بلا سيطرة» on «الحمل كبير… ما عرفت تسيطر» */
let WALL_T=-1;
function wallP1(t){ if(nkWallWords(t,{s:T_P1,e:T_C1IN-0.04,size:178,drop:0.05,words:[
  {text:'PREACHER',at:WS['7521'][10]-0.10,color:'#FFFFFF',latin:true},
  {text:'CURL',at:WS['7521'][11]-0.06,color:LIL,latin:true}]})) WALL_T=t; }
function wallP2(t){ if(nkWallWords(t,{s:T_C1OUT,e:T_C2IN-0.04,size:200,drop:0.08,words:[
  {text:'حمل كبير',at:WS['7523'][1]-0.10,color:'#FFFFFF'},
  {text:'بلا سيطرة',at:WS['7523'][6]-0.10,color:LIL}]})) WALL_T=t; }
function ahmadBack(t){ if(!ON_CAM(t)) return; orbitDraw(t,STUDIES(),false,SRC_S,SRC_E); if(PRS_OK&&WALL_T!==t) X.drawImage(PRS,0,0,W,H); }
function ahmadFront(t){ orbitDraw(t,STUDIES(),true,SRC_S,SRC_E); }

/* ── P1: the episode's name on liquid glass (the footage cannot prove this lifter's diagnosis: «على الأغلب · من شكل الحركة») ── */
function titleCard(t){ if(t<T_P1||t>T_C1IN+0.3) return; const k=ik(t,T_P1+0.12,0.4), out=1-pr(t,T_C1IN-0.25,T_C1IN+0.05); if(k<=0||out<=0) return;
  const x=100,y=1150+(1-k)*60,w=830,h=300; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{});
  X.fillStyle=PURPLE; rr(x+w-20,y+38,8,h-76,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-54,y+58,24,LIL,'right',800,3);
  injLatin(INJ_EP.name,x+w-52,y+124,44,'#FFFFFF','right',900);
  nkTxt(INJ_EP.ar,x+w-52,y+196,58,LIL,'right');
  nkTxt('على الأغلب · من شكل الحركة',x+w-52,y+260,28,'rgba(255,255,255,0.62)','right',1,700); X.restore(); }
/* P3: his question above his head (his hair never rises above y 390 at this framing), gone before C3's header takes its place */
function p3Question(t){ if(t<T_C2OUT||t>T_C3IN+0.3) return; const k=ik(t,WS['7529'][0]-0.05,0.3)*(1-pr(t,T_C3IN-0.1,T_C3IN+0.15)); if(k<=0) return;
  X.save(); X.globalAlpha=k; nkGlassPill(540,250,'كيف تحمي حالك؟',k,58); X.restore(); }

/* ── the dark canvas (+ the film card's footage, baked into the frames by bake7.py, shown through its window) ── */
const FILM={x:170,y:470,w:740,h:700};
function medBg(t){ const a=CANA(t); if(a<=0) return; X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,900,40,560,900,900); g.addColorStop(0,'rgba(118,2,138,0.50)'); g.addColorStop(0.55,'rgba(75,1,88,0.16)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  const a3=CAN3(t); if(a3>0&&VF.naturalWidth){ const kf=ik(t,T_C3IN+0.1,0.35); X.save(); X.globalAlpha=a*kf; const f=FILM, y=f.y+(1-kf)*30;
    X.save(); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=40; X.shadowOffsetY=16; X.fillStyle='#000'; rr(f.x,y,f.w,f.h,36); X.fill(); X.restore();
    X.save(); rr(f.x,y,f.w,f.h,36); X.clip(); X.drawImage(VF,f.x,f.y,f.w,f.h,f.x,y,f.w,f.h); X.restore();
    X.strokeStyle='rgba(199,125,219,0.55)'; X.lineWidth=3; rr(f.x+1.5,y+1.5,f.w-3,f.h-3,35); X.stroke();
    X.fillStyle='rgba(255,255,255,0.94)'; rr(f.x+24,y+24,214,38,19); X.fill(); X.fillStyle=PURPLE; X.beginPath(); X.arc(f.x+46,y+43,6,0,7); X.fill();
    injLatin('SLOW · 0.5×',f.x+138,y+44,20,PURPLE,'center',800,3); X.restore(); }
  X.restore(); }
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha*=k;
  injLatin(lat,540,262,26,LIL,'center',800,4); nkTxt(ar,540,350,88,'#FFFFFF','center'); X.restore(); return k; }
function injLabel(t,at,px,py,lx,ly,la,ar,al,out){ const k1=ik(t,at,0.25)*(out===undefined?1:out), k2=ik(t,at+0.18,0.3)*(out===undefined?1:out); if(k1<=0) return; const R=al==='right';
  X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
  const sx=R?lx-tw:lx+tw; X.globalAlpha*=Math.min(1,k1*1.5); X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
  if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
  X.globalAlpha*=k2/Math.max(0.001,Math.min(1,k1*1.5)); const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
  nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); }
/* world → screen for the mirrored arm drawing (the forearm reaches LEFT, clear of Instagram's right column) */
function a7Screen(p,cx,cy,z){ return [1080-(540+(p[0]-cx)*z), 960+(p[1]-cy)*z]; }
function a7Mirror(cx,cy,z,fn){ X.save(); X.translate(1080,0); X.scale(-1,1); X.translate(540,960); X.scale(z,z); X.translate(-cx,-cy); const r=fn(); X.restore(); return r; }

/* ── C1: why in this exercise — the elbow almost straight, the biceps stretched under the weight ── */
const C1V={cx:520,cy:1010,z:0.74};
function c1State(t){ const lo=ik(t,WS['7521'][16]-0.3,1.6);                       /* «المرفق» → «الاستقامة»: the forearm lowers */
  return {phi:1.55-1.38*lo, k:pr(t,T_C1IN+0.1,T_C1IN+1.0), stretch:ik(t,WS['7521'][23]-0.15,0.6), tremble:0, hot:t>=WS['7521'][23]-0.15, glow:ik(t,WS['7521'][23],0.5)*0.6}; }
function canvas1(t){ const a=CAN1(t); if(a<=0) return; X.save(); X.globalAlpha=a; chapter(t,T_C1IN+0.05,T_C1OUT+0.2,'WHY THE PREACHER CURL','ليش بهالتمرين؟');
  const st=c1State(t), g=a7Mirror(C1V.cx,C1V.cy,C1V.z,()=>a7Arm(t,st));
  if(g){ const E=a7Screen(A7.E,C1V.cx,C1V.cy,C1V.z), Hs=a7Screen(g.H,C1V.cx,C1V.cy,C1V.z), B=a7Screen([(A7.S[0]+A7.E[0])/2+A7.nUp[0]*70,(A7.S[1]+A7.E[1])/2+A7.nUp[1]*70],C1V.cx,C1V.cy,C1V.z);
    const out1=1-pr(t,WS['7521'][23]-0.4,WS['7521'][23]-0.1);
    injLabel(t,WS['7521'][17]-0.05,E[0],E[1]+30,60,1388,'Elbow near full extension','المرفق شبه مفرود','left',out1);   /* under the plate, clear of the posts */
    injLabel(t,WS['7521'][23]-0.05,B[0],B[1],60,622,'Biceps under stretch','البايسبس ممدودة','left');   /* the free dark above the plate, left of his head */
    const kw=ik(t,WS['7521'][27]-0.12,0.3); if(kw>0){ X.save(); X.globalAlpha*=kw; X.strokeStyle=LIL; X.fillStyle=LIL; X.lineWidth=12; X.lineCap='round';
      const x=Hs[0], y0=Hs[1]+120, y1=y0+120*kw; X.beginPath(); X.moveTo(x,y0); X.lineTo(x,y1); X.stroke(); X.beginPath(); X.moveTo(x-26,y1-6); X.lineTo(x+26,y1-6); X.lineTo(x,y1+30); X.closePath(); X.fill();
      nkTxt('الوزن',x+66,y1-20,40,LIL,'left'); X.restore(); } }
  X.restore(); }

/* ── C2: the force on the tendon beats what it can hold → the tendon close up, its fibres failing → the tear ── */
function canvas2(t){ const a=CAN2(t); if(a<=0) return; X.save(); X.globalAlpha=a; chapter(t,T_C2IN+0.05,T_C2OUT+0.2,'WHY IT TEARS','ليش بيتمزّق؟');
  const tB=WS['7523'][22]-0.2;                                                      /* «وهالشي»: into the close-up */
  const kA=ik(t,T_C2IN+0.15,0.35)*(1-pr(t,tB-0.25,tB)); if(kA>0){ X.save(); X.globalAlpha*=kA;
    const base=1240, top=560, cap=0.62, f=Math.min(1.08,0.12+0.5*ik(t,WS['7523'][11]-0.1,1.4)+0.46*ik(t,WS['7523'][17]-0.15,0.5)), over=f>cap+0.01;
    const bar=(x,label,lat,v,fill,stroke)=>{ const h=(base-top)*v; X.save(); X.fillStyle='rgba(255,255,255,0.05)'; rr(x-90,top,180,base-top,26); X.fill(); X.strokeStyle='rgba(236,230,242,0.25)'; X.lineWidth=3; rr(x-90,top,180,base-top,26); X.stroke();
      if(fill){ X.fillStyle=fill; rr(x-90,base-h,180,h,26); X.fill(); } if(stroke){ X.strokeStyle=stroke; X.lineWidth=6; rr(x-90,base-h,180,h,26); X.stroke(); }
      nkTxt(label,x,base+62,40,'#FFFFFF','center'); injLatin(lat,x,base+112,24,'rgba(255,255,255,0.6)','center',700); X.restore(); };
    bar(360,'قدرة الوتر','Tendon capacity',cap,'rgba(255,255,255,0.10)',A7INK);
    bar(720,'القوة عليه','Load on it',f,over?'rgba(199,125,219,0.9)':'rgba(118,2,138,0.85)',over?LIL:null);
    const ly=base-(base-top)*cap; X.save(); X.setLineDash([16,12]); X.strokeStyle='rgba(255,255,255,0.7)'; X.lineWidth=3; X.beginPath(); X.moveTo(240,ly); X.lineTo(840,ly); X.stroke(); X.restore();
    const ko=ik(t,WS['7523'][17]-0.05,0.3); if(ko>0){ X.save(); X.globalAlpha*=ko; nkGlassPill(720,top-70,'أكبر من قدرته',ko,40); X.restore(); }
    X.restore(); }
  const kB=ik(t,tB,0.3); if(kB>0){ X.save(); X.globalAlpha*=kB; const tT=WS['7523'][24]-0.02, fail=ik(t,WS['7523'][23]-0.1,0.7), af=t-tT;
    const st={phi:0.10, k:1, stretch:1, tremble:af<0?1:0, hot:true, glow:0.6, fib:true, fail, tear:af>=0?af:-1, recoil:af>=0?Math.min(1,ease(pr(af,0,0.3))):0, drop:0};
    const z=2.3, cx=A7.E[0]+20, cy=A7.E[1]-30; a7Mirror(cx,cy,z,()=>a7Arm(t,st));
    const P=a7Screen([A7.E[0]+A7.nUp[0]*26,A7.E[1]+A7.nUp[1]*26],cx,cy,z);
    injLabel(t,tB+0.25,P[0],P[1],P[0]-120,P[1]-260,'Distal biceps tendon','وتر البايسبس','right',1-pr(t,tT-0.1,tT+0.1));
    if(af>=0){ for(const [d,kk] of [[0,1],[0.07,0.7],[0.16,0.45]]){ const a2=pr(af,d,d+0.6); if(a2<=0||a2>=1) continue; X.save(); X.globalAlpha*=(1-a2)*kk; X.strokeStyle=LIL; X.lineWidth=6*(1-a2)+1; X.beginPath(); X.arc(P[0],P[1],40+300*ease(a2),0,7); X.stroke(); X.restore(); }
      const kt=ik(t,tT+0.08,0.3); if(kt>0){ X.save(); X.globalAlpha*=kt; nkTxt('تمزّق',P[0]-170,P[1]-300+(1-kt)*16,110,LIL,'center'); X.restore(); } }   /* in the dark above the arm, where the tendon's name was */
    X.restore(); }
  X.restore(); }

/* ── C3: how to protect yourself — the right movement on film + his three steps ── */
function stepPill(cx,cy,n,text,k,fs,active){ if(k<=0) return; fs=fs||46; X.save(); X.font='900 '+fs+'px '+FONT; const h=fs*1.9, w=X.measureText(text).width+h+fs*1.4, x=cx-w/2;
  X.globalAlpha*=Math.min(1,k*1.6); X.translate(0,(1-ease(k))*18); glassPane(x,cy-h/2,w,h,h/2,{});
  if(active){ X.strokeStyle='rgba(199,125,219,0.9)'; X.lineWidth=3; rr(x+1.5,cy-h/2+1.5,w-3,h-3,h/2); X.stroke(); }
  X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,cy,h/2-12,0,7); X.fill(); nkTxt(n,x+w-h/2,cy+4,fs*0.8,'#FFFFFF','center'); nkTxt(text,x+w-h-6,cy+3,fs,'#FFFFFF','right'); X.restore(); }
function canvas3(t){ const a=CAN3(t); if(a<=0) return; X.save(); X.globalAlpha=a; chapter(t,T_C3IN+0.05,T_C3OUT+0.2,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟');
  const R=[['١','نزّل بهدوء',WS['7529'][5]-0.1],['٢','ما طلع معك؟ لا تجبر حالك',WS['7529'][7]-0.1],['٣','تحكّم كامل بالطلوع والنزول',WS['7529'][20]-0.1]];
  R.forEach((r,i)=>{ const cur=t>=r[2]&&(i===2||t<R[i+1][2]); stepPill(540,1240+i*104,r[0],r[1],ik(t,r[2],0.35),42,cur); });
  X.restore(); }

/* ── C4: the recovery — 0 → 6 → 12 months; the return-to-sport figure from the review ── */
function canvas4(t){ const a=CAN4(t); if(a<=0) return; X.save(); X.globalAlpha=a; chapter(t,T_C4IN+0.05,T_C4OUT+0.2,'RECOVERY','الاستشفاء');
  const x0=160, x1=920, y=860, m=v=>x0+(x1-x0)*v/12, k0=ik(t,T_C4IN+0.15,0.35);
  X.save(); X.globalAlpha*=k0; X.strokeStyle='rgba(236,230,242,0.35)'; X.lineWidth=6; X.lineCap='round'; X.beginPath(); X.moveTo(m(0),y); X.lineTo(m(12),y); X.stroke();
  for(const v of [0,3,6,9,12]){ X.fillStyle='rgba(236,230,242,0.6)'; X.beginPath(); X.arc(m(v),y,8,0,7); X.fill(); injLatin(String(v),m(v),y+56,34,'rgba(255,255,255,0.75)','center',800); }
  nkTxt('شهر',540,y+118,34,'rgba(255,255,255,0.55)','center'); X.restore();
  const k6=ik(t,WS['7531'][10]-0.1,0.6), k12=ik(t,WS['7531'][12]-0.1,0.6);
  if(k6>0){ X.save(); X.lineCap='round'; X.strokeStyle=PURPLE; X.lineWidth=22; X.beginPath(); X.moveTo(m(0),y); X.lineTo(m(6*k6),y); X.stroke();
    if(k12>0){ const g=X.createLinearGradient(m(6),0,m(12),0); g.addColorStop(0,LIL); g.addColorStop(1,'rgba(199,125,219,0.35)'); X.strokeStyle=g; X.beginPath(); X.moveTo(m(6),y); X.lineTo(m(6+6*k12),y); X.stroke(); }
    X.restore(); X.save(); X.globalAlpha*=k6; nkGlassPill(m(6),y-120,'٦ أشهر',k6,44); X.restore(); }
  if(k12>0){ X.save(); X.globalAlpha*=k12; nkGlassPill(m(12)-40,y-120,'سنة',k12,44); X.restore(); }
  const kf=ik(t,WS['7531'][11]-0.05,0.4); if(kf>0){ X.save(); X.globalAlpha*=kf; const bx=120,by=1110,bw=840,bh=230; glassPane(bx,by+(1-kf)*30,bw,bh,36,{}); X.fillStyle=PURPLE; rr(bx+bw-20,by+(1-kf)*30+34,8,bh-68,4); X.fill();
    nkTxt('بعد العملية، الرجوع للرياضة',bx+bw-50,by+(1-kf)*30+62,36,LIL,'right',1,800);
    rtlLine([['بالمتوسط','#FFFFFF',52],['٦٫٣ شهر',LIL,64]],540,by+(1-kf)*30+150,52);
    X.restore(); }
  X.restore(); }

/* ── P5: his last line on liquid glass; the card opens with it ── */
function takeaway(t){ if(t<T_P5||t>=VEND) return; const k=ik(t,WS['7534'][0]-0.1,0.4), out=1-pr(t,VEND-0.3,VEND); if(k<=0||out<=0) return;
  const k2=ik(t,WS['7534'][1]-0.06,0.3), k3=ik(t,WS['7534'][3]-0.08,0.3), k4=ik(t,WS['7534'][6]-0.08,0.3), g=ik(t,WS['7534'][3]-0.25,0.4);
  const x=100,y=1170+(1-k)*60,w=830,h=170+120*g; X.save(); X.globalAlpha=k*out; glassPane(x,y,w,h,40,{}); X.fillStyle=PURPLE; rr(x+w-20,y+30,8,h-60,4); X.fill();
  nkTxt('بالمختصر',x+w-54,y+52,32,LIL,'right',1,800);
  if(k2>0){ X.save(); X.globalAlpha*=k2; nkTxt('تحكّمك بالوزن',x+w-52,y+124+(1-k2)*16,72,'#FFFFFF','right'); X.restore(); }
  if(k3>0){ X.save(); X.globalAlpha*=k3; X.font='900 46px '+FONT; rtlLine([['ممكن يحميك من','#FFFFFF',46],['الإصابة',LIL,56]],x+w-52-(X.measureText('ممكن يحميك من الإصابة').width+40)/2,y+222+(1-k3)*14,46,[1,k4]); X.restore(); }
  X.restore(); }

/* ── sources: every medical claim shows where it came from, while it is said ── */
const INJ_SRC=[{s:T_C2IN+0.4,e:T_C2OUT-0.1,text:'المصدر: Launonen et al. — J Hand Surg Am 2020'},
               {s:WS['7531'][10]-0.1,e:T_C4OUT-0.1,text:'المصدر: Boufadel et al. — Am J Sports Med 2025'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ if(t<c.s||t>c.e) return; const k=ik(t,c.s,0.3)*(1-pr(t,c.e-0.2,c.e)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.font='700 24px Inter, '+FONT; const tw=X.measureText(c.text).width+52; X.fillStyle='rgba(10,10,12,0.68)'; rr(540-tw/2,1450,tw,44,22); X.fill();
  X.strokeStyle='rgba(199,125,219,0.35)'; X.lineWidth=2; rr(540-tw/2,1450,tw,44,22); X.stroke();
  X.fillStyle='#D9A6E8'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(c.text,540,1473); X.restore(); }); }
function chapterDots(t){ const a=CANA(t); if(a<=0) return; const done=(CAN1(t)>0||CAN2(t)>0)?1:(CAN3(t)>0?2:3);
  X.save(); X.globalAlpha=a; ['١','٢','٣'].forEach((n,i)=>{ const x=540+(1-i)*64, on=i+1<done, cur=i+1===done, r=cur?20:16;
    X.fillStyle=on?PURPLE:(cur?LIL:'rgba(255,255,255,0.14)'); X.beginPath(); X.arc(x,170,r,0,7); X.fill();
    if(i<2){ X.fillStyle=on?'rgba(199,125,219,0.6)':'rgba(255,255,255,0.14)'; X.fillRect(x-48,168,32,4); }
    nkTxt(n,x,174,cur?24:20,(on||cur)?'#FFFFFF':'rgba(255,255,255,0.5)','center'); }); X.restore(); }

SCENE_LIST.push(['wallP1',wallP1,'video']);
SCENE_LIST.push(['wallP2',wallP2,'video']);
SCENE_LIST.push(['ahmadBack',ahmadBack,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['canvas1',canvas1]);
SCENE_LIST.push(['canvas2',canvas2]);
SCENE_LIST.push(['canvas3',canvas3]);
SCENE_LIST.push(['canvas4',canvas4]);
SCENE_LIST.push(['chapterDots',chapterDots]);
SCENE_LIST.push(['titleCard',titleCard]);
SCENE_LIST.push(['p3Question',p3Question]);
SCENE_LIST.push(['ahmadFront',ahmadFront]);
SCENE_LIST.push(['takeaway',takeaway]);
SCENE_LIST.push(['srcLine',srcLine]);

/* end card: fades in after his last word: the one thing to do with this video, the logo, the series tag, the sources */
outro=function(t){ const s=VEND; if(t<s) return; const a=ease(pr(t,s,s+0.3)); X.save(); X.globalAlpha=a; X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k0=ik(t,s+0.1,0.4); if(k0>0){ X.globalAlpha=k0; nkTxt('ابعتها لصاحبك',540,540+(1-k0)*16,96,'#FFFFFF','center');
    nkTxt('اللي بيلعب Preacher Curl تقيل',540,648+(1-k0)*16,56,LIL,'center'); }
  const k1=ik(t,s+0.3,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=560, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,880-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.5,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-190*k2,996,380*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1068,34,LIL,'center',800,6); injLatin('EP 07 / 10',540,1120,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1236,30,LIL,'center');
    ['Launonen et al. — J Hand Surg Am 2020;45(11):1022–28','Ward et al. — Bull Hosp Jt Dis 2014;72(1):110–19','Almigdad et al. — Clin Orthop Surg 2024;17(2):267–73','Boufadel et al. — Am J Sports Med 2025;53(7):1769–78'].forEach((s2,i)=>injLatin(s2,540,1284+i*34,22,'rgba(255,255,255,0.75)','center',600)); }
  X.restore(); };
