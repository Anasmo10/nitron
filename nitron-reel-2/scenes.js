/* ═══ Nitron reel #2 — «لا تشتريها لأنو منظرها حلو» · scenes (brand: black · white · purple) ═══ */
const IMG=s=>{const i=new Image(); i.src=s; return i;};
const STK_A=IMG('stk_straps.png'), STK_B=IMG('stk_wraps.png'), WORD=IMG('logo_word.png');
(function(){ const _init=window.init;
  window.init=o=>Promise.resolve(_init(o)).then(r=>Promise.all([STK_A,STK_B,WORD].map(i=>(i.decode?i.decode():0).catch(()=>0))).then(()=>r)); })();
/* clip map (cut time): P1 0–2.80 hook · P2 2.80–4.667 · P3 4.667–9.567 (info panel) · P4a 9.567–10.533 · P4b 10.533–11.567 */
const T_P2=2.8, T_P3=4.667, T_P4=9.567, T_P4B=10.533;
SCENES=[{s:0,e:T_P2,m:R_FULL,nocap:true},{s:T_P2,e:T_P3,m:R_FULL},{s:T_P3,e:T_P4,m:R_DOWN,gb:500},
        {s:T_P4,e:T_P4B,m:R_FULL},{s:T_P4B,e:99,m:R_FULL,nocap:true}];
const ws=(c,i)=>wordsOf(c)[i].s;                        /* start of word i in caption card c */
const kin=(t,t0,d)=>ease(pr(t,t0,t0+(d||0.22)));
function txt(s,x,y,size,col,al,a){ X.save(); X.globalAlpha*=(a===undefined?1:a); X.font='900 '+size+'px '+FONT;
  X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(s,x,y); X.restore(); }

