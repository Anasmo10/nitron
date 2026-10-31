/* ═══ Nitron kit — scene components (house style v1, from reel #2) ═══
   Loaded after the engine (compose.html). A reel's scenes.js only sets SCENES and calls these.
   Brand: black #0A0A0C · white · purple #76028A (acc) · light purple #C77DDB (accText) · Cairo 900.
   Rules: everything lands on a spoken word · ease-out 0.18–0.30 s · no bounce · no text on the face. */
const nkImg=s=>{const i=new Image(); i.src=s; return i;};
const NK_WAIT=[];   /* images the first frame must not render without */
function nkUse(src){ const i=nkImg(src); NK_WAIT.push(i); return i; }
(function(){ const _init=window.init;
  window.init=o=>Promise.resolve(_init(o)).then(r=>Promise.all(NK_WAIT.map(i=>(i.decode?i.decode():0).catch(()=>0))).then(()=>r)); })();
const nkW=(c,i)=>wordsOf(c)[i];                                   /* word i of caption card c */
const nkS=(c,i)=>wordsOf(c)[i].s;
const nkK=(t,t0,d)=>ease(pr(t,t0,t0+(d||0.22)));
function nkTxt(s,x,y,size,col,al,a,weight){ X.save(); X.globalAlpha*=(a===undefined?1:a); X.font=(weight||900)+' '+size+'px '+FONT;
  X.fillStyle=col; X.textAlign=al||'center'; X.textBaseline='middle'; X.direction='rtl'; X.fillText(s,x,y); X.restore(); }
function nkLatin(s,x,y,size,col,al){ X.save(); X.font='900 '+size+'px Inter, '+FONT; X.fillStyle=col; X.textAlign=al||'center';
  X.textBaseline='middle'; X.direction='ltr'; X.fillText(s,x,y); X.restore(); }

/* stage: the black-purple grid every Nitron card scene sits on */
function nkStage(cy,glow){ X.save(); X.fillStyle=BG; X.fillRect(0,0,W,H); const ga=0.38*(glow===undefined?1:glow);
  const g=X.createRadialGradient(540,cy||420,40,540,cy||420,760); g.addColorStop(0,'rgba(118,2,138,'+ga.toFixed(3)+')'); g.addColorStop(1,'rgba(118,2,138,0)');
  X.fillStyle=g; X.fillRect(0,0,W,H); grid(); X.restore(); }

/* product art: the real photo when it exists, otherwise a drawn wrist-wrap glyph (never an empty slot) */
function nkWrapGlyph(cx,cy,w){ const h=w*1.05; X.save(); X.translate(cx,cy); X.rotate(-0.10);
  X.fillStyle='#111114'; rr(-w*0.22,-h/2,w*0.44,h,w*0.06); X.fill();
  X.fillStyle='#E8742A'; for(const dx of [-0.11,0,0.11]){ X.fillRect(dx*w-w*0.025,-h*0.30,w*0.05,h*0.62); }
  X.fillStyle='#1d1d22'; rr(-w*0.22,-h/2,w*0.44,h*0.20,w*0.05); X.fill();
  X.strokeStyle='#2a2a30'; X.lineWidth=w*0.035; X.beginPath(); X.ellipse(0,-h/2-w*0.12,w*0.09,w*0.14,0,0,7); X.stroke();
  X.restore(); }
function nkProductArt(img,cx,cy,w){ if(img&&img.naturalWidth){ const h=w*img.naturalHeight/img.naturalWidth; X.drawImage(img,cx-w/2,cy-h/2,w,h); }
  else nkWrapGlyph(cx,cy,w*0.85); }

