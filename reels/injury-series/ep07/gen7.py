"""EP07: timeline.json + words.json → ep/caps.json (glass captions, timeline seconds) and the header of scenes.js
(T_* piece starts, canvas in/out, WS/WE = every spoken word's start/end on the timeline, per take)."""
import json
B='/home/user/work/ep7'; W=B+'/ep'; tl=json.load(open(W+'/timeline.json')); P={p['name']:p for p in tl['pieces']}
words=json.load(open(B+'/words.json'))
def rt(take,s):            # raw take second → timeline second
    if take=='7521': return round(s,3)                                   # H (vo a 0) and P1 (a = start) both map 1:1
    if take=='7523': return round(P['P2']['start']+s-1.30,3)
    if take=='7529': return round(P['P3']['start']+s-1.10,3)
    if take=='7531': return round(P['P4a']['start']+s-0.55,3) if s<0.95 else round(P['P4']['start']+s-1.65,3)
    if take=='7534': return round(P['P5']['start']+s-0.85,3)
WS={k:[rt(k,w[1]) for w in v] for k,v in words.items()}; WE={k:[rt(k,w[2]) for w in v] for k,v in words.items()}
# 7531 «أما» is at raw ~0.66–0.92 (the aligner put it at 0.00): fix by hand
WS['7531'][0]=rt('7531',0.66); WE['7531'][0]=rt('7531',0.92)
T={'T_P1':P['P1']['start'],'T_P2':P['P2']['start'],'T_P3':P['P3']['start'],'T_P4A':P['P4a']['start'],'T_P4':P['P4']['start'],'T_P5':P['P5']['start']}
T['T_C1IN']=round(WS['7521'][13]-0.05,3)      # «بوضعية»
T['T_C1OUT']=round(T['T_P2']+0.07,3)
T['T_C2IN']=round(WS['7523'][8]-0.06,3)       # «رح»
T['T_C2OUT']=round(T['T_P3']+0.07,3)
T['T_C3IN']=round(WS['7529'][5]-0.08,3)       # «نزّل»
T['T_C3OUT']=round(T['T_P4']+0.07,3)
T['T_C4IN']=round(WS['7531'][7]-0.06,3)       # «والاستشفاء»
T['T_C4OUT']=round(T['T_P5']+0.07,3)
T['T_HCUT']=2.0
# captions: the hook (his first sentence), P1 under C1, P2 (on camera + C2), P4 on camera + C4; P3's rows and P5's card carry his words
D={'تمزق':'تمزّق','البريتشر':'Preacher','كيرل':'Curl','الدراع':'الدراع','نزل':'نزّل','تسيطر':'تسيطر','عالوزن':'عالوزن','غالبا':'غالباً','للتمزق':'للتمزّق','التحمل':'التحمّل','جراحي':'جراحي'}
CARDS=[('7521',[[0,1,2],[3,4,5,6]],['البايسبس','Curl']),
       ('7521',[[13,14,15],[16,17,18,19],[20,21,22,23],[24,25,26,27]],['المرفق','الاستقامة','البايسبس','متمددة','الوزن']),
       ('7523',[[0,1,2],[3,4,5,6,7],[8,9,10,11,12],[13,14,15,16],[17,18,19,20,21],[22,23,24]],['الحمل','كبير','تسيطر','قوة','الوتر','أكبر','التحمّل','للتمزّق']),
       ('7531',[[0,1,2],[3,4,5,6],[7,8,9],[10,11,12]],['للعلاج','جراحي','ست','لسنة'])]
cards=[]
for take,groups,hot in CARDS:
    for g in groups:
        ws=[{'t':D.get(words[take][i][0],words[take][i][0]),'s':WS[take][i],'e':WE[take][i]} for i in g]
        for w in ws: w['hot']=w['t'] in hot
        if [w['t'] for w in ws][-2:]==['Preacher','Curl']: ws[-2]['t']='Preacher'; ws[-1]['t']='Curl'
        cards.append({'s':round(ws[0]['s']-0.10,3),'e':round(ws[-1]['e']+0.25,3),'w':ws})
cards.sort(key=lambda c:c['s'])
for a,b in zip(cards,cards[1:]):
    if a['e']>b['s']-0.03: a['e']=round(b['s']-0.03,3)
cards[0]['s']=max(cards[0]['s'],0.6)
json.dump({'total':round(tl['total'],3),'cards':cards},open(W+'/caps.json','w'),ensure_ascii=False,indent=1)
hdr='const '+', '.join(f'{k}={v}' for k,v in T.items())+';\nconst WS='+json.dumps(WS)+', WE='+json.dumps(WE)+';\n'
open(W+'/scenes.js','w').write(hdr+open(B+'/hook_mg7.js').read()+'\n'+open(B+'/scenes_body7.js').read())
print(hdr.split('\n')[0]); print(len(cards),'cards, total',tl['total'])
for c in cards: print(round(c['s'],2),round(c['e'],2),' '.join(w['t'] for w in c['w']))
