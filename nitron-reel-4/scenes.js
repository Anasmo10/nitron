/* ═══ Nitron reel #4 — «لا تفكّر إذا لبست مشد المعصم… حلّيت المشكلة» (kit v2: full frame, text behind) ═══ */
const R4_PRODUCT=nkUse('product.png');
const T_P3=4.300, T_P5=7.400;
SCENES=[{s:0,e:1.93,m:R_FULL,nocap:true},{s:1.93,e:T_P5,m:R_FULL},{s:T_P5,e:99,m:R_FULL,nocap:true}];   /* v2: never shrunk or pushed down */
/* hook and call to action are close-ups (no wall above the head): the headline lands on the chest */
function hook(t){ nkChest(t,{s:0,e:1.93,y:1170,lines:[{text:'لا تفكّر',at:nkS(0,0),size:190,bar:true},
  {text:'إذا لبست مشد المعصم',at:nkS(0,3),size:86,color:ACCTXT||ACC,slam:false}]}); }
SCENE_LIST.push(['hook',hook]);
function cta(t){ nkChest(t,{s:T_P5,e:VEND,y:1170,lines:[{text:'احمي معصمك',at:nkS(5,0),size:170,bar:true},
  {text:'قبل ما تخسرو',at:nkS(5,2),size:96,color:ACCTXT||ACC,slam:false}]}); }
SCENE_LIST.push(['cta',cta]);
/* «بيحمي» on the wall behind him, then «ما بيعالج» struck through */
const WALL={s:0,e:T_P5,words:[]};
function wall(t){
  if(!WALL.words.length){ WALL.s=nkS(3,0)-0.12; WALL.words=[{text:'مشد المعصم',at:nkS(3,0),color:BG},{text:'بيحمي',at:nkS(3,2),color:ACC},{text:'ما بيعالج',at:nkS(4,1),color:BG,strike:nkS(4,3)}]; }
  nkWallWords(t,WALL);
}
SCENE_LIST.push(['wall',wall,'video']);
/* the product the whole reel is about, beside him while he talks about it */
function product(t){ nkSideCard(t,{img:R4_PRODUCT,s:nkS(3,0)-0.04,e:T_P5,cx:780,cy:1035,w:250,rot:0.06,rise:320,label:'SBD'}); }
SCENE_LIST.push(['product',product]);
outro=nkOutro({line:'احمي معصمك… قبل ما تخسرو',cta:'اطلبه من نايترون'});
