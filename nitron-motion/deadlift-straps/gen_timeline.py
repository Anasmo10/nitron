# timeline.json without narration: every scene starts on a bar of the Nitron track (150.19 BPM).
import json
P = 0.3995; BAR = 4 * P
plan = [("s1", 3, None), ("s2", 4, {"type": "push", "dir": "up", "dur": 0.45, "ease": "expoInOut"}),
        ("s3", 4, {"type": "wipe", "dir": "rtl", "dur": 0.5, "ease": "expoInOut"}), ("s4", 4, {"type": "push", "dir": "up", "dur": 0.45, "ease": "expoInOut"}),
        ("s5", 4, {"type": "zoom", "dur": 0.5}), ("s6", 4, {"type": "wipe", "dir": "rtl", "dur": 0.5, "ease": "expoInOut"}),
        ("s7", 3, {"type": "push", "dir": "up", "dur": 0.45, "ease": "expoInOut"}), ("s8", 2, {"type": "iris", "dur": 0.6, "at": [540, 960]})]
t = 0.0; scenes = [{"id": "lib", "file": "scenes/lib.js", "start": 0, "end": 0}]
for sid, bars, tr in plan:
    d = {"id": sid, "file": f"scenes/{sid}.js", "start": round(t, 4), "end": round(t + bars * BAR, 4)}
    if tr: d["transition"] = tr
    scenes.append(d); t += bars * BAR
dur = round(t, 4); beats = [round(i * P, 4) for i in range(int(dur / P) + 9)]
json.dump({"duration": dur, "bpm": 150.19, "beatsPerBar": 4, "beats": beats, "sections": [], "scenes": scenes, "vo": []}, open("timeline.json", "w"), indent=1)
for s in scenes[1:]: print(s["id"], s["start"], "→", s["end"])
print("duration", dur)
