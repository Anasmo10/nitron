/* ═══ Nitron reel — «الفيغر 8 ستراب مو شادد؟ الغلط باللبس» · how to wear it, step by step · full frame · liquid glass ═══
   H  0–4.17   his claim, written on his chest from frame 0 (no cut-out: the client wants the backgrounds as they are)
   S  4.17–10.83 his hands doing each step (B-roll under his own words) · numbered glass steps land on his words
   T  10.83–14.47 «إذا ما شدّ… برمه»: the real Figure 8 photo on white glass, two arcs draw the twist
   R  14.47–18.07 close the hand · the set · «بالشكل الصح», then the end card in his words */
const F8_PRODUCT=nkUse('product.png');
const LILAC=(typeof ACCTXT!=='undefined'&&ACCTXT)||'#C77DDB';
const T_S=4.167, T_T=10.833, T_R=14.467, T_END=17.257;   /* T_END = «بالشكل» − 0.08 (caps aren't loaded yet at top level, so no nkS here) */
SCENES=[{s:0,e:T_S,m:R_FULL,nocap:true},
        {s:T_S,e:T_T,m:R_FULL,nocap:true},            /* the numbered steps carry his words here */
        {s:T_T,e:T_R,m:R_FULL,capY:1500},              /* caption under the product card, above the cautious band */
        {s:T_R,e:T_END,m:R_FULL},
        {s:T_END,e:99,m:R_FULL,nocap:true}]; /* «بالشكل الصح» is the headline */

/* 1) hook: the claim on his chest (covers the shirt print), a soft shade so it reads */
function hookShade(t){ nkShade(t,{s:0,e:T_S-0.02,y0:1330,y1:860,a:0.72,solid:true});   /* dark enough to drown the shirt print under the title */ }
SCENE_LIST.push(['hookShade',hookShade]);
function hookQ(t){ nkReveal(t,{s:0,e:nkS(2,0)-0.06,y:1150,maxW:780,gap:1.18,lines:[
  {text:'الفيغر 8 ستراب',at:-0.16,size:112},
  {text:'مو شادد؟',at:0.20,size:200,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['hookQ',hookQ]);
function hookA(t){ nkReveal(t,{s:nkS(2,0)-0.06,e:T_S-0.02,y:1090,maxW:780,gap:1.12,lines:[
  {text:'الغلط',at:nkS(2,0)-0.06,size:120},
  {text:'باللبس',at:nkS(2,2)-0.08,size:200,color:LILAC,bar:true},
  {text:'مو بالستراب',at:nkS(3,0)-0.06,size:104}]}); }
SCENE_LIST.push(['hookA',hookA]);

/* 2) the steps: an order, so numbers; each lands on his word, under his hands */
function stepsTitle(t){ if(t<T_S-0.02||t>T_T-0.02) return; const k=nkK(t,T_S,0.26)*(1-pr(t,T_T-0.22,T_T-0.02)); nkGlassPill(470,858,'كيف تلبسه صح',k,48); }
SCENE_LIST.push(['stepsTitle',stepsTitle]);
function steps(t){ nkGlassList(t,{s:T_S-0.02,e:T_T-0.02,x:60,y:930,w:820,rowH:100,gap:12,rows:[   /* phone-size text: 100 px rows, ≤880 wide (clear of the icons) */
  {text:'البس حلقة بإيدك',at:nkS(4,0),size:48,mark:'num',n:'١'},
  {text:'مرّر التانية تحت البار',at:nkS(5,0),size:48,mark:'num',n:'٢'},
  {text:'البسها بنفس الإيد',at:nkS(6,0),size:48,mark:'num',n:'٣'},
  {text:'قبل ما تسكّر: ارفعه لفوق',at:nkS(7,0),size:48,mark:'num',n:'٤'},
  {text:'تأكّد إنه شادد عالبار',at:nkS(9,0),size:48,mark:'result'}]}); }
SCENE_LIST.push(['steps',steps]);

/* 3) the fix when it is loose: the real Figure 8 on white glass, the twist drawn round it */
function f8Card(t){ nkGlassCard(t,{img:F8_PRODUCT,s:nkS(10,0)-0.08,e:T_R-0.04,cx:265,cy:1150,w:370,rise:200,pad:26,label:'Figure 8 Strap'}); }
SCENE_LIST.push(['f8Card',f8Card]);
function twistTop(t){ nkArc(t,{at:nkS(11,0)-0.06,e:T_R-0.06,cx:265,cy:1150,r:235,a0:-2.75,a1:-0.40,dur:0.42}); }
SCENE_LIST.push(['twistTop',twistTop]);
function twistBottom(t){ nkArc(t,{at:nkS(11,2)-0.06,e:T_R-0.06,cx:265,cy:1150,r:235,a0:0.40,a1:2.75,dur:0.42}); }
SCENE_LIST.push(['twistBottom',twistBottom]);

/* 4) the close: «بالشكل الصح» on the set itself */
function closeShade(t){ nkShade(t,{s:nkS(15,0)-0.10,e:VEND-0.01,y0:1920,y1:900,a:0.62}); }
SCENE_LIST.push(['closeShade',closeShade]);
function closeTitle(t){ nkReveal(t,{s:nkS(15,0)-0.08,e:VEND-0.01,y:1230,maxW:740,lines:[
  {text:'بالشكل الصح',at:nkS(15,0)-0.08,size:180,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['closeTitle',closeTitle]);

nkNoBarUntil(99);
outro=nkOutro({line:'الغلط باللبس… مو بالستراب',cta:'اطلبه من نايترون'});
