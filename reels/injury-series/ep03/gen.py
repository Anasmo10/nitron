"""EP03: timeline.json + words.json → ep/caps.json (caption cards, timeline seconds) and the header of scenes.js
(T_* piece starts, canvas times, WS/WE = every spoken word's start/end on the timeline, per piece)."""
import json
B='/home/user/work/ep3'; W=B+'/ep'; tl=json.load(open(W+'/timeline.json')); P={p['name']:p for p in tl['pieces']}
reel={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}; words=json.load(open(B+'/words.json'))
words['7415'][0][1]=1.18          # the aligner stretched «لكن» back onto a breath at 0.18 s; the word starts at 1.18 (silence map)
def tt(piece,clip_t): return round(P[piece]['start']+clip_t-reel[piece]['a'],3)
CLIP={'H':'7382','P2':'7386','P3':'7398','P4':'7399','P5':'7406','P6':'7411','P7':'7415','P8':'7416'}
def wt(piece,i):      # (start, end) of word i on the timeline; the hook's voice-over was cut at 0.86 s and laid at 0.12 s
    _,s,e=words[CLIP[piece]][i]
    return (round(0.12+s-0.86,3),round(0.12+e-0.86,3)) if piece=='H' else (tt(piece,s),tt(piece,e))
CARDS=[  # (piece, [groups of word indices], display words, hot words)
 ('H',[[0,1],[2,3,4,5,6]],[['تمرين','واحد…'],['وممكن','يبعدك','عن','الجيم','أشهر']],['أشهر']),
 ('P2',[[0,1,2],[3,4],[5,6],[7,8,9],[10,11],[12,13,14]],[['هذا','اللاعب','تعرّض'],['لتمزّق','بوتر'],['العضلة','الرباعية'],['وهو','عم','يعمل'],['ليج','برس'],['بوزن','٤٠٠','كيلو']],['لتمزّق','٤٠٠']),
 ('P3',[[0,1],[2,3],[4,5],[6,7],[8,9,10],[11,12,13,14],[15,16],[17,18],[19,20,21]],
   [['هذه','الإصابة'],['ممكن','تنقضى'],['بتثبيت','بسيط'],['لمفصل','الركبة'],['مع','علاج','فيزيائي،'],['ممكن','يكون','في','ضرورة'],['لتدخّل','جراحي،'],['طبعاً','تختلف'],['حسب','شدّة','الإصابة']],['بتثبيت','فيزيائي،','جراحي،','شدّة']),
 ('P4',[[0,1,2,3]],[['طيب','كيف','بحمي','حالي؟']],['بحمي']),
 ('P5',[[0,1,2],[3,4],[5,6],[7,8,9],[10,11]],[['الإحماء','قبل','التمرين،'],['زيادة','الأوزان'],['بشكل','تدريجي،'],['وأكيد','ما','مننسى'],['الأداء','الصح']],['الإحماء','تدريجي،','الصح']),
 ('P6',[[0,1],[2,3],[4,5,6],[7,8,9]],[['وممكن','نستعين'],['بمشدّ','الركبة'],['لضمان','حماية','إضافية'],['للمفصل','أثناء','التمرين']],['بمشدّ']),
 ('P7',[[0,1],[2,3,4],[5,6],[7,8,9,10]],[['لكن','انتبه،'],['استعمال','مشدّ','الركبة'],['ما','بيعني'],['أبداً','إنه','بيمنع','التمزّقات']],['انتبه،','أبداً']),   # «أبداً» stays on the card with «بيمنع التمزّقات»: that card alone must never read as a promise
 ('P8',[[0,1,2],[3,4],[5,6,7,8]],[['وآخر','شي','تذكّر:'],['سلامتك','أهم'],['من','الوزن','الذي','ترفعه']],['سلامتك'])]
cards=[]
for piece,groups,disp,hot in CARDS:
    for g,dw in zip(groups,disp):
        ws=[]
        for wi,d in zip(g,dw):
            s,e=wt(piece,wi); ws.append({'t':d,'s':s,'e':e,'hot':d in hot})
        cards.append({'s':round(ws[0]['s']-0.1,3),'e':round(ws[-1]['e']+0.25,3),'w':ws,'piece':piece})
for a,b in zip(cards,cards[1:]):
    if a['e']>b['s']-0.03 or a['piece']==b['piece']: a['e']=round(min(a['e'] if a['piece']!=b['piece'] else 99,b['s']-0.03),3)
for c in cards:
    if c['piece']=='P3': c['e']=round(min(c['e'],P['P4']['start']-0.27),3)   # the last caption of P3 leaves before the push-in to his question starts
for c in cards: c.pop('piece')
json.dump({'total':round(tl['total'],3),'cards':cards},open(W+'/caps.json','w'),ensure_ascii=False,indent=1)
T={'T_'+k:P[k]['start'] for k in ('P2','P3','P4','P5','P6','P7','P8')}
T['T_CA_IN']=tt('P2',4.05)        # the knee canvas comes in after «الرباعية» (ends 3.97), before «وهو» (4.17)
T['T_CA_OUT']=tt('P3',6.15)       # and leaves after «فيزيائي» (ends 6.11); Ahmad is back for «ممكن يكون في ضرورة…» (6.69)
WS={k:[wt(k,i)[0] for i in range(len(words[c]))] for k,c in CLIP.items()}; WE={k:[wt(k,i)[1] for i in range(len(words[c]))] for k,c in CLIP.items()}
hdr='const '+', '.join(f'{k}={round(v,3)}' for k,v in T.items())+';\nconst WS='+json.dumps(WS)+', WE='+json.dumps(WE)+';\n'
open(W+'/scenes.js','w').write(hdr+open(W+'/scenes_body.js').read())
print(hdr.split('\n')[0]); print(len(cards),'cards, total',tl['total']); print({p['name']:p['frames'] for p in tl['pieces']})