/* sticker with white rim; stamp = purple ✕ that grows in; dead = greys it out */
function nkSticker(img,cx,cy,w,rot,k,stamp,dead){
  if(k<=0) return; X.save(); X.translate(cx,cy); X.rotate(rot); const sc=0.55+0.45*ease(k); X.scale(sc,sc); X.globalAlpha*=Math.min(1,k*2.2);
  X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=26; X.shadowOffsetY=12;
  if(dead>0) X.filter='grayscale('+(0.85*dead).toFixed(2)+') brightness('+(1-0.25*dead).toFixed(2)+')';
  if(img&&img.naturalWidth){ const h=w*img.naturalHeight/img.naturalWidth; X.drawImage(img,-w/2,-h/2,w,h); }
  else { X.fillStyle='#FFFFFF'; rr(-w*0.40,-w*0.46,w*0.80,w*0.92,w*0.12); X.fill(); X.shadowColor='transparent'; nkWrapGlyph(0,0,w*0.62); }
  X.filter='none'; X.shadowColor='transparent';
  if(stamp>0){ const a=w*0.30*ease(stamp); X.lineCap='round';
    for(const [lw,c] of [[30,'#FFFFFF'],[18,ACC]]){ X.strokeStyle=c; X.lineWidth=lw; X.beginPath(); X.moveTo(-a,-a); X.lineTo(a,a); X.moveTo(a,-a); X.lineTo(-a,a); X.stroke(); } }
  X.restore(); }

/* ── HOOK CARD ── video in a rounded card on the stage, head breaking out over its top edge,
   kicker line word by word, big headline(s) slammed behind the head, optional stickers.
   cfg = {end, face:{headtop,cy,fw}, kicker:{card, hi:[word indices]}, heads:[{text,at}], stickers:[{img,x,y,w,rot,in,stamp}]} */
function nkHookGeo(t,cfg){
  const S0=0.80, f=cfg.face, oy0=444-f.headtop*S0, ox0=(W-W*S0)/2, top0=Math.min(1000,oy0+(f.cy+0.62*f.fw)*S0);
  const kIn=ease(pr(t,0,0.38)), kOut=eio(pr(t,cfg.end-0.24,cfg.end)), drift=0.012*pr(t,0.38,cfg.end-0.24);
  let s=lerp(0.66,S0,kIn)+drift, ox=540-(540-ox0)*(s/S0), oy=oy0+lerp(150,0,kIn), top=lerp(top0+140,top0,kIn);
  let x0=540-(540-ox0)*(s/S0), x1=540+(W-ox0-540)*(s/S0), r=44;
  if(kOut>0){ /* exit straight into the next layout (full screen, or the lower card of an info panel) */
    const R=cfg.exitRect||{x:0,y:0,w:W,h:H,r:0}, se=Math.max(R.w/W,R.h/H), oxe=R.x+(R.w-W*se)/2;
    s=lerp(s,se,kOut); ox=lerp(ox,oxe,kOut); oy=lerp(oy,R.y,kOut); top=lerp(top,R.y,kOut); x0=lerp(x0,R.x,kOut); x1=lerp(x1,R.x+R.w,kOut); r=lerp(r,R.r||0,kOut); }
  return {s,ox,oy,top,x0,x1,r,out:kOut};
}
function nkHook(t,cfg){
  if(t>=cfg.end) return; const G=nkHookGeo(t,cfg), fade=1-pr(t,cfg.end-0.28,cfg.end-0.10);
  nkStage(420,1-G.out);
  /* kicker */
  X.save(); X.globalAlpha=fade; X.translate(0,-60*pr(t,cfg.end-0.28,cfg.end-0.10));
  const kc=cfg.kicker, kw=wordsOf(kc.card).map(w=>w.t), fs=58; X.font='900 '+fs+'px '+FONT; const sp=X.measureText(' ').width;
  const wd=kw.map(s=>X.measureText(s).width), tot=wd.reduce((a,b)=>a+b,0)+sp*(kw.length-1); let x=540+tot/2;
  kw.forEach((s,i)=>{ const k=nkK(t,wordsOf(kc.card)[i].s-0.04,0.18); nkTxt(s,x,232+(1-k)*18,fs,(kc.hi||[]).includes(i)?(ACCTXT||ACC):INK,'right',k); x-=wd[i]+sp; });
  /* headlines: each new one replaces the previous (old one lifts away, new one slams in) */
  const BF=cfg.headSize||176;
  cfg.heads.forEach((h,i)=>{ const nx=cfg.heads[i+1], k=pr(t,h.at-0.03,h.at+0.16); if(k<=0) return;
    const gone=nx?pr(t,nx.at-0.06,nx.at+0.06):0; if(gone>=1) return;
    X.font='900 '+BF+'px '+FONT; const fit=Math.min(BF,Math.floor(BF*940/X.measureText(h.text).width));   /* auto-fit: 70px side margins */
    X.save(); const sc=1.45-0.45*ease(k); X.translate(540,372-40*gone); X.scale(sc,sc);
    X.shadowColor='rgba(0,0,0,0.55)'; X.shadowBlur=30; X.shadowOffsetY=10; nkTxt(h.text,0,0,fit,'#FFFFFF','center',Math.min(1,k*2)*(1-gone)); X.restore();
    const ub=nkK(t,h.at+0.14,0.24)*(1-gone); if(ub>0){ X.font='900 '+fit+'px '+FONT; const bw=X.measureText(h.text).width; X.save(); X.fillStyle=ACC; rr(540-bw/2*ub,478,bw*ub,14,7); X.fill(); X.restore(); } });
  X.restore();
  /* stickers flank the head */
  X.save(); X.globalAlpha=fade; const fl=Math.sin(t*3.1)*0.03;
  (cfg.stickers||[]).forEach((s,i)=>{ const st=s.stamp?nkK(t,s.stamp,0.16):0; nkSticker(s.img,s.x,s.y,s.w,s.rot+(i%2?-fl:fl),nkK(t,s.in,0.30),st,st); });
  X.restore();
  /* the card */
  const vb=G.oy+H*G.s; X.save(); X.beginPath(); rr(G.x0,G.top,G.x1-G.x0,vb-G.top,G.r); X.save();
  X.shadowColor='rgba(0,0,0,0.6)'; X.shadowBlur=60; X.shadowOffsetY=20; X.fillStyle='#000'; X.fill(); X.restore();
  X.clip(); X.drawImage(VF,G.ox,G.oy,W*G.s,H*G.s); X.restore();
  if(G.out<1){ X.save(); X.globalAlpha=1-G.out; X.strokeStyle=ACC; X.lineWidth=5; rr(G.x0,G.top,G.x1-G.x0,vb-G.top,G.r); X.stroke(); X.restore(); }
  if(PRS_OK&&G.top>4){ X.save(); X.beginPath(); X.rect(0,0,W,G.top+2); X.clip(); X.drawImage(PRS,G.ox,G.oy,W*G.s,H*G.s); X.restore(); }
}

