"""EP05: timeline.json + words.json → ep/caps.json (caption cards, timeline seconds) and the header of scenes.js
(T_* piece starts and canvas times, WS/WE = every spoken word's start/end on the timeline, per piece)."""
import json
B='/home/user/work/ep5'; W=B+'/ep'; tl=json.load(open(W+'/timeline.json')); P={p['name']:p for p in tl['pieces']}
reel={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}; words=json.load(open(B+'/words.json'))
def tt(piece,clip_t): return round(P[piece]['start']+clip_t-reel[piece]['a'],3)
CLIP={'H':'7462','P2':'7463','P3':'7472','P4':'7474','P5':'7478'}
def wt(piece,i):      # (start, end) of word i on the timeline; the hook's voice-over was cut at 0.95 s and laid at 0.12 s
    _,s,e=words[CLIP[piece]][i]
    return (round(0.12+s-0.95,3),round(0.12+e-0.95,3)) if piece=='H' else (tt(piece,s),tt(piece,e))
CARDS=[  # (piece, [groups of word indices], display words, hot words) · the hook, P2's first line, P3 and P5 carry their words on screen (no caption)
 ('P2',[[5,6],[7,8],[9,10],[11,12],[13,14],[15,16,17],[18,19],[20,21,22]],
  [['ممكن','يكون'],['الشخص','استعمل'],['السويسايد','غريب'],['ممكن','يكون'],['الرسغ','ضعيف'],['وما','تحمّل','الوزن'],['وأحياناً','ممكن'],['تكون','القبضة','زلقة']],['السويسايد','غريب','ضعيف','زلقة']),
 ('P4',[[0,1],[2,3,4,5],[6,7],[8,9],[10,11],[12,13],[14,15]],
  [['وأكيد','لازم'],['يكون','في','معك','حدا'],['أثناء','التمرين'],['وإذا','بدك'],['حماية','أكبر'],['فيك','تستعين'],['بمشدّ','المعصم']],['حدا','أكبر','المعصم'])]
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
# v3: the hook's words are the reel's glass captions (client, 15 Nov: no box and no words over the footage)
hc=[]
for grp,disp,hot in [([0,1],['ثلثين','الإصابات'],['ثلثين']),([2,3,4],['اللي','بتوصل','للإسعاف'],[]),([5,6],['بتكون','لأنه'],[]),([7,8],['الوزن','وقع'],['وقع']),([9,10],['على','صاحبه'],[])]:
    ws=[{'t':d,'s':wt('H',wi)[0],'e':wt('H',wi)[1],'hot':d in hot} for wi,d in zip(grp,disp)]
    hc.append({'s':round(max(0.05,ws[0]['s']-0.1),3),'e':round(ws[-1]['e']+0.2,3),'w':ws})
for x,y in zip(hc,hc[1:]):
    if x['e']>y['s']-0.03: x['e']=round(y['s']-0.03,3)
hc[-1]['e']=min(hc[-1]['e'],round(P['P2']['start']-0.05,3))
cards=hc+cards
json.dump({'total':round(tl['total'],3),'cards':cards},open(W+'/caps.json','w'),ensure_ascii=False,indent=1)
T={'T_'+k:P[k]['start'] for k in ('P2','P3','P4','P5')}
T['T_C1IN']=tt('P2',2.32)       # the X-ray canvas comes in after «أسباب» (ends 2.12), before «ممكن» (2.58)
T['T_C1OUT']=round(P['P3']['start']+0.08,3)   # and leaves just after the cut to P3 (the take change is under it); «لذا» starts 0.16 s in
T['T_C2IN']=tt('P3',4.34)       # the protection canvas: in over «ناشفة», fully in before the cut to P4
T['T_C2OUT']=round(P['P5']['start']+0.05,3)   # out just after the cut to P5
WS={k:[wt(k,i)[0] for i in range(len(words[c]))] for k,c in CLIP.items()}; WE={k:[wt(k,i)[1] for i in range(len(words[c]))] for k,c in CLIP.items()}
hdr='const '+', '.join(f'{k}={round(v,3)}' for k,v in T.items())+';\nconst WS='+json.dumps(WS)+', WE='+json.dumps(WE)+';\n'
import os
ho=json.load(open(B+'/hook/opts.json')); hdr+='const HOOK='+json.dumps({'opt':os.environ.get('HOOK_OPT','A'),'cut':ho['cut']})+';\n'
open(W+'/scenes.js','w').write(hdr+open(W+'/scenes_body.js').read()+'\n'+open(W+'/hook_mg.js').read())
print(hdr.split('\n')[0]); print(len(cards),'cards, total',tl['total'])
