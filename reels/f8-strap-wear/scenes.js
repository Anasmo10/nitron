/* ═══ Nitron reel — «Figure 8 Strap مو شادد؟ الغلط باللبس» · how to wear it, step by step · full frame · liquid glass ═══
   v2 (client, 17 Nov): «Figure 8 Strap» in English · no text over text (titles on one glass plate each, never two at once)
   · hard cuts on the music's beats with a zoom-through · trendy, audible sound effects
   H  0–4.17    his claim on a glass plate over his chest (the plate hides the shirt print)
   S  4.17–10.97 his hands doing each step (B-roll under his own words) · numbered glass steps land on his words
   T  10.97–14.57 «إذا ما شدّ… برمه»: the real Figure 8 photo on white glass, two arcs draw the twist
   R  14.57–18.13 close the hand · the set · «بالشكل الصح», then the end card in his words */
const F8_PRODUCT=nkUse('product.png');
const LILAC=(typeof ACCTXT!=='undefined'&&ACCTXT)||'#C77DDB';
const T_S=4.167, T_T=10.967, T_R=14.567, T_END=17.357;   /* T_END = «بالشكل» − 0.08 (caps aren't loaded at top level, so no nkS here) */
SCENES=[{s:0,e:T_S,m:R_FULL,nocap:true},
        {s:T_S,e:T_T,m:R_FULL,nocap:true},            /* the numbered steps carry his words here */
        {s:T_T,e:T_R,m:R_FULL,capY:1500},              /* caption under the product card, above the cautious band */
        {s:T_R,e:T_END,m:R_FULL},
        {s:T_END,e:99,m:R_FULL,nocap:true}];           /* «بالشكل الصح» is the headline */

/* 1) hook: two plates, one after the other (A is gone before B starts) */
function hookQ(t){ nkGlassTitle(t,{s:0,e:nkS(2,0)-0.06,cy:1250,maxW:800,lines:[
  {text:'Figure 8 Strap',at:-0.16,size:92,latin:true},
  {text:'مو شادد؟',at:0.20,size:170,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['hookQ',hookQ]);
function hookA(t){ nkGlassTitle(t,{s:nkS(2,0)-0.06,e:T_S-0.04,cy:1250,maxW:800,lines:[
  {text:'الغلط باللبس',at:nkS(2,0)-0.04,size:150,color:LILAC,bar:true},
  {text:'مو بالستراب',at:nkS(3,0)-0.06,size:104}]}); }
SCENE_LIST.push(['hookA',hookA]);

/* 2) the steps: an order, so numbers; each lands on his word, under his hands */
function stepsTitle(t){ if(t<T_S-0.02||t>T_T-0.02) return; const k=nkK(t,T_S,0.26)*(1-pr(t,T_T-0.22,T_T-0.02)); nkGlassPill(470,858,'كيف تلبسه صح',k,48); }
SCENE_LIST.push(['stepsTitle',stepsTitle]);
function steps(t){ nkGlassList(t,{s:T_S-0.02,e:T_T-0.02,x:60,y:930,w:820,rowH:100,gap:12,rows:[   /* phone-size text, ≤880 wide (clear of the icons), above the cautious band */
  {text:'البس حلقة بإيدك',at:nkS(4,0),mark:'num',n:'١',size:48},
  {text:'مرّر التانية تحت البار',at:nkS(5,0),mark:'num',n:'٢',size:48},
  {text:'البسها بنفس الإيد',at:nkS(6,0),mark:'num',n:'٣',size:48},
  {text:'قبل ما تسكّر: ارفعه لفوق',at:nkS(7,0),mark:'num',n:'٤',size:48},
  {text:'تأكّد إنه شادد عالبار',at:nkS(9,0),mark:'result',size:48}]}); }
SCENE_LIST.push(['steps',steps]);

/* 3) the fix when it is loose: the real Figure 8 on white glass, left of his mic, the twist drawn round it */
function f8Card(t){ nkGlassCard(t,{img:F8_PRODUCT,s:nkS(10,0)-0.08,e:T_R-0.04,cx:230,cy:1190,w:330,rise:200,pad:26,label:'Figure 8 Strap'}); }
SCENE_LIST.push(['f8Card',f8Card]);
function twistTop(t){ nkArc(t,{at:nkS(11,0)-0.06,e:T_R-0.06,cx:230,cy:1190,r:222,a0:-2.75,a1:-0.40,dur:0.42}); }
SCENE_LIST.push(['twistTop',twistTop]);
function twistBottom(t){ nkArc(t,{at:nkS(11,2)-0.06,e:T_R-0.06,cx:230,cy:1190,r:222,a0:0.40,a1:2.75,dur:0.42}); }
SCENE_LIST.push(['twistBottom',twistBottom]);

/* 4) the close: «بالشكل الصح» on its own plate over the set */
function closeTitle(t){ nkGlassTitle(t,{s:T_END,e:VEND-0.01,cy:1180,maxW:760,lines:[
  {text:'بالشكل الصح',at:T_END+0.02,size:150,color:LILAC,bar:true}]}); }
SCENE_LIST.push(['closeTitle',closeTitle]);

nkNoBarUntil(99);
outro=nkOutro({line:'الغلط باللبس… مو بالستراب',cta:'اطلبه من نايترون'});