/* ── PANEL PIECES (inside panelIn, coordinates 130..950 × 278..458, scaled 1.2 by the engine) ── */
function nkMark(cx,cy,r,ok,k){ X.save(); X.fillStyle=ok?ACC:'rgba(255,255,255,0.14)'; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill();
  if(ok) iCheck(cx,cy,r*0.95,'#FFFFFF',k); else { const a=r*0.42*ease(k); X.strokeStyle='rgba(255,255,255,0.85)'; X.lineWidth=r*0.18; X.lineCap='round';
    X.beginPath(); X.moveTo(cx-a,cy-a); X.lineTo(cx+a,cy+a); X.moveTo(cx+a,cy-a); X.lineTo(cx-a,cy+a); X.stroke(); } X.restore(); }
function nkRow(x1,x0,cy,h,text,ok,k,strike){   /* RTL row: mark on the right, text to its left */
  if(k<=0) return; X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate((1-k)*-22,0);
  X.fillStyle=ok?'rgba(118,2,138,0.22)':'rgba(255,255,255,0.06)'; rr(x0,cy-h/2,x1-x0,h,h/2); X.fill();
  X.strokeStyle=ok?ACC:'rgba(255,255,255,0.18)'; X.lineWidth=3; rr(x0,cy-h/2,x1-x0,h,h/2); X.stroke();
  nkMark(x1-h/2,cy,h/2-9,ok,pr(k,0.3,1)); nkTxt(text,x1-h-16,cy+2,h*0.50,ok?'#FFFFFF':'rgba(255,255,255,0.62)','right');
  if(strike>0){ X.font='900 '+(h*0.50)+'px '+FONT; const tw=X.measureText(text).width, sx=x1-h-14; X.strokeStyle=ACC; X.lineWidth=6; X.lineCap='round';
    X.beginPath(); X.moveTo(sx,cy+3); X.lineTo(sx-(tw+8)*strike,cy+3); X.stroke(); }
  X.restore(); }
