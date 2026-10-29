/* ═══ Nitron reel #3 — «إذا تكنيكك غلط، مشد المعصم ما رح يفيدك» (kit v1) ═══ */
const R3_PRODUCT=nkUse('product.png'), R3_STICKER=nkUse('stk_product.png');   /* missing files → the kit draws the wrap glyph */
const T_B=2.967, T_C=6.033;
SCENES=[{s:0,e:T_B,m:R_DOWN,gb:520,nocap:true},{s:T_B,e:T_C,m:R_DOWN,gb:520},{s:T_C,e:99,m:R_DOWN,gb:520}];
const HOOK={end:T_B, face:{headtop:390,cy:0,fw:0}, kicker:{card:0,hi:[2]},
  heads:[{text:'مشد المعصم',at:0},{text:'ما رح يفيدك',at:0}], stickers:[]};
function hook(t){
  if(!HOOK.face.cy){ const f=BEHIND.faces, ys=[],cs=[],ws=[]; for(let i=1;i<=89;i++){ if(f&&f[i]){ ys.push(f[i].y); cs.push(f[i].y+f[i].h/2); ws.push(f[i].w); } }
    const med=a=>a.sort((p,q)=>p-q)[a.length>>1]; HOOK.face={headtop:med(ys)-0.35*med(ws),cy:med(cs),fw:med(ws)};
    HOOK.heads[0].at=nkS(1,0); HOOK.heads[1].at=nkS(1,2);
    HOOK.stickers=[{img:R3_STICKER,x:870,y:700,w:330,rot:0.16,in:nkS(1,0)+0.02,stamp:nkS(1,4)}];
    resolveScenes(); SCENES[0].m=SCENES[1].m; HOOK.exitRect=SCENES[1].m; }   /* hook lands exactly on the panel card: no second move */
  nkHook(t,HOOK);
}
SCENE_LIST.push(['hook',hook,'video']);
nkNoBarUntil(T_B);

/* the explanation: what the wrap does (✓) and what it doesn't (✕), with the product beside it */
function productPanel(t){
  if(t<T_B||t>T_C) return;
  panelIn(t,T_B,T_C,()=>{
    X.save(); sh(30,10,0.25); X.fillStyle='rgba(255,255,255,0.96)'; rr(140,272,230,192,26); X.fill(); nsh();
    X.strokeStyle=ACC; X.lineWidth=4; rr(140,272,230,192,26); X.stroke(); X.beginPath(); rr(144,276,222,184,22); X.clip();
    nkProductArt(R3_PRODUCT,255,368,200); X.restore();
    nkTxt('مشد المعصم',940,286,30,MUT,'right');
    nkRow(940,392,346,70,'يثبّت المعصم',true,nkK(t,nkS(2,2)-0.05,0.28));
    nkRow(940,392,428,70,'يصحّح التكنيك',false,nkK(t,nkS(3,1)-0.05,0.28),nkK(t,nkS(3,1)+0.25,0.25));
  });
}
SCENE_LIST.push(['productPanel',productPanel]);

/* the fix: technique ✓ + weight ✓ + the wrap → a better workout */
function formulaPanel(t){
  if(t<T_C) return;
  panelIn(t,T_C,VEND,()=>{
    nkRow(940,450,296,64,'تكنيك صح',true,nkK(t,nkS(4,3)-0.05,0.26));
    nkRow(940,450,366,64,'الوزن المناسب',true,nkK(t,nkS(5,2)-0.05,0.26));
    const kp=nkK(t,nkS(6,1)-0.05,0.26);
    if(kp>0){ X.save(); X.globalAlpha*=Math.min(1,kp*1.6); X.translate((1-kp)*-22,0);
      X.fillStyle='rgba(255,255,255,0.10)'; rr(450,404,490,64,32); X.fill(); X.strokeStyle=ACC; X.lineWidth=3; rr(450,404,490,64,32); X.stroke();
      nkTxt('+',908,436,44,ACCTXT||ACC,'center'); nkTxt('مشد المعصم',876,438,32,'#FFFFFF','right');
      X.save(); X.beginPath(); X.arc(492,436,27,0,7); X.fillStyle='#FFFFFF'; X.fill(); X.clip(); nkProductArt(R3_PRODUCT,492,436,50); X.restore(); X.restore(); }
    const kr=nkK(t,nkS(7,1)-0.05,0.30);
    if(kr>0){ X.save(); X.globalAlpha*=Math.min(1,kr*1.5); const sc=0.9+0.1*kr; X.translate(282,366); X.scale(sc,sc);
      sh(40,14,0.35); X.fillStyle=ACC; rr(-142,-66,284,132,30); X.fill(); nsh();
      nkTxt('تمرين أحسن',0,-6,44,'#FFFFFF','center');
      X.strokeStyle='#FFFFFF'; X.lineWidth=5; X.lineCap='round'; X.beginPath(); const ay=34; X.moveTo(-18,ay+8); X.lineTo(0,ay-10); X.lineTo(18,ay+8); X.stroke();
      X.restore(); }
  });
}
SCENE_LIST.push(['formulaPanel',formulaPanel]);

outro=nkOutro({line:'صلّح تكنيكك… والمشد بيكمّل',cta:'اطلبه من نايترون'});
