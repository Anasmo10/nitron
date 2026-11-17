"""F8 reel sound design: few effects, each on something that happens (client, 17 Nov: «مو على الطالعة والنازلة»)."""
import json
W='/home/user/work/f8/w'; C=json.load(open(W+'/caps.json'))['cards']
S=lambda c,i: C[c]['w'][i]['s']
CUT1=4.1667
ev=[["lib",0.03,0.50,"es_sub"],                 # the hook title lands (frame 0)
    ["lib",S(2,2)-0.02,0.24,"thud_b"],           # «باللبس»: the turn of the claim
    ["lib",CUT1,0.30,"whoosh_a"],                # first cut (zoom-through) on the music drop
    ["stretch",S(8,0)+0.10,0.30,0.15,0.36],      # «ارفع الستراب لفوق»: the strap pulled tight on the bar
    ["lib",S(9,0)+0.06,0.20,"es_pop_hi"],        # the purple ✓ row «تأكّد إنه شادد»
    ["lib",S(10,0)+0.10,0.22,"es_pop"],          # the real Figure 8 photo arrives
    ["lib",S(11,0)+0.12,0.18,"es_swish"],        # the twist arrow draws
    ["lib",S(15,0)+0.04,0.26,"ding"]]            # «بالشكل الصح»
json.dump({"drop":CUT1,"slam":None,"music_db":-18.0,"duck_db":8.0,"intro_lp":2600,"stop_down":[],"sfx_gain":0.34,
           "outro_lib":"whoosh_in","music_low_db":3.0,"events":ev},open(W+'/sound.json','w'),indent=1)
for e in ev: print(e)
