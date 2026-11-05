/* ═══ Nitron reel #5 v2 — «هاد مو مشد… هاد إسوارة» · how tight the wrist wrap should be · full frame · liquid glass ═══
   H 0–0.5   freeze on the loose wrap, a ring draws round it, the question rises out of a mask line
   A 0.5–4.0 the shot plays on: «مو مشد» on his words, «إسوارة» behind his head; a punch-in carries into the cut
   B 4.0–7.5 the fix: three numbered glass steps on his words · the real BIMute wrap on white glass
   C 7.5–13.4 the test: «حرّك لورا» + an arrow drawn beside his own raised wrist → «قاومك؟» → «اشتغل» · «نمّلت إيدك؟» → «خفّف»
   D 13.4–15.9 «صار مشد» → «إسوارة» struck on «مو», then the end card in his words. */
const R5_PRODUCT=nkUse('product.png');
const T_A=0.5, T_B=4.0, T_C1=7.5, T_C2=10.967, T_D=13.4, T_D2=14.933;
SCENES=[{s:0,e:T_B,m:R_FULL,nocap:true},{s:T_B,e:T_D2,m:R_FULL},{s:T_D2,e:99,m:R_FULL,nocap:true}];   /* D2: the wall says it */
const LILAC=(typeof ACCTXT!=='undefined'&&ACCTXT)||'#C77DDB';

/* 1) opening: the mistake, circled, and the question */
function openShade(t){ nkShade(t,{s:0,e:2.46,y0:0,y1:980,a:0.66}); }
SCENE_LIST.push(['openShade',openShade]);
function openRing(t){ nkRing(t,{at:-0.12,e:0.70,cx:505,cy:1215,rx:300,ry:150,rot:-0.40,dur:0.36}); }
SCENE_LIST.push(['openRing',openRing]);
function openTitle(t){ nkReveal(t,{s:0,e:2.46,y:430,maxW:860,lines:[
  {text:'مشدّك',at:-0.16,size:200},{text:'ولا إسوارة؟',at:0.22,size:165,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['openTitle',openTitle]);
/* 2) his verdict: «مو مشد» on his words, then «إسوارة» in the same place */
function notWrap(t){ nkReveal(t,{s:nkS(1,1)-0.06,e:nkS(2,0)-0.02,y:1190,maxW:800,lines:[{text:'مو مشد',at:nkS(1,1)-0.06,size:170}]}); }
SCENE_LIST.push(['notWrap',notWrap]);
function isBracelet(t){ nkReveal(t,{s:nkS(2,1)-0.06,e:T_B-0.02,y:1190,maxW:800,lines:[{text:'إسوارة',at:nkS(2,1)-0.06,size:190,color:LILAC}]}); }
SCENE_LIST.push(['isBracelet',isBracelet]);   /* the punch-in leaves no wall above his head here, so it lands where «مو مشد» was */

/* 3) the fix: an order, so numbers, each on his word */
function steps(t){ nkGlassList(t,{s:nkS(3,0)-0.10,e:T_C1-0.04,x:16,y:320,w:330,rowH:90,rows:[
  {text:'فكّو',at:nkS(3,0),mark:'num',n:'١'},{text:'رجاع لفّو',at:nkS(3,1),mark:'num',n:'٢'},{text:'حبّكو بكل لفّة',at:nkS(5,0),mark:'num',n:'٣'}]}); }
SCENE_LIST.push(['steps',steps]);
/* 4) the real wrap (BIMute photo) on white glass, right of his head */
function wrapCard(t){ nkGlassCard(t,{img:R5_PRODUCT,s:T_B+0.18,e:T_C1-0.04,cx:868,cy:520,w:320,rise:200,pad:26,label:'مشد المعصم'}); }
SCENE_LIST.push(['wrapCard',wrapCard]);

/* 5) the test: the words behind his head, the movement drawn beside his own wrist */
function testWall(t){ nkWallWords(t,{s:nkS(6,2)-0.12,e:T_C2-0.02,size:220,drop:-0.12,words:[
  {text:'حرّك لورا',at:nkS(6,2),color:'#FFFFFF'},{text:'قاومك؟',at:nkS(8,1),color:'#FFFFFF'},{text:'اشتغل',at:nkS(9,1),color:LILAC}]}); }
SCENE_LIST.push(['testWall',testWall,'video']);
function wristArc(t){ nkArc(t,{at:nkS(7,1)-0.12,e:nkS(8,0)+0.10,cx:335,cy:1085,r:175,a0:-0.20,a1:-2.80,dur:0.42}); }
SCENE_LIST.push(['wristArc',wristArc]);
function numbWall(t){ nkWallWords(t,{s:nkS(11,1)-0.12,e:T_D-0.02,size:220,drop:0.0,words:[
  {text:'نمّلت إيدك؟',at:nkS(11,1),color:'#FFFFFF'},{text:'خفّف',at:nkS(12,0),color:LILAC}]}); }
SCENE_LIST.push(['numbWall',numbWall,'video']);

/* 6) the close: «صار مشد», then «إسوارة» crossed out on «مو» */
function closeWall(t){ nkWallWords(t,{s:nkS(13,2)-0.12,e:VEND-0.02,size:230,drop:0.0,words:[
  {text:'صار مشد',at:nkS(13,2),color:LILAC},{text:'إسوارة',at:nkS(14,0),color:'#FFFFFF',strike:nkS(14,1)-0.02}]}); }
SCENE_LIST.push(['closeWall',closeWall,'video']);

nkNoBarUntil(99);   /* no progress line: it cut through the opening shot and the hands */
outro=nkOutro({line:'صار مشد… مو إسوارة',cta:'اطلبه من نايترون'});
