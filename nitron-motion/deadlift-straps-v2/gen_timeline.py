# v2: the timeline follows the voiceover. Each scene = its VO line (+ lead-in and a short tail); lines 6–8 use
# placeholders until the recordings arrive (vo/lines.json gets them, then re-run).
import json
P = 0.3995; LEAD = 0.15; TAIL = 0.30
lines = {L["id"]: L for L in json.load(open("vo/lines.json"))}
EST = {"l6": 4.35, "l7": 5.2, "l8": 2.8}                      # lines 6-8 have no voice: text-only scenes over the music
extra = {"s5": 1.6, "s7": -0.27, "s8": 0.9}                                 # s5: lever beat after the line · s8: end card holds
TR = {"s2": {"type": "zoom", "dur": 0.45}, "s3": {"type": "wipe", "dir": "rtl", "dur": 0.5, "ease": "expoInOut"},
      "s4": {"type": "push", "dir": "up", "dur": 0.45, "ease": "expoInOut"}, "s5": {"type": "zoom", "dur": 0.5},
      "s6": {"type": "wipe", "dir": "rtl", "dur": 0.5, "ease": "expoInOut"}, "s7": {"type": "push", "dir": "up", "dur": 0.45, "ease": "expoInOut"},
      "s8": {"type": "iris", "dur": 0.6, "at": [540, 960]}}
SKIP = {"s6"}                                                  # the long-term scene is cut (weak evidence, viewers didn't buy it)
t = 0.0; scenes = [{"id": "lib", "file": "scenes/lib.js", "start": 0, "end": 0}]; vo = []; place = {}
for i in range(1, 9):
    sid, lid = f"s{i}", f"l{i}"; L = lines.get(lid); d = L["dur"] if L else EST[lid]
    if sid in SKIP: continue
    v0 = t + LEAD; end = v0 + d + TAIL + extra.get(sid, 0)
    sc = {"id": sid, "file": f"scenes/{sid}.js", "start": round(t, 4), "end": round(end, 4), "lines": [lid]}
    if sid in TR: sc["transition"] = TR[sid]
    scenes.append(sc); place[lid] = round(v0, 4)
    if L: vo.append({"id": lid, "text": L["text"], "start": round(v0, 4), "end": round(v0 + d, 4),
                     "words": [{"w": w["w"], "s": round(v0 + w["s"], 4), "e": round(v0 + w["e"], 4)} for w in L["words"]]})
    else: vo.append({"id": lid, "text": "", "start": round(v0, 4), "end": round(v0 + d, 4), "words": [], "placeholder": True})
    t = end
dur = round(t, 4); beats = [round(i * P, 4) for i in range(int(dur / P) + 9)]
json.dump({"duration": dur, "bpm": 150.19, "beatsPerBar": 4, "beats": beats, "sections": [], "scenes": scenes, "vo": vo}, open("timeline.json", "w"), ensure_ascii=False, indent=1)
json.dump(place, open("vo/place.json", "w"))
for s in scenes[1:]: print(s["id"], s["start"], "→", s["end"])
print("duration", dur)
