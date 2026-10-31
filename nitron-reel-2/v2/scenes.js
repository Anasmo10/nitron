/* ═══ Nitron reel #2 v2.1 — «لا تشتريها لأنو منظرها حلو» · full frame always · liquid glass · real product photos ═══
   P1 0–2.80 hook (close-up) · P2 2.80–4.667 (wall above the head → words behind him) · P3a 4.667–6.70 grip vs back
   P3b 6.70–9.567 figure-8 strap (he lifts the real one at ~7.9 s, top-left) · P4a 9.567–10.533 · P4b 10.533–11.567 order */
const FIG8=nkUse('fig8.png'), WRAPS=nkUse('bimute.png'), WORD=nkUse('logo_word.png');
const T_P2=2.8, T_P3=4.667, T_P3B=6.70, T_P4=9.567, T_P4B=10.533;
const T_FIG=()=>Math.min(...wordsOf(4).map(w=>w.s));   /* «Figure» — card 4 is listed right→left for the English name */
SCENES=[{s:0,e:T_P2,m:R_FULL,nocap:true},{s:T_P2,e:T_P3,m:R_FULL},{s:T_P3,e:T_P3B,m:R_FULL},{s:T_P3B,e:T_P4,m:R_FULL},
        {s:T_P4,e:T_P4B,m:R_FULL},{s:T_P4B,e:99,m:R_FULL,nocap:true}];

/* ── 1) HOOK (close-up, no wall above the head): the two products flank his face on «شغلات»,
      «بالجيم في شغلات» word by word on the chest, «لا تشتريها» slams under it, the reason gets struck ── */
function hookKicker(t){
  if(t>T_P2) return; const out=1-pr(t,nkS(1,2)-0.16,nkS(1,2)-0.02), ws=wordsOf(0), fs=84; if(out<=0) return;   /* the reason pill takes its place */ X.save(); X.globalAlpha=out;
  X.font='900 '+fs+'px '+FONT; const sp=X.measureText(' ').width, wd=ws.map(w=>X.measureText(w.t).width), tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);
  let x=540+tot/2; ws.forEach((w,i)=>{ const k=nkK(t,w.s-0.04,0.18); X.save(); X.shadowColor='rgba(0,0,0,0.7)'; X.shadowBlur=26; X.shadowOffsetY=6;
    nkTxt(w.t,x,990+(1-k)*18,fs,i===2?(ACCTXT||ACC):'#FFFFFF','right',k); X.restore(); x-=wd[i]+sp; });
  X.restore(); }
SCENE_LIST.push(['hookKicker',hookKicker]);
function hookProducts(t){
  const s=nkS(0,2)-0.04;
  nkGlassCard(t,{img:FIG8,s:s,e:T_P2,cx:170,cy:690,w:262,rise:120,pad:24});
  nkGlassCard(t,{img:WRAPS,s:s+0.10,e:T_P2,cx:910,cy:700,w:248,rise:120,pad:24}); }
SCENE_LIST.push(['hookProducts',hookProducts]);
function hookHead(t){ nkChest(t,{s:nkS(1,0)-0.04,e:T_P2,y:1372,lines:[{text:'لا تشتريها',at:nkS(1,0),size:176,bar:true}]}); }
SCENE_LIST.push(['hookHead',hookHead]);
function hookReason(t){
  if(t>T_P2) return; const k=nkK(t,nkS(1,2)-0.05,0.24); if(k<=0) return; const out=1-pr(t,T_P2-0.16,T_P2);
  const line=['لأنو','منظرها','حلو'], ws=wordsOf(1).slice(2), fs=60; X.save(); X.globalAlpha*=out;
  X.font='900 '+fs+'px '+FONT; const lw=line.map(s=>X.measureText(s).width), sp=X.measureText(' ').width, lt=lw.reduce((a,b)=>a+b,0)+sp*2;
  const cy=992+(1-k)*18, w=lt+96, h=112; X.save(); X.globalAlpha*=Math.min(1,k*1.6); glassPane(540-w/2,cy-h/2,w,h,h/2,{}); X.restore();
  let x=540+lt/2; line.forEach((s,i)=>{ const on=t>=ws[i].s; nkTxt(s,x,cy+2,fs,on?(i===2?(ACCTXT||ACC):'#FFFFFF'):'rgba(255,255,255,0.40)','right',Math.min(1,k*1.6)); x-=lw[i]+sp; });
  const ks=nkK(t,ws[2].e+0.02,0.18); if(ks>0){ const sx=540+lt/2-lw[0]-sp+8, ex=540-lt/2-8;
    X.strokeStyle=ACC; X.lineWidth=10; X.lineCap='round'; X.beginPath(); X.moveTo(sx,cy+4); X.lineTo(lerp(sx,ex,ks),cy+4); X.stroke(); }
  X.restore(); }