function nkPill(cx,cy,text,k,fill){ if(k<=0) return; X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.font='900 34px '+FONT;
  const w=X.measureText(text).width+56, sc=0.94+0.06*k; X.translate(cx,cy+(1-k)*14); X.scale(sc,sc);
  X.fillStyle=fill||'rgba(255,255,255,0.10)'; rr(-w/2,-28,w,56,28); X.fill(); if(!fill){ X.strokeStyle=ACC; X.lineWidth=3; rr(-w/2,-28,w,56,28); X.stroke(); }
  nkTxt(text,0,2,34,'#FFFFFF','center'); X.restore(); return w; }

/* ── BRAND PLATE: «اطلبه من» + NITRON wordmark wipe (lower third) ── */
function nkBrandPlate(t,cfg){ const WORD=cfg.word; if(t<cfg.s-0.05||t>cfg.e) return; const k=nkK(t,cfg.s,0.30), kw=nkK(t,cfg.logoAt-0.04,0.34), out=1-pr(t,cfg.e-0.12,cfg.e);
  if(k<=0) return; const x0=120,w=820,y0=1236+(1-k)*60,h=248; X.save(); X.globalAlpha=Math.min(1,k*1.4)*out;
  sh(60,20,0.45); X.fillStyle='rgba(10,10,12,0.95)'; rr(x0,y0,w,h,40); X.fill(); nsh(); X.strokeStyle=ACC; X.lineWidth=4; rr(x0,y0,w,h,40); X.stroke();
  nkTxt(cfg.label||'اطلبه من',540,y0+58,46,MUT,'center');
  if(kw>0&&WORD.naturalWidth){ const lw=600, lh=lw*WORD.naturalHeight/WORD.naturalWidth, ly=y0+92; X.save(); X.beginPath(); X.rect(540+lw/2-lw*kw-4,ly-6,lw*kw+8,lh+12); X.clip(); X.drawImage(WORD,540-lw/2,ly,lw,lh); X.restore(); }
  X.restore(); }

/* ── OUTRO CARD: full logo · purple rule · one-line takeaway · CTA pill ── */
function nkOutro(cfg){ return function(t){ const s=VEND; if(t<s) return;
  const wipe=eio(pr(t,s,s+0.40)), top=H*(1-wipe);
  X.save(); X.fillStyle=BG; X.fillRect(0,top,W,H); X.beginPath(); X.rect(0,top,W,H); X.clip(); X.translate(0,top);
  const gr=X.createRadialGradient(540,720,30,540,720,700); gr.addColorStop(0,'rgba(118,2,138,0.30)'); gr.addColorStop(1,'rgba(118,2,138,0)'); X.fillStyle=gr; X.fillRect(0,0,W,H);
  const k1=ease(pr(t,s+0.26,s+0.72));
  if(k1>0&&LOGO.naturalWidth){ const lw=860, lh=lw*LOGO.naturalHeight/LOGO.naturalWidth, sc=0.95+0.05*k1; X.save(); X.globalAlpha=k1; X.translate(540,700); X.scale(sc,sc); X.drawImage(LOGO,-lw/2,-lh/2,lw,lh); X.restore(); }
  const k2=ease(pr(t,s+0.55,s+0.95)); if(k2>0){ X.save(); X.fillStyle=ACC; rr(540-260*k2,905,520*k2,10,5); X.fill(); X.restore(); }
  const k3=ease(pr(t,s+0.75,s+1.15)); if(k3>0) nkTxt(cfg.line,540,1010+(1-k3)*16,cfg.lineSize||60,INK,'center',k3);
  const k4=ease(pr(t,s+1.05,s+1.45));
  if(k4>0){ X.save(); X.globalAlpha=k4; const label=cfg.cta||'اطلبه من نايترون'; X.font='900 50px '+FONT; const w=X.measureText(label).width+110;
    const sc=0.95+0.05*k4; X.translate(540,1160); X.scale(sc,sc); sh(36,14,0.25); X.fillStyle=ACC; rr(-w/2,-58,w,116,58); X.fill(); nsh(); nkTxt(label,0,3,50,'#FFFFFF','center'); X.restore(); }
  X.restore(); }; }

