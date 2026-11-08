/* ═══ NITRON — INJURY BREAKDOWN · EP 01 «Lumbar Strain» · SAMPLE (series visual system v0) ═══
   Series look (all 10 episodes): real injury footage as the cold open → one elegant purple flash → clean white
   world: presenter on his white backdrop, white medical canvas, purple (#76028A) as the only accent, lilac
   (#C77DDB) glow, Cairo 900 + Inter, monochrome purple anatomy, the same end card.
   H 0–3.0 injury footage (muted, caption cropped out) · flash · P 3.0–5.93 presenter + title card
   M 5.93–10.23 white medical canvas: «شو صار؟», lumbar spine + erector spinae, strain zone, labels · end card. */
const T_P=3.0, T_P2=7.9, T_M=10.833, T_M4=13.4, T_M5=17.567, T_M5B=22.8, T_P6=23.5, PURPLE='#76028A', LIL='#C77DDB', INJ_INK='#0A0A0C', LOGO_D=nkUse('logo_dark.png');
SCENES=[{s:0,e:T_M,m:R_FULL,nocap:true},{s:T_M,e:T_P6,m:R_FULL},{s:T_P6,e:99,m:R_FULL,nocap:true}];
nkNoBarUntil(99);
const INJ_EP={n:'01',name:'Lumbar Strain',ar:'شدّ عضلات أسفل الظهر'};

/* text helpers */
function injLatin(s,x,y,size,col,al,w,ls){ X.save(); X.font=(w||800)+' '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle';
  if(ls){ try{ X.letterSpacing=ls+'px'; }catch(e){} } X.direction='ltr'; X.fillText(s,x,y); X.restore(); }
const ik=(t,a,d)=>ease(pr(t,a,a+(d||0.3)));

/* 1) the purple flash — the series' signature cut from footage into the white world (and back) */
function injFlash(t,at){ const u=(t-at)/0.42; if(u<-0.35||u>1) return; const a=u<0?Math.max(0,1+u/0.35):Math.pow(1-u,1.6);
  X.save(); X.globalAlpha=Math.min(1,a*1.05); X.fillStyle='#FFFFFF'; X.fillRect(0,0,W,H);
  const r=200+1300*Math.max(0,u+0.35), g=X.createRadialGradient(540,900,r*0.35,540,900,r);
  g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(0.7,'rgba(199,125,219,0.55)'); g.addColorStop(1,'rgba(118,2,138,0)');
  X.fillStyle=g; X.fillRect(0,0,W,H); X.restore(); }
function flashes(t){ injFlash(t,T_P); injFlash(t,T_M); injFlash(t,T_P6); }

