/* ═══ Nitron reel #1 v2.1 — «معصمك لازم يضل ثابت» · full frame always · liquid glass · real product photo ═══
   4.382–5.30: the wrap-tightening he did before talking (cut as silence in v1) — hands close-up, no caption.
   Clip 2 talks with his hands at y 1290–1650 → caption lifted to the chest (capY 1250). */
const NLOGO_DARK=nkUse('logo_dark.png'), R1_PRODUCT=nkUse('product.png');
const T_INS=4.382, T_TALK=5.30, T_C3=10.57;
SCENES=[{s:0,e:T_INS,m:R_FULL},{s:T_INS,e:T_TALK,m:R_FULL,nocap:true},
        {s:T_TALK,e:T_C3,m:R_FULL,capY:1250},{s:T_C3,e:99,m:R_FULL,capY:1490}];

/* 1) hook: NITRON wordmark painted on the wall, he walks in front of it (person layer: behind.json ← hook) */
function hookLogo(t){
  if(t>3.0||!BEHIND||!BEHIND.hook||!NLOGO_DARK.naturalWidth) return;
  const kin=ease(pr(t,0.02,0.62)), a=1-pr(t,2.66,2.95); if(a<=0) return;
  const w=1000, h=w*NLOGO_DARK.naturalHeight/NLOGO_DARK.naturalWidth, x=40, y=232;
  X.save(); X.globalAlpha=a; X.beginPath(); X.rect(x-20,y-40,(w+40)*kin,h+80); X.clip();
  const sc=1.035-0.035*kin; X.translate(540,y+h/2); X.scale(sc,sc); X.translate(-540,-(y+h/2));
  X.shadowColor='rgba(0,0,0,0.22)'; X.shadowBlur=18; X.shadowOffsetY=8; X.drawImage(NLOGO_DARK,x,y,w,h); X.restore();
  if(PRS_OK) X.drawImage(PRS,0,0,W,H);
}
SCENE_LIST.push(['hookLogo',hookLogo,'video']);

/* 2) push exercises: two glass chips on the wall above his head, each on its word (RTL: bench first, on the right) */
function barbell(cx,cy,s,c){X.save();X.fillStyle=c; rr(cx-s*0.62,cy-s*0.045,s*1.24,s*0.09,s*0.04);X.fill();
  for(const d of [-1,1]){ rr(cx+d*s*0.40-s*0.05,cy-s*0.30,s*0.10,s*0.60,s*0.03);X.fill(); rr(cx+d*s*0.52-s*0.04,cy-s*0.22,s*0.08,s*0.44,s*0.03);X.fill(); }
  X.restore();}
function dumbbell(cx,cy,s,c){X.save();X.fillStyle=c; rr(cx-s*0.36,cy-s*0.05,s*0.72,s*0.10,s*0.04);X.fill();
  for(const d of [-1,1]){ rr(cx+d*s*0.30-s*0.08,cy-s*0.26,s*0.16,s*0.52,s*0.05);X.fill(); } X.restore();}
function pushChips(t){
  if(t<T_TALK||t>7.99) return; const out=1-pr(t,7.80,7.99);
  X.save(); X.globalAlpha=out;
  nkGlassChip(762,318,420,166,nkK(t,nkS(3,3)-0.06,0.28),'BENCH PRESS',barbell);
  nkGlassChip(318,318,420,166,nkK(t,nkS(4,2)-0.06,0.28),'DUMBBELL PRESS',dumbbell);
  X.restore(); }
SCENE_LIST.push(['pushChips',pushChips]);


/* 4) what the wrap does — the real BIMute photo on white glass, the two checks land inside it on his words */
function wrapCard(t){ nkGlassCard(t,{img:R1_PRODUCT,s:T_C3+0.06,e:nkS(9,0)-0.08,cx:300,cy:478,w:430,rise:220,rowH:80,
  rows:[{text:'حماية المعصم',at:nkS(7,2)},{text:'ثبات المعصم',at:nkS(8,2)}]}); }
SCENE_LIST.push(['wrapCard',wrapCard]);

/* 5) «أبداً» painted big on the wall, its first letter slips behind his head (person layer: behind.json ← wall) */
function wallWord(t){
  if(!BEHIND||!BEHIND.wall) return;
  const w=wordsOf(9)[1], t0=w.s-0.10, t1=wordsOf(9).slice(-1)[0].e+0.06; if(t<t0||t>t1) return;
  const k=ease(pr(t,t0,t0+0.22)), a=Math.min(k*1.5,1)*(1-pr(t,t1-0.18,t1));
  X.save(); X.globalAlpha=a; const sc=1.06-0.06*k; X.translate(575,405); X.scale(sc,sc);
  X.font='900 280px '+FONT; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl';
  X.shadowColor='rgba(0,0,0,0.25)'; X.shadowBlur=24; X.shadowOffsetY=10; X.fillStyle=ACC; X.fillText(w.t,0,0); X.restore();
  if(PRS_OK) X.drawImage(PRS,0,0,W,H);
}
SCENE_LIST.push(['wallWord',wallWord,'video']);

outro=nkOutro({line:'معصم ثابت · أداء صحيح',cta:'اطلبه من نايترون'});
