# keep the «طبقات» line inside its own clip (clip cut at 9.60) and rebuild its union mask from those frames only
import json, sys, subprocess
W = sys.argv[1]; END = float(sys.argv[2]) if len(sys.argv) > 2 else 9.58
d = json.load(open(W + "/behind.json"))
for l in d["lines"]:
    if l.get("style") == "stack":
        l["e"] = min(l["e"], END); f0 = int(l["s"] * 30) + 1; f1 = int(l["e"] * 30) + 1
        subprocess.run(["ffmpeg", "-v", "error", "-start_number", str(f0), "-i", W + "/bt/mask/%05d.png", "-frames:v", str(f1 - f0 + 1),
                        "-vf", f"scale=270:480,format=gray,tmix=frames={f1-f0+1}", "-update", "1", "-y", W + "/" + l["umask"]], check=True)
        print("stack", l["s"], "→", l["e"], "frames", f0, f1)
json.dump(d, open(W + "/behind.json", "w"), ensure_ascii=False, indent=1)
