"""F8 reel sound design v2 (client, 17 Nov: «استخدم اصوات تريندي»): punchy reel effects you can hear, each on an event —
a boom on the opening title, a wrong-buzzer on «الغلط», a riser into the drop, a whoosh on every beat cut, a pop per step,
a ding on ✓, a camera snap on the product, a swish per twist arrow, a ding on «بالشكل الصح»."""
import json
W='/home/user/work/f8/w'; C=json.load(open(W+'/caps.json'))['cards']
S=lambda c,i: C[c]['w'][i]['s']
CUTS=[4.1667,5.3667,7.7667,10.9667,14.5667,16.2]   # first frames 126 162 234 330 438 486 → (f−1)/30
T_END=round(S(15,0)-0.08,3)
ev=[["lib",0.02,0.80,"boom_a"],                       # the opening title
    ["lib",S(2,0)+0.02,0.42,"syn_wrong"],             # «الغلط»
    ["lib",CUTS[0],0.60,"es_swell"],                  # riser into the drop
    ["lib",CUTS[0],0.65,"whoosh_big"],["lib",CUTS[0],0.55,"es_kick"]]
for i,c in enumerate(CUTS[1:]): ev.append(["lib",c,0.55,"whoosh_a" if i%2==0 else "soft_whoosh"])
for i,(c,w) in enumerate(((4,0),(5,0),(6,0),(7,0))): ev.append(["lib",S(c,w)+0.03,0.50,"es_pop" if i%2==0 else "es_pop_hi"])   # each numbered step
ev+=[["lib",S(9,0)+0.05,0.50,"ding"],                 # ✓ «تأكّد إنه شادد»
     ["lib",S(10,0)+0.05,0.60,"es_shutter"],          # the product photo «snaps» in
     ["lib",S(11,0)+0.06,0.50,"es_swish"],["lib",S(11,2)+0.06,0.50,"es_swish"],   # the two twist arrows
     ["lib",T_END+0.06,0.55,"ding"]]                  # «بالشكل الصح»
json.dump({"drop":CUTS[0],"slam":None,"music_db":-18.0,"duck_db":8.0,"intro_lp":2600,"stop_down":[],"sfx_gain":0.60,
           "outro_lib":"whoosh_in","music_low_db":3.0,"events":ev},open(W+'/sound.json','w'),indent=1)
print(len(ev),"events"); [print(e) for e in ev]