/* ── 1) HOOK 0–2.80: brand stage, video card, head breaking out over the card edge ── */
const HK={ox:108,oy:386,s:0.80,top:860,x0:108,x1:972,r:44};   /* head top lands ~y420, card edge at the chin */
function hookGeo(t){
  const kIn=ease(pr(t,0,0.38)), kOut=eio(pr(t,2.56,2.80)), drift=0.012*pr(t,0.38,2.56);
  let s=lerp(0.66,HK.s,kIn)+drift, ox=540-(540-HK.ox)*(s/HK.s), oy=HK.oy+lerp(150,0,kIn);
  let top=lerp(980,HK.top,kIn), x0=540-(540-HK.x0)*(s/HK.s), x1=540+(HK.x1-540)*(s/HK.s), r=HK.r;
  if(kOut>0){ s=lerp(s,1,kOut); ox=lerp(ox,0,kOut); oy=lerp(oy,0,kOut); top=lerp(top,0,kOut); x0=lerp(x0,0,kOut); x1=lerp(x1,W,kOut); r=lerp(r,0,kOut); }
  return {s,ox,oy,top,x0,x1,r,out:kOut};
}
function sticker(img,cx,cy,w,rot,k,stamp,dead){
  if(k<=0||!img.naturalWidth) return; const h=w*img.naturalHeight/img.naturalWidth;
  X.save(); X.translate(cx,cy); X.rotate(rot); const sc=0.55+0.45*ease(k); X.scale(sc,sc); X.globalAlpha*=Math.min(1,k*2.2);
  X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=26; X.shadowOffsetY=12;
  if(dead>0) X.filter='grayscale('+(0.85*dead).toFixed(2)+') brightness('+(1-0.25*dead).toFixed(2)+')';
  X.drawImage(img,-w/2,-h/2,w,h); X.filter='none'; X.shadowColor='transparent';
  if(stamp>0){ const a=w*0.30*ease(stamp), L=[[-1,-1,1,1],[1,-1,-1,1]];
    X.lineCap='round';
    for(const [lw,c] of [[30,'#FFFFFF'],[18,ACC]]){ X.strokeStyle=c; X.lineWidth=lw; X.beginPath();
      for(const [x0,y0,x1,y1] of L){ X.moveTo(x0*a,y0*a); X.lineTo(lerp(x0,x1,1)*a,lerp(y0,y1,1)*a); } X.stroke(); } }
  X.restore();
}
function hookStage(t){
  if(t>=T_P2) return; const G=hookGeo(t), fade=1-pr(t,2.52,2.70);
  X.save(); X.fillStyle=BG; X.fillRect(0,0,W,H);
  const gr=X.createRadialGradient(540,420,40,540,420,760); gr.addColorStop(0,'rgba(118,2,138,0.38)'); gr.addColorStop(1,'rgba(118,2,138,0)');
  X.fillStyle=gr; X.fillRect(0,0,W,H); grid(); X.restore();
  /* kicker: «بالجيم في شغلات» word by word */
  X.save(); X.globalAlpha=fade; X.translate(0,-60*pr(t,2.52,2.70));
  const kw=wordsOf(0).map(w=>w.t), fs=58; X.font='900 '+fs+'px '+FONT; const sp=X.measureText(' ').width;
  const wd=kw.map(s=>X.measureText(s).width), tot=wd.reduce((a,b)=>a+b,0)+sp*(kw.length-1); let x=540+tot/2;
  kw.forEach((s,i)=>{ const k=kin(t,wordsOf(0)[i].s-0.04,0.18); txt(s,x,232+(1-k)*18,fs,i===2?ACCTXT||ACC:INK,'right',k); x-=wd[i]+sp; });
  /* the big claim, slammed behind his head */
  const big=[['لا',ws(1,0)],['تشتريها',ws(1,1)]]; const BF=196; X.font='900 '+BF+'px '+FONT;
  const bw=big.map(b=>X.measureText(b[0]).width), btot=bw[0]+bw[1]+BF*0.22; let bx=540+btot/2;
  big.forEach(([s,t0],i)=>{ const k=pr(t,t0-0.03,t0+0.16); if(k<=0){ bx-=bw[i]+BF*0.22; return; }
    const sc=1.45-0.45*ease(k); X.save(); X.translate(bx-bw[i]/2,372); X.scale(sc,sc);
    X.shadowColor='rgba(0,0,0,0.55)'; X.shadowBlur=30; X.shadowOffsetY=10; txt(s,0,0,BF,'#FFFFFF','center',Math.min(1,k*2)); X.restore();
    bx-=bw[i]+BF*0.22; });
  const ub=kin(t,ws(1,1)+0.14,0.24); if(ub>0){ X.save(); X.fillStyle=ACC; rr(540-btot/2*ub,480,btot*ub,14,7); X.fill(); X.restore(); }
  X.restore();
  /* stickers flank the head; stamped ✕ on «لا تشتريها» */
  const sk=kin(t,ws(0,2)-0.02,0.30), st1=kin(t,ws(1,0)+0.06,0.16), st2=kin(t,ws(1,1)+0.10,0.16), fl=Math.sin(t*3.1)*0.03;
  X.save(); X.globalAlpha=fade;
  sticker(STK_A,196,690,380,-0.21+fl,sk,st1,st1); sticker(STK_B,884,716,370,0.17-fl,kin(t,ws(0,2)+0.10,0.30),st2,st2);
  X.restore();
  /* video card */
  const vb=G.oy+H*G.s; X.save(); X.beginPath(); rr(G.x0,G.top,G.x1-G.x0,vb-G.top,G.r); X.save();
  X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=60; X.shadowOffsetY=20; X.fillStyle='#000'; X.fill(); X.restore();
  X.clip(); X.drawImage(VF,G.ox,G.oy,W*G.s,H*G.s); X.restore();
  if(G.out<1){ X.save(); X.globalAlpha=1-G.out; X.strokeStyle=ACC; X.lineWidth=5; rr(G.x0,G.top,G.x1-G.x0,G.oy+H*G.s-G.top,G.r); X.stroke(); X.restore(); }
  /* head out of the card */
  if(PRS_OK&&G.top>4){ X.save(); X.beginPath(); X.rect(0,0,W,G.top+2); X.clip(); X.drawImage(PRS,G.ox,G.oy,W*G.s,H*G.s); X.restore(); }
  /* the reason, struck out: «لأنو منظرها حلو» */
  const r0=ws(1,2), kr=kin(t,r0-0.05,0.22); if(kr>0){
    const line=['لأنو','منظرها','حلو']; X.save(); X.globalAlpha=fade*Math.min(1,kr*1.6); X.font='900 58px '+FONT;
    const lw=line.map(s=>X.measureText(s).width), sp2=X.measureText(' ').width, lt=lw.reduce((a,b)=>a+b,0)+sp2*2, cy=1488+(1-kr)*20;
    sh(40,14,0.30); X.fillStyle='rgba(10,10,12,0.94)'; rr(540-lt/2-44,cy-56,lt+88,112,30); X.fill(); nsh();
    let x=540+lt/2; line.forEach((s,i)=>{ const on=t>=wordsOf(1)[2+i].s; txt(s,x,cy+2,58,on?(i===2?(ACCTXT||ACC):INK):'rgba(255,255,255,0.35)','right'); x-=lw[i]+sp2; });
    const ks=kin(t,wordsOf(1)[4].e+0.02,0.16); if(ks>0){ const sx=540+lt/2-lw[0]-sp2+8, ex=540-lt/2-8;
      X.strokeStyle=ACC; X.lineWidth=9; X.lineCap='round'; X.beginPath(); X.moveTo(sx,cy+4); X.lineTo(lerp(sx,ex,ks),cy+4); X.stroke(); }
    X.restore(); }
}
hookStage.layer='video'; SCENE_LIST.push(['hookStage',hookStage,'video']);

