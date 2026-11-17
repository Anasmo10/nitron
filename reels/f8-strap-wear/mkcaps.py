"""F8 reel captions: aligned words (words.json, raw seconds per take) → caps.json on the cut timeline."""
import json
W=json.load(open('/home/user/work/f8/words.json'))
# piece map: (take, raw from, raw to, out start)  — must match reel.json
MAP=[("c04",0.48,4.6467,0.0),("c02",0.36,7.16,4.1667),("c01",0.46,4.06,10.9667),("c01",4.33,7.8967,14.5667)]
def out(take,t):
    for tk,a,b,o in MAP:
        if tk==take and a-0.05<=t<=b+0.05: return round(o+t-a,3)
    raise ValueError((take,t))
DISP={"الفيجر":"الفيغر","ثمانية":"8","غالبا":"غالباً","مرر":"مرّر","تسكر":"تسكّر","تأكد":"تأكّد","شد":"شدّ","وهلق":"وهلّق","سكر":"سكّر","الإيد":"الإيد"}
CARDS=[("c04",[0,1,2,3]),("c04",[4,5,6]),("c04",[7,8,9]),("c04",[10,11]),
       ("c02",[0,1,2]),("c02",[3,4,5,6,7]),("c02",[8,9,10]),("c02",[11,12,13,14]),("c02",[15,16,17]),("c02",[18,19,20,21]),
       ("c01",[0,1,2,3,4]),("c01",[5,6,7]),("c01",[8,9,10,11,12]),("c01",[13,14,15]),("c01",[16,17,18]),("c01",[19,20])]
HOT={"شادد","باللبس","حلقة","البار","الإيد","لفوق","عالبار","برمة","التانية","إيدك","الصح","بالستراب"}
cards=[]
for take,idx in CARDS:
    ws=[]
    for i in idx:
        t,s,e=W[take][i]; t=DISP.get(t,t)
        if t=="شادّ" and take=="c02": t="شادد"
        ws.append({"t":t,"s":out(take,s),"e":out(take,min(e+0.06,s+0.6)),"hot":False})
    hs=[w for w in ws if w["t"] in HOT]
    if hs: hs[-1]["hot"]=True
    cards.append({"s":round(ws[0]["s"]-0.10,3),"e":round(ws[-1]["e"]+0.25,3),"w":ws})
for a,b in zip(cards,cards[1:]):
    if a["e"]>b["s"]-0.02: a["e"]=round(b["s"]-0.02,3)
cards[0]["s"]=max(0.0,cards[0]["s"]); cards[-1]["e"]=min(18.12,cards[-1]["e"])
json.dump({"total":18.1333,"cards":cards},open('/home/user/work/f8/w/caps.json','w'),ensure_ascii=False,indent=1)
for i,c in enumerate(cards): print(i,c["s"],c["e"]," ".join(("*"+w["t"] if w["hot"] else w["t"]) for w in c["w"]))