SCENE_LIST.push(['hookReason',hookReason]);

/* ── 2) «اشتريها مشان تحل مشكلتك» — words on the wall behind his head (person layer 85–140) ── */
function buyWall(t){ nkWallWords(t,{s:T_P2+0.02,e:T_P3-0.02,size:230,words:[
  {text:'اشتريها',at:nkS(2,0),color:'#0A0A0C'},{text:'لمشكلتك',at:nkS(2,3),color:ACC}]}); }
SCENE_LIST.push(['buyWall',buyWall,'video']);

/* ── 3) grip vs back on glass: the grip drains first; «الفيغر 8 ستراب» refills it ── */
function meter(x0,x1,y,label,lv,t){ const h=26; nkTxt(label,x1,y,38,'#FFFFFF','right');
  const L=x0, R=x1-150; X.save(); X.fillStyle='rgba(255,255,255,0.16)'; rr(L,y-h/2,R-L,h,h/2); X.fill();
  const wv=(R-L)*cl(lv,0,1); X.fillStyle=lv<0.25?(Math.floor(t*8)%2?'#FFFFFF':ACC):ACC; if(wv>2){ rr(R-wv,y-h/2,wv,h,h/2); X.fill(); } X.restore(); }
function gripPanel(t){
  const s=nkS(3,1)-0.10, e=T_P3B+0.85; if(t<s-0.05||t>e) return; const k=nkK(t,s,0.30), out=1-pr(t,e-0.22,e); if(k<=0) return;
  const drain=eio(pr(t,nkS(3,3),nkS(3,5)+0.25)), refill=ease(pr(t,T_FIG(),T_FIG()+0.40));
  const grip=lerp(1,0.12,drain)+(1-0.12)*refill, back=lerp(1,0.82,drain);
  const x0=86, x1=716, y0=920, w=x1-x0+70, h=210;
  X.save(); X.globalAlpha*=Math.min(1,k*1.6)*out; X.translate(0,(1-ease(k))*40);
  glassPane(x0-35,y0,w,h,44,{});
  meter(x0+10,x1-10,y0+64,'القبضة',grip,t); meter(x0+10,x1-10,y0+136,'الضهر',back,t);
  if(refill>0){ X.globalAlpha*=refill; X.font='900 28px Inter, '+FONT; const s2='+ FIGURE 8', tw=X.measureText(s2).width;
    X.fillStyle=ACC; rr(x0+10,y0-24,tw+40,46,23); X.fill(); nkLatin(s2,x0+30+tw/2,y0-1,28,'#FFFFFF','center'); }
  X.restore(); }
SCENE_LIST.push(['gripPanel',gripPanel]);

/* ── 4) the figure-8 strap itself: the real photo on white glass, right of his face, on «الفيغر» ── */
function strapCard(t){ nkGlassCard(t,{img:FIG8,s:T_FIG()-0.02,e:T_P4-0.06,cx:822,cy:948,w:276,rise:200,pad:24,label:'FIGURE 8 STRAP'}); }
SCENE_LIST.push(['strapCard',strapCard]);

/* ── 5) «اطلبه من نايترون» on a glass plate, the NITRON wordmark wipes in on «نايترون» ── */
function orderPlate(t){
  if(t<T_P4B-0.05||t>VEND) return; const k=nkK(t,nkS(7,0)-0.06,0.30), kw=nkK(t,nkS(7,2)-0.04,0.34), out=1-pr(t,VEND-0.12,VEND); if(k<=0) return;
  const x0=150,w=780,y0=1150+(1-ease(k))*60,h=240; X.save(); X.globalAlpha*=Math.min(1,k*1.4)*out;
  glassPane(x0,y0,w,h,48,{a:0.52}); nkTxt('اطلبه من',540,y0+62,48,'#FFFFFF','center');
  if(kw>0&&WORD.naturalWidth){ const lw=560, lh=lw*WORD.naturalHeight/WORD.naturalWidth, ly=y0+100; X.save(); X.beginPath(); X.rect(540+lw/2-lw*kw-4,ly-6,lw*kw+8,lh+12); X.clip(); X.drawImage(WORD,540-lw/2,ly,lw,lh); X.restore(); }
  X.restore(); }
SCENE_LIST.push(['orderPlate',orderPlate]);

nkNoBarUntil(T_P2);   /* the progress bar ran right under the headline's purple rule */
outro=nkOutro({line:'اشتري للمشكلة… مو للمنظر',cta:'اطلبه من نايترون'});