/* 2) cold-open tag on the footage: small, top-left, lets the viewer know it is real */
function hookTag(t){ if(t>T_P) return; const k=ik(t,0.15,0.3)*(1-pr(t,T_P-0.25,T_P)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.shadowColor='rgba(0,0,0,0.25)'; X.shadowBlur=20; X.fillStyle='rgba(255,255,255,0.94)'; rr(48,190,300,58,29); X.fill(); X.shadowColor='transparent';
  X.fillStyle=PURPLE; X.beginPath(); X.arc(82,219,8,0,7); X.fill(); X.restore();
  X.save(); X.globalAlpha=k; injLatin('REAL FOOTAGE',212,220,24,PURPLE,'center',800,3); X.restore(); }

/* 3) title card over the presenter: white glass, purple bar on the right (RTL), episode line, name, Arabic name */
function titleCard(t){ if(t<T_P2||t>T_M) return; const k=ik(t,T_P2+0.12,0.4), out=1-pr(t,T_M-0.25,T_M); if(k<=0||out<=0) return;
  const x=70,y=1180+(1-k)*60,w=940,h=300; X.save(); X.globalAlpha=k*out;
  X.shadowColor='rgba(118,2,138,0.25)'; X.shadowBlur=60; X.shadowOffsetY=18; X.fillStyle='rgba(255,255,255,0.94)'; rr(x,y,w,h,36); X.fill(); X.shadowColor='transparent';
  X.fillStyle=PURPLE; rr(x+w-18,y+34,8,h-68,4); X.fill();
  injLatin('INJURY BREAKDOWN · EP '+INJ_EP.n,x+w-50,y+62,24,PURPLE,'right',800,3);
  injLatin(INJ_EP.name,x+w-48,y+140,86,INJ_INK,'right',900);
  nkTxt(INJ_EP.ar,x+w-48,y+232,54,PURPLE,'right'); X.restore(); }

/* 4) the white medical canvas: soft lilac light, faint dot grid */
function medBg(t){ if(t<T_M-0.05||t>=T_P6) return; X.save(); X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(560,950,40,560,950,900); g.addColorStop(0,'rgba(118,2,138,0.55)'); g.addColorStop(0.55,'rgba(75,1,88,0.18)'); g.addColorStop(1,'rgba(10,10,12,0)'); X.fillStyle=g; X.fillRect(0,0,W,H);
  X.fillStyle='rgba(199,125,219,0.10)'; for(let yy=420;yy<1640;yy+=48) for(let xx=60;xx<1040;xx+=48){ X.beginPath(); X.arc(xx,yy,2.2,0,7); X.fill(); }
  X.restore(); }

/* 5) lumbar spine (side view) + erector spinae, monochrome purple; strain zone at L4–L5 */
const SP={x:230,w:180,top:470,bh:104,disc:26};   // vertebral bodies; posterior (back) is to the right
function spine(t){ if(t<T_M||t>=T_M4) return; const t0=T_M;
  X.save(); X.globalAlpha=1-pr(t,T_M4-0.25,T_M4);
  const hd=ik(t,t0+0.05,0.35);   // header
  X.save(); X.globalAlpha*=hd; injLatin('WHAT HAPPENED',540,260,26,LIL,'center',800,4); nkTxt('شو صار؟',540,350,92,'#FFFFFF','center'); X.restore();
  const lv=['L1','L2','L3','L4','L5'];
  for(let i=0;i<5;i++){ const k=ik(t,t0+0.12+i*0.07,0.28); if(k<=0) continue; const y=SP.top+i*(SP.bh+SP.disc);
    X.save(); X.globalAlpha=k; X.translate(0,(1-k)*-20);
    if(i>0){ X.fillStyle='rgba(199,125,219,0.45)'; rr(SP.x+8,y-SP.disc+4,SP.w-16,SP.disc-8,10); X.fill(); }          // disc
    const g=X.createLinearGradient(SP.x,y,SP.x+SP.w,y); g.addColorStop(0,'#26202C'); g.addColorStop(1,'#3A2A44'); X.fillStyle=g; rr(SP.x,y,SP.w,SP.bh,22); X.fill();
    X.strokeStyle='rgba(199,125,219,0.9)'; X.lineWidth=4; rr(SP.x,y,SP.w,SP.bh,22); X.stroke();
    X.beginPath(); X.moveTo(SP.x+SP.w,y+28); X.lineTo(SP.x+SP.w+140,y+46); X.quadraticCurveTo(SP.x+SP.w+164,y+55,SP.x+SP.w+140,y+70); X.lineTo(SP.x+SP.w,y+78); X.closePath();   // spinous process
    X.fillStyle='#2C2333'; X.fill(); X.stroke();
    injLatin(lv[i],SP.x-44,y+SP.bh/2,30,LIL,'center',800); X.restore(); }
  { const k=ik(t,t0+0.5,0.3), y=SP.top+5*(SP.bh+SP.disc)-10; if(k>0){ X.save(); X.globalAlpha=k*0.9; X.fillStyle='#2C2333'; X.strokeStyle='rgba(199,125,219,0.7)'; X.lineWidth=4;
      X.beginPath(); X.moveTo(SP.x+10,y); X.lineTo(SP.x+SP.w+40,y); X.quadraticCurveTo(SP.x+SP.w-10,y+150,SP.x+80,y+170); X.closePath(); X.fill(); X.stroke(); X.restore(); } }   // sacrum
  /* erector spinae band, drawn top→bottom */
  const mk=pr(t,t0+0.45,t0+0.95), mx=SP.x+SP.w+190, top=SP.top-30, bot=SP.top+5*(SP.bh+SP.disc)+60;
  if(mk>0){ X.save(); X.beginPath(); X.rect(0,0,W,top+(bot-top)*ease(mk)); X.clip();
    const band=()=>{ X.beginPath(); X.moveTo(mx-40,top); X.bezierCurveTo(mx+70,top+260,mx+90,bot-300,mx+10,bot); X.lineTo(mx-90,bot); X.bezierCurveTo(mx-10,bot-300,mx-30,top+260,mx-110,top); X.closePath(); };
    band(); const g=X.createLinearGradient(mx-110,0,mx+90,0); g.addColorStop(0,'rgba(199,125,219,0.28)'); g.addColorStop(1,'rgba(118,2,138,0.65)'); X.fillStyle=g; X.fill();
    X.strokeStyle='rgba(199,125,219,0.95)'; X.lineWidth=4; band(); X.stroke();
    const sz=SP.top+3*(SP.bh+SP.disc)+16, ez=sz+136, gap=pr(t,t0+0.95,t0+1.3)*26;   // strain zone L4–L5: fibres part
    X.save(); band(); X.clip(); X.strokeStyle='rgba(199,125,219,0.6)'; X.lineWidth=3;
    for(let f=0;f<6;f++){ const fx=mx-80+f*26; X.beginPath(); let started=false;
      for(let yy=top+20;yy<bot-10;yy+=6){ const xx=fx+Math.sin((yy-top)/180)*28; const inZ=yy>sz&&yy<ez, mid=(sz+ez)/2;
        const ok=!inZ||Math.abs(yy-mid)>gap+(f%2)*8; if(ok){ if(!started){X.moveTo(xx,yy);started=true;} else X.lineTo(xx,yy);} else started=false; }
      X.stroke(); }
    X.restore(); X.restore();
    const sk=pr(t,t0+0.9,t0+1.2); if(sk>0){ const cy=(sz+ez)/2, pulse=0.75+0.25*Math.sin((t-t0)*7);
      const gl=X.createRadialGradient(mx-10,cy,10,mx-10,cy,170); gl.addColorStop(0,`rgba(199,125,219,${0.55*sk*pulse})`); gl.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gl; X.fillRect(mx-200,cy-180,380,360);
      const ak=ik(t,t0+1.0,0.35); if(ak>0){ X.save(); X.strokeStyle=LIL; X.fillStyle=LIL; X.lineWidth=7; X.lineCap='round';   // stretch arrows: the muscle pulled apart
        for(const s of [-1,1]){ const y0=cy+s*40, y1=cy+s*(40+90*ak); X.beginPath(); X.moveTo(mx+120,y0); X.lineTo(mx+120,y1); X.stroke();
          X.beginPath(); X.moveTo(mx+120,y1+s*14); X.lineTo(mx+106,y1-s*4); X.lineTo(mx+134,y1-s*4); X.closePath(); X.fill(); } X.restore(); } } }
  X.restore();
  /* labels with leader lines */
  const lab=(at,px,py,lx,ly,la,ar,al)=>{ const k1=ik(t,at,0.25), k2=ik(t,at+0.18,0.3); if(k1<=0) return; const R=al==='right';
    X.save(); X.font='900 40px '+FONT; let tw=X.measureText(ar).width; if(la){ X.font='800 30px Inter, '+FONT; tw=Math.max(tw,X.measureText(la).width); } tw+=16;
    const ex=R?lx-tw:lx+tw, sx=R?lx-tw:lx+tw;   // the leader meets the underline at the text's inner end
    X.strokeStyle=LIL; X.lineWidth=3; X.beginPath(); X.moveTo(px,py); const kx=px+(sx-px)*Math.min(1,k1*1.4), ky=py+(ly-py)*Math.min(1,k1*1.4); X.lineTo(kx,ky);
    if(k1>0.7){ const u=(k1-0.7)/0.3; X.lineTo(sx+(lx-sx)*u,ly); } X.stroke(); X.fillStyle=LIL; X.beginPath(); X.arc(px,py,8,0,7); X.fill();
    X.globalAlpha=k2; const tx=R?lx-8:lx+8; if(la) injLatin(la,tx,ly-70,30,'#FFFFFF',R?'right':'left',800);
    nkTxt(ar,tx,ly-28,40,LIL,R?'right':'left'); X.restore(); };
  const czs=SP.top+3*(SP.bh+SP.disc)+16+68;
  lab(t0+1.15, mx+30, SP.top+60, 1045, SP.top-30, 'Erector Spinae', 'عضلات أسفل الظهر','right');
  lab(t0+1.45, mx+20, czs, 1045, czs+40, '', 'هون صار الشدّ','right');
  lab(t0+1.75, SP.x+20, SP.top+40, 60, SP.top-30, 'L1 – L5', 'الفقرات القطنية','left'); }

/* the presenter's backdrop: his white cloth is replaced by the series' white + purple shimmer (person cut out per frame) */
function presenterBg(t){ if(!((t>=T_P&&t<T_M)||(t>=T_P6&&t<VEND))) return; injShimmer(t,T_P-1.2,0.75); if(PRS_OK) X.drawImage(PRS,0,0,W,H); }
SCENE_LIST.push(['presenterBg',presenterBg,'video']);
SCENE_LIST.push(['medBg',medBg,'video']);
SCENE_LIST.push(['spine',spine]);
SCENE_LIST.push(['hookTag',hookTag]);
SCENE_LIST.push(['titleCard',titleCard]);
SCENE_LIST.push(['flashes',flashes]);


/* sources — every medical claim carries its source on screen, at the moment it is made (series rule) */
const INJ_SRC=[{s:T_M+0.3,e:T_M4-0.1,text:'المصدر: Physio-pedia — Lumbar Strain'},{s:T_M5+0.3,e:T_P6-0.1,text:'المصدر: AANS — Low Back Strain and Sprain'}];
function srcLine(t){ INJ_SRC.forEach(c=>{ const ce=c.e||(VEND-0.05); if(t<c.s||t>ce) return; const k=ik(t,c.s,0.3)*(1-pr(t,ce-0.2,ce)); if(k<=0) return;
  X.save(); X.globalAlpha=k*0.9; X.font='700 26px Inter, '+FONT; X.fillStyle='rgba(199,125,219,0.95)'; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl';
  X.fillText(c.text,540,1585); X.restore(); }); }
SCENE_LIST.push(['srcLine',srcLine]);
/* footage credit under the REAL FOOTAGE tag — the original creator, always named */
const INJ_CREDIT='الفيديو: @اسم_الحساب';
function credit(t){ if(t>T_P) return; const k=ik(t,0.3,0.3)*(1-pr(t,T_P-0.25,T_P)); if(k<=0) return;
  X.save(); X.globalAlpha=k; X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=12; X.font='800 26px '+FONT; X.fillStyle='#FFFFFF'; X.textAlign='left'; X.textBaseline='middle'; X.direction='rtl';
  X.fillText(INJ_CREDIT,52,282); X.restore(); }
/* EP01: the footage is the client's own, so no credit line (client, 8 Nov) */


/* chapter header on the dark canvas: small Latin kicker + Arabic title (same place every chapter, every episode) */
function chapter(t,s0,e0,lat,ar){ if(t<s0||t>=e0) return 0; const k=ik(t,s0+0.05,0.35)*(1-pr(t,e0-0.25,e0)); X.save(); X.globalAlpha=k;
  injLatin(lat,540,260,26,LIL,'center',800,4); nkTxt(ar,540,350,92,'#FFFFFF','center'); X.restore(); return k; }

/* P1: the episode's three questions, each on its word (white glass rows, purple numbers) */
function questions(t){ if(t<T_P||t>=T_P2) return; const out=1-pr(t,T_P2-0.25,T_P2);
  const rows=[['١','شو صار؟',nkS(1,0)],['٢','ليش صار؟',nkS(2,0)],['٣','كيف تحمي حالك؟',nkS(3,0)]];
  rows.forEach(([n,txt,at],i)=>{ const k=ik(t,at-0.05,0.3); if(k<=0) return; const y=1130+i*104, x=230, w=620, h=86;
    X.save(); X.globalAlpha=k*out; X.translate((1-k)*40,0); X.shadowColor='rgba(118,2,138,0.22)'; X.shadowBlur=40; X.shadowOffsetY=12;
    X.fillStyle='rgba(255,255,255,0.94)'; rr(x,y,w,h,h/2); X.fill(); X.shadowColor='transparent';
    X.fillStyle=PURPLE; X.beginPath(); X.arc(x+w-h/2,y+h/2,h/2-10,0,7); X.fill(); nkTxt(n,x+w-h/2,y+h/2+3,38,'#FFFFFF','center');
    nkTxt(txt,x+w-h-18,y+h/2+3,44,INJ_INK,'right'); X.restore(); }); }
SCENE_LIST.push(['questions',questions]);

/* M4: how to protect yourself — the wrong pull (rounded back) next to the right one (straight back, legs drive) */
function lifter(cx,good,k,glow){ const g=1300; X.save(); X.globalAlpha*=k; X.lineCap='round'; X.lineJoin='round'; X.translate(cx,1150); X.scale(1.45,1.45); X.translate(-cx,-g);
  const col=good?LIL:'rgba(255,255,255,0.55)';
  X.fillStyle='rgba(199,125,219,0.10)'; X.fillRect(cx-170,g,340,4);   // floor
  let hip,knee,ank,sh,head,bar;
  if(good){ ank=[cx-20,g-4]; knee=[cx+25,g-115]; hip=[cx-70,g-178]; sh=[cx+72,g-300]; head=[cx+110,g-326]; bar=[cx+40,g-46]; }
  else    { ank=[cx-30,g-4]; knee=[cx-36,g-122]; hip=[cx-58,g-238]; sh=[cx+92,g-258]; head=[cx+128,g-236]; bar=[cx+72,g-46]; }
  X.strokeStyle=col; X.lineWidth=7; X.beginPath(); X.arc(bar[0],bar[1],46,0,7); X.stroke(); X.fillStyle=col; X.beginPath(); X.arc(bar[0],bar[1],10,0,7); X.fill();   // plate (behind)
  X.lineWidth=16; X.beginPath(); X.moveTo(ank[0]+42,ank[1]); X.lineTo(...ank); X.lineTo(...knee); X.lineTo(...hip); X.stroke();                     // foot, shin, thigh
  X.lineWidth=24; X.beginPath(); X.moveTo(...hip); if(good) X.lineTo(...sh); else X.quadraticCurveTo(cx+18,g-388,...sh); X.stroke();              // back
  X.lineWidth=12; X.beginPath(); X.moveTo(...sh); X.lineTo(bar[0],bar[1]-8); X.stroke();                                                             // arm to the bar
  X.fillStyle=col; X.beginPath(); X.arc(...head,32,0,7); X.fill();
  if(glow>0){ const gx=good?cx-20:cx-10, gy=good?g-225:g-300, gl=X.createRadialGradient(gx,gy,6,gx,gy,90); gl.addColorStop(0,`rgba(199,125,219,${0.6*glow})`); gl.addColorStop(1,'rgba(199,125,219,0)'); X.fillStyle=gl; X.fillRect(gx-100,gy-100,200,200); }
  X.restore(); }
function technique(t){ if(t<T_M4-0.05||t>=T_M5) return; X.save(); X.globalAlpha=1-pr(t,T_M5-0.25,T_M5);
  chapter(t,T_M4,T_M5,'HOW TO PROTECT YOURSELF','كيف تحمي حالك؟');
  const kL=ik(t,T_M4+0.25,0.35), kR=ik(t,nkS(10,3)-0.1,0.35), kOK=ik(t,nkS(12,1)-0.05,0.3), kUp=ik(t,nkS(11,1)-0.05,0.35);
  lifter(300,false,kL,kL*(0.7+0.3*Math.sin(t*6)));
  if(kL>0){ X.save(); X.globalAlpha*=kL; nkMarkDot(300,1215,26,false,1); nkTxt('ضهر مقوّس',300,1290,46,'rgba(255,255,255,0.72)','center'); X.restore(); }
  lifter(790,true,kR,0);
  if(kUp>0){ X.save(); X.globalAlpha*=kUp; X.strokeStyle=LIL; X.fillStyle=LIL; X.lineWidth=7; X.lineCap='round';   // drive from the legs
    const y0=1130, y1=1130-170*kUp; X.beginPath(); X.moveTo(960,y0); X.lineTo(960,y1); X.stroke(); X.beginPath(); X.moveTo(960,y1-18); X.lineTo(944,y1+4); X.lineTo(976,y1+4); X.closePath(); X.fill(); X.restore(); }
  if(kR>0){ X.save(); X.globalAlpha*=kR; nkMarkDot(790,1215,26,true,kOK); nkTxt('ضهر مستقيم',790,1290,46,LIL,'center'); X.restore(); }
  X.restore(); }
SCENE_LIST.push(['technique',technique]);

/* M5: the good news — no surgery, and a ring that fills to 90 % (AANS: more than 90 % recover fully within a month) */
function goodNews(t){ if(t<T_M5-0.05||t>=T_P6) return; X.save(); X.globalAlpha=1-pr(t,T_P6-0.25,T_P6);
  chapter(t,T_M5,T_P6,'GOOD NEWS','خبر حلو');
  const kS=ik(t,nkS(14,4)-0.05,0.3); if(kS>0){ X.save(); X.globalAlpha*=kS; X.translate(0,(1-kS)*20); const w=470,h=84,x=540-w/2,y=450;
    glassPane(x,y,w,h,h/2,{}); nkMarkDot(x+w-h/2,y+h/2,h/2-12,true,pr(kS,0.3,1)); nkTxt('ما بدها عملية',x+w-h-14,y+h/2+3,42,'#FFFFFF','right'); X.restore(); }
  const kR=pr(t,nkS(15,0)-0.05,nkS(15,0)+0.9), kI=ik(t,nkS(15,0)-0.1,0.3);
  if(kI>0){ const cx=540,cy=830,r=220; X.save(); X.globalAlpha*=kI; X.lineCap='round';
    X.strokeStyle='rgba(255,255,255,0.10)'; X.lineWidth=26; X.beginPath(); X.arc(cx,cy,r,0,7); X.stroke();
    X.strokeStyle=LIL; X.beginPath(); X.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*0.9*ease(kR)); X.stroke();
    injLatin('+'+Math.round(90*ease(kR))+'%',cx,cy-6,150,'#FFFFFF','center',900);
    const kT=ik(t,nkS(15,0)+0.6,0.35); X.globalAlpha=kI*kT; nkTxt('بيتعافوا بالكامل خلال شهر',cx,cy+r+110,52,LIL,'center'); X.restore(); }
  X.restore(); }