/* ── 2) «اشتريها مشان تحل مشكلتك»: the reason flips from looks to the problem ── */
function flipPill(t){
  if(t<T_P2||t>T_P3) return; const k=kin(t,ws(2,0)-0.02,0.26), out=1-pr(t,T_P3-0.18,T_P3); if(k<=0) return;
  const flip=eio(pr(t,ws(2,3)-0.04,ws(2,3)+0.24)), w=760,h=124,x0=540-w/2,y0=196+(1-k)*-30, half=w/2;
  X.save(); X.globalAlpha=Math.min(1,k*1.5)*out;
  sh(46,16,0.35); X.fillStyle='rgba(10,10,12,0.92)'; rr(x0,y0,w,h,h/2); X.fill(); nsh();
  X.strokeStyle='rgba(255,255,255,0.10)'; X.lineWidth=2; rr(x0,y0,w,h,h/2); X.stroke();
  const kx=lerp(x0+half,x0,flip); X.fillStyle=flip<0.5?'rgba(255,255,255,0.14)':ACC; rr(kx+8,y0+8,half-16,h-16,(h-16)/2); X.fill();
  /* right half: «للمنظر» (RTL first) · left half: «لمشكلتك» */
  const cyy=y0+h/2+2; txt('للمنظر',x0+half*1.5,cyy,48,flip<0.5?INK:'rgba(255,255,255,0.38)','center');
  if(flip>0.5){ X.save(); X.strokeStyle='rgba(255,255,255,0.55)'; X.lineWidth=6; X.lineCap='round'; X.beginPath();
    X.moveTo(x0+half*1.5+92,cyy); X.lineTo(lerp(x0+half*1.5+92,x0+half*1.5-92,pr(t,ws(2,3)+0.10,ws(2,3)+0.30)),cyy); X.stroke(); X.restore(); }
  txt('لمشكلتك',x0+half*0.5+(flip>0.5?22:0),cyy,48,flip>0.5?'#FFFFFF':'rgba(255,255,255,0.38)','center');
  if(flip>0.5) iCheck(x0+half*0.5-118,cyy,44,'#FFFFFF',pr(t,ws(2,3)+0.12,ws(2,3)+0.40));
  X.restore();
}
SCENE_LIST.push(['flipPill',flipPill]);

/* ── 3) grip vs back: grip drains first, the figure-8 strap refills it, then every pull gets a chip ── */
function meter(y,label,lv,t,flash){
  const L=140,R=760,h=28; txt(label,940,y,36,INK,'right');
  X.save(); X.fillStyle='rgba(255,255,255,0.12)'; rr(L,y-h/2,R-L,h,h/2); X.fill();
  const wv=(R-L)*cl(lv,0,1); X.fillStyle=lv<0.25?(Math.floor(t*8)%2?'#FFFFFF':ACC):ACC; if(wv>2){ rr(R-wv,y-h/2,wv,h,h/2); X.fill(); }
  if(flash>0){ X.globalAlpha=flash; X.strokeStyle='#FFFFFF'; X.lineWidth=3; rr(L-4,y-h/2-4,R-L+8,h+8,(h+8)/2); X.stroke(); }
  X.restore();
}
function gripPanel(t){
  if(t<T_P3||t>T_P4) return;
  panelIn(t,T_P3,T_P4,()=>{
    const drain=eio(pr(t,ws(3,1),ws(3,3)+0.25)), refill=ease(pr(t,ws(4,2)-0.05,ws(4,2)+0.40));
    const grip=lerp(1,0.12,drain)+(1-0.12)*refill, back=lerp(1,0.80,drain);
    meter(300,'القبضة',grip,t,1-pr(t,ws(4,2)+0.05,ws(4,2)+0.6)>0&&refill>0?1-pr(t,ws(4,2)+0.05,ws(4,2)+0.6):0);
    meter(360,'الضهر',back,t,0);
    const kt=kin(t,ws(4,2)+0.10,0.24); if(kt>0){ X.save(); X.globalAlpha=kt; X.font='900 26px Inter, '+FONT;
      const s='+ FIGURE 8 STRAP', tw=X.measureText(s).width; X.fillStyle=ACC; rr(140,252-14*kt,tw+36,38,19); X.fill();
      X.fillStyle='#FFFFFF'; X.textAlign='left'; X.textBaseline='middle'; X.direction='ltr'; X.fillText(s,158,252-14*kt+20); X.restore(); }
    const chips=[['ديدلفت',ws(5,4)],['رو',ws(5,4)+0.12],['شراغز',ws(5,5)]];
    let x=940; chips.forEach(([s,t0])=>{ const k=kin(t,t0-0.04,0.20); X.font='900 32px '+FONT; const cw=X.measureText(s).width+48;
      if(k>0){ X.save(); X.globalAlpha=Math.min(1,k*1.6); const yy=432+(1-k)*14; X.fillStyle='rgba(255,255,255,0.10)'; rr(x-cw,yy-25,cw,50,25); X.fill();
        X.strokeStyle=ACC; X.lineWidth=3; rr(x-cw,yy-25,cw,50,25); X.stroke(); txt(s,x-cw/2,yy+1,32,INK,'center'); X.restore(); }
      x-=cw+14; });
  });
}
SCENE_LIST.push(['gripPanel',gripPanel]);

