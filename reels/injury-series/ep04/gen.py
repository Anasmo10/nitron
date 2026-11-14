"""EP04: timeline.json + words.json → ep/caps.json (caption cards, timeline seconds) and the header of scenes.js
(T_* piece starts and canvas times, WS/WE = every spoken word's start/end on the timeline, per piece)."""
import json
B='/home/user/work/ep4'; W=B+'/ep'; tl=json.load(open(W+'/timeline.json')); P={p['name']:p for p in tl['pieces']}
reel={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}; words=json.load(open(B+'/words.json'))
def tt(piece,clip_t): return round(P[piece]['start']+clip_t-reel[piece]['a'],3)
CLIP={'H':'7444','P2':'7455','P3':'7460','P4':'7461'}
def wt(piece,i):      # (start, end) of word i on the timeline; the hook's voice-over was cut at 1.70 s and laid at 0.12 s
    _,s,e=words[CLIP[piece]][i]
    return (round(0.12+s-1.70,3),round(0.12+e-1.70,3)) if piece=='H' else (tt(piece,s),tt(piece,e))
CARDS=[  # (piece, [groups of word indices], display words, hot words) · the hook and the last take carry their words on screen (no caption)
 ('P2',[[0,1,2],[3,4,5],[6,7],[8,9]],[['بالحقيقة','هون','غلطتين:'],['الأولى','إنه','اختار'],['وزن','عالي'],['بالنسبة','للتمرين']],['غلطتين:','عالي']),
 ('P2',[[10,11,12],[13,14,15],[16,17,18],[19,20],[21,22,23],[24,25]],[['والتانية','لما','رفع'],['رسغه','مال','لبرّا،'],['فصار','في','ضغط'],['على','الساعد'],['مما','أدّى','لكسر'],['بعظام','الساعد']],['لبرّا،','ضغط','لكسر']),
 ('P3',[[0,1],[2,3],[4,5],[6,7,8],[9,10],[11,12],[13,14]],[['هذه','الإصابة'],['ستتطلّب','جبيرة،'],['وللأسف','العلاج'],['يستمر','لستّ','أشهر،'],['والعودة','للتمرين'],['بتكون','تحت'],['إشراف','الطبيب']],['جبيرة،','أشهر،','الطبيب'])]
cards=[]
for piece,groups,disp,hot in CARDS:
    for g,dw in zip(groups,disp):
        ws=[]
        for wi,d in zip(g,dw):
            s,e=wt(piece,wi); ws.append({'t':d,'s':s,'e':e,'hot':d in hot})
        cards.append({'s':round(ws[0]['s']-0.1,3),'e':round(ws[-1]['e']+0.25,3),'w':ws,'piece':piece})
for a,b in zip(cards,cards[1:]):
    if a['e']>b['s']-0.03: a['e']=round(b['s']-0.03,3)
for c in cards: c.pop('piece')
# the hook's first on-screen words come from his voice-over (drawn by scenes.js); card 0 is kept so the checker sees text in the first 0.5 s
h0=wt('H',2)
cards.insert(0,{'s':0.10,'e':round(wt('H',5)[1],3),'w':[{'t':'ممكن','s':0.10,'e':h0[1],'hot':False},{'t':'يكون','s':wt('H',3)[0],'e':wt('H',3)[1],'hot':False},{'t':'أنهى','s':wt('H',4)[0],'e':wt('H',4)[1],'hot':False},{'t':'مسيرته','s':wt('H',5)[0],'e':wt('H',5)[1],'hot':True}]})
json.dump({'total':round(tl['total'],3),'cards':cards},open(W+'/caps.json','w'),ensure_ascii=False,indent=1)
T={'T_'+k:P[k]['start'] for k in ('P2','P3','P4')}
T['T_CIN']=tt('P2',5.06)        # the X-ray canvas comes in after «للتمرين» (ends 4.88), before «والتانية» (5.44)
T['T_COUT']=tt('P3',5.62)       # and leaves after «أشهر» (ends 5.43); Ahmad is back for «والعودة للتمرين…» (6.25)
WS={k:[wt(k,i)[0] for i in range(len(words[c]))] for k,c in CLIP.items()}; WE={k:[wt(k,i)[1] for i in range(len(words[c]))] for k,c in CLIP.items()}
hdr='const '+', '.join(f'{k}={round(v,3)}' for k,v in T.items())+';\nconst WS='+json.dumps(WS)+', WE='+json.dumps(WE)+';\n'
geo=json.load(open(W+'/xr_geom.json')); hdr+='const XG='+json.dumps({k:geo[k] for k in ('W','H','wrist','handleY','fracture','elbow')})+';\n'
ring=json.load(open(B+'/hook/ring.json')); hdr+='const RING='+json.dumps(ring)+';\n'
open(W+'/scenes.js','w').write(hdr+open(W+'/scenes_body.js').read())
print(hdr.split('\n')[0]); print(len(cards),'cards, total',tl['total']); print({p['name']:p['frames'] for p in tl['pieces']})
