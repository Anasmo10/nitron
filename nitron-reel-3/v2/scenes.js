/* ═══ Nitron reel #3 v2.1 — «إذا تكنيكك غلط، مشد المعصم ما رح يفيدك» · full frame · liquid glass · BIMute photo ═══
   A 0–2.967 hook (wall above the head → words behind him) · B 2.967–6.033 he wraps the wrist while he says
   «مهمته يثبّت المعصم» — the camera pushes in on his hands (3.40–4.86), captions lifted to capY 1060 so they never
   cover them · C 6.033–11.3 the equation as a glass list beside his head, he holds the real wrap. */
const R3_PRODUCT=nkUse('product.png');
const T_B=2.967, T_C=6.033;
SCENES=[{s:0,e:T_B,m:R_FULL,nocap:true},{s:T_B,e:T_C,m:R_FULL,capY:1060},{s:T_C,e:99,m:R_FULL}];

/* 1) hook: «إذا تكنيكك غلط» word by word on a glass capsule above his head */
function hookKicker(t){
  if(t>T_B) return; const ws=wordsOf(0), k0=nkK(t,ws[0].s-0.08,0.26), out=1-pr(t,T_B-0.18,T_B); if(k0<=0||out<=0) return;
  const fs=62; X.save(); X.globalAlpha*=out; X.font='900 '+fs+'px '+FONT; const sp=X.measureText(' ').width, wd=ws.map(w=>X.measureText(w.t).width);
  const tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1), w=tot+fs*1.6, h=fs*1.85, cy=218+(1-ease(k0))*-16;
  X.save(); X.globalAlpha*=Math.min(1,k0*1.6); glassPane(540-w/2,cy-h/2,w,h,h/2,{}); X.restore();
  let x=540+tot/2; ws.forEach((wd_,i)=>{ const k=nkK(t,wd_.s-0.04,0.18); nkTxt(wd_.t,x,cy+3,fs,i===2?(ACCTXT||ACC):'#FFFFFF','right',k); x-=wd[i]+sp; });
  X.restore(); }
SCENE_LIST.push(['hookKicker',hookKicker]);
/* 2) «مشد المعصم» → «ما رح يفيدك» on the wall behind his head (person layer 1–89) */
function hookWall(t){ nkWallWords(t,{s:nkS(1,0)-0.12,e:T_B-0.02,size:230,words:[
  {text:'مشد المعصم',at:nkS(1,0),color:'#0A0A0C'},{text:'ما رح يفيدك',at:nkS(1,2),color:ACC}]}); }
SCENE_LIST.push(['hookWall',hookWall,'video']);

/* 3) what the wrap does: the real BIMute photo on white glass beside his head, ✓ on «يثبّت», ✕ + strike on «يصحّح» */
function wrapCard(t){ nkGlassCard(t,{img:R3_PRODUCT,s:nkS(2,1)-0.06,e:T_C-0.04,cx:196,cy:478,w:360,rise:200,pad:24,rowH:72,
  rows:[{text:'يثبّت المعصم',at:nkS(2,2)},{text:'يصحّح التكنيك',at:nkS(3,1),ok:false,strike:nkS(3,1)+0.34}]}); }
SCENE_LIST.push(['wrapCard',wrapCard]);

/* 4) the equation, one glass row per word: technique ✓ · right weight ✓ · + the wrap · = a better session */
function equation(t){ nkGlassList(t,{s:T_C,e:VEND,x:16,y:300,w:282,rowH:72,rows:[
  {text:'تكنيك صح',at:nkS(4,3),mark:'ok'},{text:'الوزن المناسب',at:nkS(5,2),mark:'ok'},
  {text:'مشد المعصم',at:nkS(6,1),mark:'img',img:R3_PRODUCT},{text:'تمرين أحسن',at:nkS(7,1),mark:'result',size:34}]}); }
SCENE_LIST.push(['equation',equation]);

outro=nkOutro({line:'صلّح تكنيكك… والمشد بيكمّل',cta:'اطلبه من نايترون'});