/* ── 4) «اطلبه من نايترون»: brand plate slides up, wordmark wipes in on «نايترون» ── */
function brandPlate(t){
  if(t<T_P4B-0.05||t>VEND) return; const k=kin(t,ws(7,0)-0.06,0.30), kw=kin(t,ws(7,2)-0.04,0.34), out=1-pr(t,VEND-0.12,VEND);
  if(k<=0) return; const x0=120,w=820,y0=1236+(1-k)*60,h=248;
  X.save(); X.globalAlpha=Math.min(1,k*1.4)*out;
  sh(60,20,0.45); X.fillStyle='rgba(10,10,12,0.95)'; rr(x0,y0,w,h,40); X.fill(); nsh();
  X.strokeStyle=ACC; X.lineWidth=4; rr(x0,y0,w,h,40); X.stroke();
  txt('اطلبه من',540,y0+58,46,MUT,'center');
  if(kw>0&&WORD.naturalWidth){ const lw=600, lh=lw*WORD.naturalHeight/WORD.naturalWidth, ly=y0+92;
    X.save(); X.beginPath(); X.rect(540+lw/2-lw*kw-4,ly-6,lw*kw+8,lh+12); X.clip(); X.drawImage(WORD,540-lw/2,ly,lw,lh); X.restore();
    X.fillStyle='#FFFFFF'; X.globalAlpha*=0.9*(1-pr(t,ws(7,2)+0.30,ws(7,2)+0.42)); if(kw<1) X.fillRect(540+lw/2-lw*kw-6,ly-8,5,lh+16); }
  X.restore();
}
SCENE_LIST.push(['brandPlate',brandPlate]);

/* ── 5) closing card: the full logo + his point in one line ── */
outro=function(t){ const s=VEND; if(t<s) return;
  const wipe=eio(pr(t,s,s+0.40)), top=H*(1-wipe);
  X.save(); X.fillStyle=BG; X.fillRect(0,top,W,H); X.beginPath(); X.rect(0,top,W,H); X.clip(); X.translate(0,top);
  const gr=X.createRadialGradient(540,720,30,540,720,700); gr.addColorStop(0,'rgba(118,2,138,0.30)'); gr.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gr; X.fillRect(0,0,W,H);
  const k1=ease(pr(t,s+0.26,s+0.72));
  if(k1>0&&LOGO.naturalWidth){ const lw=860, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth, sc=0.95+0.05*k1;
    X.save(); X.globalAlpha=k1; X.translate(540,700); X.scale(sc,sc); X.drawImage(LOGO,-lw/2,-lh/2,lw,lh); X.restore(); }
  const k2=ease(pr(t,s+0.55,s+0.95)); if(k2>0){ X.save(); X.fillStyle=ACC; rr(540-260*k2,905,520*k2,10,5); X.fill(); X.restore(); }
  const k3=ease(pr(t,s+0.75,s+1.15)); if(k3>0) txt('اشتري للمشكلة… مو للمنظر',540,1010+(1-k3)*16,60,INK,'center',k3);
  const k4=ease(pr(t,s+1.05,s+1.45));
  if(k4>0){ X.save(); X.globalAlpha=k4; const label='اطلبه من نايترون'; X.font='900 50px '+FONT; const w=X.measureText(label).width+110;
    const sc=0.95+0.05*k4; X.translate(540,1160); X.scale(sc,sc); sh(36,14,0.25); X.fillStyle=ACC; rr(-w/2,-58,w,116,58); X.fill(); nsh();
    txt(label,0,3,50,'#FFFFFF','center'); X.restore(); }
  X.restore(); };
