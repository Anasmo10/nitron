/* ═══ Nitron reel #5 — «هاد مو مشد… هاد إسوارة» · how tight the wrist wrap should be · full frame · liquid glass ═══
   A 0–3.8 hook: close-up of a loose wrap, «مشدّك / ولا إسوارة؟» slams on frame 1; then «مو مشد» → «إسوارة» behind his head
   B 3.8–7.3 he unwraps and re-wraps: the three steps as a glass list left of his head, the real BIMute wrap on glass to the right
   C 7.3–13.2 the test: «حرّك لورا» → «قاومك؟» → «اشتغل» · «نمّلت إيدك؟» → «خفّف» behind his head
   D 13.2–15.4 «صار مشد» → «مو إسوارة» (struck) behind his head, then the end card. */
const R5_PRODUCT=nkUse('product.png');
const T_B=3.8, T_C1=7.3, T_C2=10.767, T_D=13.2;
SCENES=[{s:0,e:T_B,m:R_FULL,nocap:true},{s:T_B,e:14.733,m:R_FULL},{s:14.733,e:99,m:R_FULL,nocap:true}];   /* D2: the wall says it */
const LILAC=(typeof ACCTXT!=='undefined'&&ACCTXT)||'#C77DDB';

/* 1) hook on frame 1: the question over the loose wrap, before he speaks */
function hookTitle(t){ nkChest(t,{s:0,e:2.24,y:640,maxW:820,lines:[
  {text:'مشدّك',at:0.04,size:210},{text:'ولا إسوارة؟',at:0.42,size:160,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['hookTitle',hookTitle]);
/* 2) his verdict behind his head */
function notWrap(t){ nkChest(t,{s:nkS(1,0)-0.04,e:nkS(2,0)-0.02,y:1180,maxW:800,lines:[{text:'مو مشد',at:nkS(1,1),size:170}]}); }
SCENE_LIST.push(['notWrap',notWrap]);
function hookWall(t){ nkWallWords(t,{s:nkS(2,0)-0.12,e:T_B-0.02,size:230,words:[{text:'إسوارة',at:nkS(2,1),color:LILAC}]}); }
SCENE_LIST.push(['hookWall',hookWall,'video']);

/* 3) the fix, one glass row per step, on his words */
function steps(t){ nkGlassList(t,{s:nkS(3,0)-0.10,e:T_C1-0.04,x:16,y:320,w:330,rowH:90,rows:[
  {text:'فكّو',at:nkS(3,0)},{text:'رجاع لفّو',at:nkS(3,1)},{text:'حبّكو بكل لفّة',at:nkS(5,0)}]}); }
SCENE_LIST.push(['steps',steps]);
/* 4) the real wrap (BIMute photo) on white glass, right of his head */
function wrapCard(t){ nkGlassCard(t,{img:R5_PRODUCT,s:T_B+0.18,e:T_C1-0.04,cx:868,cy:520,w:320,rise:200,pad:26,label:'مشد المعصم'}); }
SCENE_LIST.push(['wrapCard',wrapCard]);

/* 5) the test, word by word behind his head */
function testWall(t){ nkWallWords(t,{s:nkS(6,2)-0.12,e:T_C2-0.02,size:220,drop:-0.12,words:[
  {text:'حرّك لورا',at:nkS(6,2),color:'#FFFFFF'},{text:'قاومك؟',at:nkS(8,1),color:'#FFFFFF'},{text:'اشتغل',at:nkS(9,1),color:LILAC}]}); }
SCENE_LIST.push(['testWall',testWall,'video']);
function numbWall(t){ nkWallWords(t,{s:nkS(11,1)-0.12,e:T_D-0.02,size:220,drop:0.0,words:[
  {text:'نمّلت إيدك؟',at:nkS(11,1),color:'#FFFFFF'},{text:'خفّف',at:nkS(12,0),color:LILAC}]}); }
SCENE_LIST.push(['numbWall',numbWall,'video']);

/* 6) the close: «صار مشد» → «مو إسوارة», «إسوارة» struck on his word */
function closeWall(t){ nkWallWords(t,{s:nkS(13,2)-0.12,e:VEND-0.02,size:230,drop:0.0,words:[
  {text:'صار مشد',at:nkS(13,2),color:LILAC},{text:'مو إسوارة',at:nkS(14,0),color:'#FFFFFF',strike:nkS(14,1)+0.22}]}); }
SCENE_LIST.push(['closeWall',closeWall,'video']);

outro=nkOutro({line:'لفّو صح… مشد، مو إسوارة',cta:'اطلبه من نايترون'});