/* house rule: no progress bar over the hook card (it cut through the stage between headline and card) */
function nkNoBarUntil(t1){ const b=bar; bar=function(t){ if(t<t1) return; b(t); }; }

/* ═══ kit v2 (reel #4): full frame always · eyes in the eye zone · text behind the speaker ═══ */

/* WALL WORDS: big words on the wall behind the speaker (person layer on top), placed from his head
   so the bottom of the word slips behind it. words=[{text,at,color,strike}] swap in order. Needs bt/person
   frames for the window (behind_fix.py <work> wall f0 f1). Video layer. */
function nkWallWords(t,cfg){
  if(t<cfg.s||t>cfg.e||!isFull(vrect(t))) return false;
  const ws=cfg.words; let i=-1; ws.forEach((w,j)=>{ if(t>=w.at-0.10) i=j; }); if(i<0) return false;
  const w=ws[i], nx=ws[i+1], k=pr(t,w.at-0.10,w.at+0.12), out=1-pr(t,cfg.e-0.16,cfg.e);
  if(!w._y){ const f=BEHIND&&BEHIND.faces, ys=[]; const a=Math.floor(w.at*30)+1, b=Math.ceil((nx?nx.at:cfg.e)*30)+1;
    for(let n=a;n<=b;n++){ const q=f&&f[n]; if(q) ys.push(q.y-0.35*q.h); } ys.sort((p,q)=>p-q);
    const ht=ys.length?ys[ys.length>>1]:380; X.font='900 '+(cfg.size||250)+'px '+FONT;
    let sz=Math.min(cfg.size||250,Math.floor((cfg.size||250)*940/X.measureText(w.text).width));
    let y=ht+0.18*sz; if(y-0.55*sz<168){ sz=Math.max(150,Math.floor((ht+0.18*sz-168)/0.55)); y=Math.max(168+0.55*sz,ht+0.18*sz); }
    w._y=y; w._sz=sz; }
  X.save(); X.globalAlpha=Math.min(1,k*1.6)*out; const sc=1.12-0.12*ease(k); X.translate(540,w._y); X.scale(sc,sc);
  X.shadowColor='rgba(0,0,0,0.22)'; X.shadowBlur=24; X.shadowOffsetY=10; nkTxt(w.text,0,0,w._sz,w.color||ACC,'center');
  X.shadowColor='transparent';
  if(w.strike){ const ks=nkK(t,w.strike,0.22); if(ks>0){ X.font='900 '+w._sz+'px '+FONT; const tw=X.measureText(w.text).width;
    X.strokeStyle=ACC; X.lineWidth=w._sz*0.09; X.lineCap='round'; X.beginPath(); X.moveTo(tw/2,w._sz*0.05); X.lineTo(tw/2-tw*ks,w._sz*0.05); X.stroke(); } }
  X.restore();
  if(PRS_OK) X.drawImage(PRS,0,0,W,H);
  return true;
}

/* SIDE CARD: the product photo on a white rounded card with a purple rim, sliding in from the side —
   beside the speaker, never over the face, clear of the right-hand action icons (x ≤ 940). */
