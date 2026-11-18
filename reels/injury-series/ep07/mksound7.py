"""EP07 sound (series: cinematic, few effects, each on something that happens; the voice always on top)."""
import json
B='/home/user/work/ep7'; W=B+'/ep'
hdr=open(W+'/scenes.js').read().split('\n')[0]
T={k:float(v) for k,v in [x.strip().split('=') for x in hdr.replace('const ','').rstrip(';').split(',')]}
SNAP=3.36; WS=json.loads(open(W+'/scenes.js').read().split('\n')[1].split('const WS=')[1].split(', WE=')[0])
tear2=WS['7523'][24]-0.02
ev=[["lib",SNAP-0.02,0.20,"es_riser_dark"],          # dark riser into the snap (under the slow motion)
    ["lib",T['T_HCUT']+0.04,0.28,"es_swish"],         # the card flip into the drawing
    ["lib",SNAP,0.22,"es_rev_dark"],["lib",SNAP,0.34,"es_imp_deep"],["lib",SNAP+0.02,0.32,"es_crack"],   # the tendon snaps
    ["lib",T['T_C1IN']+0.05,0.55,"whoosh_a"],         # into each drawing (client, F8: trendy, audible, only where something happens)
    ["lib",T['T_C2IN']+0.05,0.50,"soft_whoosh"],
    ["lib",tear2,0.55,"es_crack"],                     # the tear, close up
    ["lib",T['T_C3IN']+0.05,0.55,"whoosh_a"],
    ["lib",T['T_C4IN']+0.05,0.50,"soft_whoosh"],
    # the words on the wall behind Ahmad land with a soft thump, the second word with a pop
    ["lib",WS['7521'][10]-0.10,0.55,"es_thump_airy"],["lib",WS['7521'][11]-0.06,0.45,"es_pop"],
    ["lib",WS['7523'][1]-0.10,0.55,"es_thump_airy"],["lib",WS['7523'][6]-0.10,0.45,"es_pop_hi"],
    # the three steps, the recovery pills, the 6.3-month box
    ["lib",WS['7529'][5]-0.07,0.45,"es_pop"],["lib",WS['7529'][7]-0.07,0.45,"es_pop_hi"],["lib",WS['7529'][20]-0.07,0.45,"es_pop"],
    ["lib",WS['7531'][10]-0.07,0.40,"es_pop"],["lib",WS['7531'][12]-0.07,0.40,"es_pop_hi"],["lib",WS['7531'][11]-0.05,0.55,"es_shutter"],
    ["lib",WS['7534'][0]-0.10,0.45,"es_sleeve"]]       # «بالمختصر»
D=T['T_P1']
json.dump({"drop":D,"slam":None,"intro_lp":600,"music_db":-20.0,"duck_db":9.0,"sfx_gain":0.55,"outro_lib":"es_thump_deep",
  "music_auto":[[0,-3],[D-0.25,-3],[D,0.5],[8.0,0],[12.0,-1],[29.0,-1],[30.3,0],[36.2,1.5],[41,2]],"events":ev},open(W+'/sound.json','w'),indent=1)
for e in ev: print(e)
