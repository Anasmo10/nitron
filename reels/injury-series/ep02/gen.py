"""EP02: timeline.json + words.json → ep/caps.json (caption cards, timeline seconds) and the T_* header of scenes.js"""
import json
W='/home/user/work/ep2/ep'; tl=json.load(open(W+'/timeline.json')); P={p['name']:p for p in tl['pieces']}
reel={p['name']:p for p in json.load(open(W+'/reel.json'))['pieces']}; words=json.load(open('/home/user/work/ep2/words.json'))
def tt(piece,clip_t): return round(P[piece]['start']+clip_t-reel[piece]['a'],3)
# hook VO: clip 7358 words, cut 1.45–3.10 placed at 1.35 s of the hook
HV=[(w,round(1.35+s-1.45,3),round(1.35+e-1.45,3)) for w,s,e in words['7358']]
CARDS=[  # (piece, clip, [groups of word indices], display words, hot word index)
 ('H','7358',[[0],[1,2]],[['لحظة…'],['شوفوا','هون']],[]),
 ('P2','7359',[[0,1,2],[3,4],[5,6]],[['اللي','صار','هو'],['اعتلال','بأوتار'],['الكفة','المدوّرة']],['اعتلال']),
 ('P3','7361',[[0,1,2,3],[4,5],[6,7],[8,9,10],[11,12]],[['هو','من','إصابات','الكتف'],['الشائعة','بالجيم،'],['بيصيب','الأوتار'],['المسؤولة','عن','تثبيت'],['الكتف','وتحريكه']],['الأوتار']),
 ('P4','7365',[[0,1,2]],[['بس','ليش','صار؟']],['ليش']),
 ('P5','7369',[[0,1,2],[3,4,5],[6,7],[8,9,10],[11,12]],[['غالباً','بيصير','بسبب'],['زيادة','الأحمال','التدريبية'],['بشكل','أسرع'],['من','قدرة','الجسم'],['على','التكيّف']],['الأحمال','أسرع']),
 ('P6','7372',[[0,1],[2,3,4],[5,6,7],[8,9]],[['بيسبّب','ألم'],['عند','رفع','الذراع'],['أو','أداء','تمارين'],['الصدر','والكتف']],['ألم']),
 ('P7','7374',[[0,1,2],[3,4],[5,6,7]],[['بس','كيف','ممكن'],['نحمي','حالنا'],['من','هيك','إصابات؟']],['نحمي']),
 ('P8','7378',[[0,1,2],[3,4],[5,6],[7,8,9],[10,11,12]],[['لما','منزيد','الوزن،'],['منزيدو','بوعي'],['بدون','تهوّر،'],['وأكيد','ما','لازم'],['نتجاهل','ألم','الكتف']],['بوعي','تهوّر،']),
 ('P9','7381',[[0,1],[2,3,4,5],[6,7],[8,9],[10,11],[12,13,14],[15]],[['والحلو','إنه'],['هي','الإصابة','ما','بتطوّل،'],['علاجها','بيكون'],['بالعلاج','الفيزيائي'],['وتمارين','بسيطة'],['لتقوية','عضلة','الكتف'],['تدريجياً']],['الفيزيائي','تدريجياً'])]
cards=[]
for piece,clip,groups,disp,hot in CARDS:
    for g,dw in zip(groups,disp):
        ws=[]
        for wi,d in zip(g,dw):
            if piece=='H': _,s,e=HV[wi]
            else: _,s,e=words[clip][wi]; s,e=tt(piece,s),tt(piece,e)
            ws.append({'t':d,'s':s,'e':e,'hot':d in hot})
        cards.append({'s':round(ws[0]['s']-0.1,3),'e':round(ws[-1]['e']+0.25,3),'w':ws,'piece':piece})
for a,b in zip(cards,cards[1:]):
    if a['e']>b['s']-0.03 or a['piece']==b['piece']: a['e']=round(min(a['e'] if a['piece']!=b['piece'] else 99,b['s']-0.03),3)
for c in cards: c.pop('piece')
# the hook's first on-screen line (not spoken): drawn by scenes.js; it is card 0 so the checker sees text in the first 0.5 s
cards.insert(0,{'s':0.12,'e':1.32,'w':[{'t':'ركّز','s':0.12,'e':0.5,'hot':False},{'t':'على','s':0.5,'e':0.8,'hot':False},{'t':'كتفه','s':0.8,'e':1.3,'hot':True}]})
json.dump({'total':round(tl['total'],3),'cards':cards},open(W+'/caps.json','w'),ensure_ascii=False,indent=1)
# canvas starts in the pause before «بيصيب» (clip 7361: 2.90–3.32)
T={'T_P2':P['P2']['start'],'T_P3':P['P3']['start'],'T_CAN':tt('P3',2.94),'T_P4':P['P4']['start'],'T_P5':P['P5']['start'],'T_P6':P['P6']['start'],'T_P7':P['P7']['start'],'T_P8':P['P8']['start'],'T_P9':P['P9']['start']}
hdr='const '+', '.join(f'{k}={round(v,3)}' for k,v in T.items())+';\n'
open(W+'/scenes.js','w').write(hdr+open(W+'/scenes_body.js').read())
print(hdr.strip()); print(len(cards),'cards, total',tl['total']); print({p['name']:p['frames'] for p in tl['pieces']})
