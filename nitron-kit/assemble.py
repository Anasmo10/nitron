"""Nitron kit — build <work>/compose.html = engine + kit.js + the reel's scenes.js.  python3 assemble.py <work>"""
import os, sys
K=os.path.dirname(os.path.abspath(__file__)); W=sys.argv[1]
eng=open(K+"/engine.html",encoding="utf-8").read(); kit=open(K+"/kit.js",encoding="utf-8").read(); sc=open(W+"/scenes.js",encoding="utf-8").read()
open(W+"/compose.html","w",encoding="utf-8").write(eng.replace("</body></html>","<script>\n"+kit+"\n</script>\n<script>\n"+sc+"\n</script>\n</body></html>",1))
print("compose.html ←", "engine", len(eng), "· kit", len(kit), "· scenes", len(sc))