function nkSideCard(t,cfg){
  if(t<cfg.s-0.05||t>cfg.e) return; const img=cfg.img, k=nkK(t,cfg.s,0.32), out=1-pr(t,cfg.e-0.18,cfg.e); if(k<=0) return;
  const w=cfg.w, h=img&&img.naturalWidth?w*img.naturalHeight/img.naturalWidth:w*1.3, fl=Math.sin(t*2.6)*0.012;
  X.save(); X.globalAlpha=Math.min(1,k*1.5)*out; const dx=cfg.rise?0:(1-k)*(cfg.from||420), dy=cfg.rise?(1-k)*cfg.rise:0; X.translate(cfg.cx+dx,cfg.cy+dy);   /* rise:px = enter from below (keeps clear of the right-hand icons) */ X.rotate((cfg.rot||0.06)+fl);
  sh(50,18,0.40); X.fillStyle='#FFFFFF'; rr(-w/2-10,-h/2-10,w+20,h+20,28); X.fill(); nsh();
  X.save(); X.beginPath(); rr(-w/2,-h/2,w,h,20); X.clip(); nkProductArt(img,0,0,w); X.restore();
  X.strokeStyle=ACC; X.lineWidth=6; rr(-w/2-10,-h/2-10,w+20,h+20,28); X.stroke();
  if(cfg.label){ const kl=nkK(t,cfg.s+0.25,0.24); if(kl>0){ X.globalAlpha*=kl; X.font='900 34px '+FONT; const lw=X.measureText(cfg.label).width+48;
    X.fillStyle=ACC; rr(-lw/2,h/2-6,lw,56,28); X.fill(); nkTxt(cfg.label,0,h/2+23,34,'#FFFFFF','center'); } }
  X.restore();
}

/* CHEST LINES: for close-ups with no wall above the head — the headline lands on the chest band
   (y 1120–1460), above the caption/UI zone, never on the face. lines=[{text,at,size,color,bar}] stack downward. */
function nkChest(t,cfg){
  if(t<cfg.s||t>cfg.e) return; const out=1-pr(t,cfg.e-0.16,cfg.e); let y=cfg.y||1180;
  X.save(); X.globalAlpha=out;
  cfg.lines.forEach(l=>{ const k=pr(t,l.at-0.03,l.at+0.16), sz0=l.size||150;
    X.font='900 '+sz0+'px '+FONT; const sz=Math.min(sz0,Math.floor(sz0*(cfg.maxW||800)/X.measureText(l.text).width));   /* ≤800 wide: clear of the right-hand icons (x>950, y 1100–1750) */
    if(k>0){ X.save(); const sc=(l.slam===false?1:1.35-0.35*ease(k)); X.translate(540,y); X.scale(sc,sc);
      X.shadowColor='rgba(0,0,0,0.75)'; X.shadowBlur=34; X.shadowOffsetY=10; nkTxt(l.text,0,0,sz,l.color||'#FFFFFF','center',Math.min(1,k*2)); X.restore();
      if(l.bar){ const kb=nkK(t,l.at+0.14,0.24); if(kb>0){ X.font='900 '+sz+'px '+FONT; const bw=X.measureText(l.text).width;
        X.save(); X.fillStyle=ACC; rr(540-bw/2*kb,y+sz*0.58,bw*kb,14,7); X.fill(); X.restore(); } } }
    y+=sz*1.08; });
  X.restore();
}

/* ═══ kit v2.1 (client note on reels #1–#2): liquid glass, iPhone style — the graphics never take a part of
   the screen away from the video; they sit on it as glass (glassPane in the engine), and the product is
   always its real photo (product_cutout.py), never a frame of the presenter. ═══ */

/* GLASS CARD: the product cutout floating on white frosted glass; optional ✓ rows inside, each on its word.
   cfg = {img, s, e, cx, cy, w, rise, label, rows:[{text, at}]} */