SCENE_LIST.push(['goodNews',goodNews]);

/* P6: the takeaway, on the white glass card (his words) */
function takeaway(t){ if(t<T_P6) return; const k=ik(t,nkS(17,1)-0.1,0.4), k2=ik(t,nkS(18,1)-0.05,0.35), out=1-pr(t,VEND-0.2,VEND); if(k<=0||out<=0) return;
  const x=70,y=1180+(1-k)*60,w=940,h=260; X.save(); X.globalAlpha=k*out;
  X.shadowColor='rgba(118,2,138,0.25)'; X.shadowBlur=60; X.shadowOffsetY=18; X.fillStyle='rgba(255,255,255,0.94)'; rr(x,y,w,h,36); X.fill(); X.shadowColor='transparent';
  X.fillStyle=PURPLE; rr(x+w-18,y+34,8,h-68,4); X.fill();
  nkTxt('ارفع الوزن برجليك',x+w-48,y+92,70,INJ_INK,'right'); X.globalAlpha=k*out*k2; nkTxt('مو بضهرك',x+w-48,y+188,70,PURPLE,'right'); X.restore(); }
SCENE_LIST.push(['takeaway',takeaway]);

/* 6) end card: white, NITRON logo, series tag */
function injShimmer(t,s,soft){ const S=soft||1; X.save(); X.fillStyle='#FFFFFF'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[260,640,620,0],[820,1240,680,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*60, y=y0+Math.cos(u*0.7+ph)*50;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,`rgba(199,125,219,${0.30*S})`); g.addColorStop(1,'rgba(199,125,219,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const sw=-500+((u*900)%2600);   /* the sheen: a soft lilac band crossing on a diagonal */
  X.save(); X.translate(sw,0); X.rotate(-0.35); const lg=X.createLinearGradient(-160,0,160,0);
  lg.addColorStop(0,'rgba(199,125,219,0)'); lg.addColorStop(0.5,`rgba(199,125,219,${0.22*S})`); lg.addColorStop(1,'rgba(199,125,219,0)'); X.fillStyle=lg; X.fillRect(-160,-400,320,3200); X.restore();
  for(let i=0;i<14;i++){ const sx=(i*197+80)%1000+40, sy=(i*311+300)%1300+300, a=Math.max(0,Math.sin(u*2.2+i*1.3))*0.55, r=3+((i*7)%4);
    X.fillStyle=`rgba(118,2,138,${a*0.6*S})`; X.beginPath(); X.arc(sx,sy,r,0,7); X.fill(); }
  X.restore(); }
outro=function(t){ const s=VEND; if(t<s) return; X.save(); X.fillStyle='#0A0A0C'; X.fillRect(0,0,W,H); const u=t-s;
  for(const [x0,y0,r,ph] of [[420,820,700,0],[700,1100,620,1.7]]){ const x=x0+Math.sin(u*0.9+ph)*50, y=y0+Math.cos(u*0.7+ph)*40;
    const g=X.createRadialGradient(x,y,20,x,y,r); g.addColorStop(0,'rgba(118,2,138,0.42)'); g.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=g; X.fillRect(0,0,W,H); }
  const k1=ik(t,s+0.15,0.4); if(k1>0&&LOGO.naturalWidth){ const lw=640, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth; X.globalAlpha=k1; X.drawImage(LOGO,540-lw/2,860-lh/2-(1-k1)*14,lw,lh); }
  const k2=ik(t,s+0.45,0.35); if(k2>0){ X.globalAlpha=1; X.fillStyle=PURPLE; rr(540-210*k2,990,420*k2,10,5); X.fill(); }
  const k3=ik(t,s+0.6,0.35); if(k3>0){ X.globalAlpha=k3; injLatin('INJURY BREAKDOWN',540,1068,34,LIL,'center',800,6); injLatin('EP 01 / 10',540,1122,26,'rgba(255,255,255,0.6)','center',700,4); }
  const k4=ik(t,s+0.8,0.35); if(k4>0){ X.globalAlpha=k4*0.85; nkTxt('المصادر',540,1330,30,LIL,'center'); injLatin('AANS — Low Back Strain and Sprain',540,1385,24,'rgba(255,255,255,0.75)','center',600); injLatin('Physio-pedia — Lumbar Strain',540,1425,24,'rgba(255,255,255,0.75)','center',600); }
  X.restore(); injFlash(t,s); };