function nkGlassCard(t,cfg){
  if(t<cfg.s-0.05||t>cfg.e) return; const k=nkK(t,cfg.s,0.34), out=1-pr(t,cfg.e-0.20,cfg.e); if(k<=0||out<=0) return;
  const img=cfg.img, w=cfg.w, pad=cfg.pad||30, iw=w-pad*2, ih=img&&img.naturalWidth?iw*img.naturalHeight/img.naturalWidth:iw*1.1;
  const rows=cfg.rows||[], RH=cfg.rowH||74, lab=cfg.label?74:0, h=pad+ih+lab+(rows.length?18+rows.length*(RH+12):0)+pad-(rows.length?12:0);
  X.save(); X.globalAlpha*=Math.min(1,k*1.6)*out; const sc=0.92+0.08*ease(k);
  X.translate(cfg.cx,cfg.cy+(1-ease(k))*(cfg.rise===undefined?180:cfg.rise)+Math.sin(t*2.2)*3); X.scale(sc,sc);
  glassPane(-w/2,-h/2,w,h,46,{light:true});
  let y=-h/2+pad; X.save(); X.shadowColor='rgba(0,0,0,0.38)'; X.shadowBlur=30; X.shadowOffsetY=14; nkProductArt(img,0,y+ih/2,iw); X.restore(); y+=ih;
  if(cfg.label){ X.font='900 34px '+FONT; const lw=Math.min(iw,X.measureText(cfg.label).width+56); X.fillStyle=ACC; rr(-lw/2,y+12,lw,54,27); X.fill();
    nkTxt(cfg.label,0,y+40,34,'#FFFFFF','center'); y+=lab; }
  if(rows.length) y+=18;
  rows.forEach(r=>{ const kr=nkK(t,r.at-0.04,0.26); if(kr>0){ X.save(); X.globalAlpha*=Math.min(1,kr*1.6); X.translate((1-kr)*-24,0);
      X.fillStyle='rgba(10,10,12,0.78)'; rr(-iw/2,y,iw,RH,RH/2); X.fill();
      nkMarkDot(iw/2-RH/2,y+RH/2,RH/2-9,r.ok!==false,pr(kr,0.3,1));
      X.font='900 '+(RH*0.46)+'px '+FONT; const fsr=Math.min(RH*0.46,RH*0.46*(iw-RH-40)/X.measureText(r.text).width);   /* fits inside its pill */
      nkTxt(r.text,iw/2-RH-14,y+RH/2+2,fsr,r.ok===false?'rgba(255,255,255,0.72)':'#FFFFFF','right');
      if(r.strike) nkStrike(t,r.strike,r.text,iw/2-RH-14,y+RH/2+3,fsr); X.restore(); }
    y+=RH+12; });
  X.restore(); }

/* GLASS CHIP: dark glass tile with an icon and a short Latin label (exercise names, specs) */
function nkGlassChip(cx,cy,w,h,k,label,icon){ if(k<=0) return; X.save(); X.globalAlpha*=Math.min(1,k*1.6);
  const sc=0.90+0.10*ease(k); X.translate(cx,cy+(1-ease(k))*26); X.scale(sc,sc);
  glassPane(-w/2,-h/2,w,h,Math.min(40,h*0.30),{});
  if(icon) icon(0,-h*0.16,h*0.56,ACCTXT||'#FFFFFF');
  if(label) nkLatin(label,0,h*0.27,Math.round(h*0.20),'#FFFFFF','center');
  X.restore(); }

/* GLASS PILL: one line of text on a dark glass capsule */
function nkGlassPill(cx,cy,text,k,size){ if(k<=0) return 0; const fs=size||40; X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.font='900 '+fs+'px '+FONT;
  const w=X.measureText(text).width+fs*1.6, h=fs*1.9, sc=0.92+0.08*ease(k); X.translate(cx,cy+(1-ease(k))*18); X.scale(sc,sc);
  glassPane(-w/2,-h/2,w,h,h/2,{}); nkTxt(text,0,3,fs,'#FFFFFF','center'); X.restore(); return w; }

/* GLASS LENS: a round liquid-glass magnifier over something he shows with his hands (it enlarges, never hides) */
function nkGlassLens(t,cfg){ if(t<cfg.s-0.05||t>cfg.e) return; const k=nkK(t,cfg.s,0.30), out=1-pr(t,cfg.e-0.18,cfg.e); if(k<=0||out<=0) return;
  const r=cfg.r*(0.6+0.4*ease(k)); X.save(); X.globalAlpha*=Math.min(1,k*1.8)*out;
  glassPane(cfg.cx-r,cfg.cy-r,2*r,2*r,r,{blur:0.01,lens:cfg.zoom||1.35,a:0.0,shadow:0.22});
  X.lineWidth=5; X.strokeStyle=ACC; X.beginPath(); X.arc(cfg.cx,cfg.cy,r-2.5,0,7); X.stroke(); X.restore(); }

/* ✓ (purple) or ✕ (grey) dot · purple strike-through that draws right→left on its word */
function nkMarkDot(cx,cy,r,ok,k){ X.save(); X.fillStyle=ok?ACC:'rgba(255,255,255,0.20)'; X.beginPath(); X.arc(cx,cy,r,0,7); X.fill();
  if(ok) iCheck(cx,cy,r*1.08,'#FFFFFF',k); else { const a=r*0.42*ease(k); X.strokeStyle='#FFFFFF'; X.lineWidth=r*0.16; X.lineCap='round';
    X.beginPath(); X.moveTo(cx-a,cy-a); X.lineTo(cx+a,cy+a); X.moveTo(cx+a,cy-a); X.lineTo(cx-a,cy+a); X.stroke(); } X.restore(); }
function nkStrike(t,at,text,xr,y,fs){ const ks=nkK(t,at,0.22); if(ks<=0) return; X.save(); X.font='900 '+fs+'px '+FONT; const tw=X.measureText(text).width;
  X.strokeStyle=ACC; X.lineWidth=Math.max(5,fs*0.13); X.lineCap='round'; X.beginPath(); X.moveTo(xr+2,y); X.lineTo(xr+2-(tw+4)*ks,y); X.stroke(); X.restore(); }

/* GLASS LIST: dark glass pills that land one by one on his words, beside his head (an equation, a checklist).
   cfg = {s, e, x, y, w, rowH, rows:[{text, at, mark:'ok'|'no'|'img'|'result', img, strike}]} */
function nkGlassList(t,cfg){
  if(t<cfg.s-0.05||t>cfg.e) return; const out=1-pr(t,cfg.e-0.20,cfg.e); if(out<=0) return;
  const x0=cfg.x, w=cfg.w, h=cfg.rowH||76, gap=cfg.gap||16; let y=cfg.y; X.save(); X.globalAlpha*=out;
  cfg.rows.forEach(r=>{ const k=nkK(t,r.at-0.04,0.26);
    if(k>0){ X.save(); X.globalAlpha*=Math.min(1,k*1.6); X.translate((1-ease(k))*-30,0); const res=r.mark==='result', mx=x0+w-h/2, my=y+h/2, fs=r.size||Math.round(h*0.42);
      if(res){ X.save(); X.shadowColor='rgba(0,0,0,0.30)'; X.shadowBlur=30; X.shadowOffsetY=10; X.fillStyle=ACC; rr(x0,y,w,h,h/2); X.fill(); X.restore();
        X.strokeStyle='rgba(255,255,255,0.55)'; X.lineWidth=2; rr(x0+1,y+1,w-2,h-2,h/2-1); X.stroke(); nkTxt(r.text,x0+w/2,my+2,fs,'#FFFFFF','center'); }
      else { glassPane(x0,y,w,h,h/2,{});
        if(r.mark==='img'){ X.fillStyle='#FFFFFF'; X.beginPath(); X.arc(mx,my,h/2-6,0,7); X.fill(); X.save(); X.beginPath(); X.arc(mx,my,h/2-8,0,7); X.clip(); nkProductArt(r.img,mx,my+2,(h-14)*0.86); X.restore(); }
        else nkMarkDot(mx,my,h/2-9,r.mark!=='no',pr(k,0.3,1));
        nkTxt(r.text,mx-h/2-12,my+2,fs,r.mark==='no'?'rgba(255,255,255,0.72)':'#FFFFFF','right');
        if(r.strike) nkStrike(t,r.strike,r.text,mx-h/2-12,my+3,fs); }
      X.restore(); }
    y+=h+gap; });
  X.restore(); }
