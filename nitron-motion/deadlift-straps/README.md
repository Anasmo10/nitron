# Nitron motion film — «ديدلفت بلا ستراب: إيدك هي اللي بتوقّفك»

A 44.7 s motion-graphics reel (9:16, 60 fps) with no presenter and no voice. Syrian Arabic on-screen text, timed to the Nitron house track (150 BPM, every scene on a bar).

## Scenes
| Scene | Time (s) | Content |
|---|---|---|
| s1 | 0–4.8 | 3D barbell bending as it leaves the floor; «ضهرك مو هو اللي بيوقّفك بالديدلفت… إيدك هي.» |
| s2 | 4.8–11.2 | Weakest link: legs, back and grip meters, where the grip runs out first; study panel 160.6 vs 177.0 kg (+10%) |
| s3 | 11.2–17.6 | Inside the forearm: finger-flexor muscles heat up, tendons under tension, the bar slipping toward the fingertips |
| s4 | 17.6–24.0 | Mixed grip; the palm-up arm with the elbow extended and the biceps tendon loaded; 96.4% panel |
| s5 | 24.0–30.4 | L3–S1 spine with compression on L4/L5 and a counter to 17,192 N (≈1.7 t); lever rule: keep the bar close |
| s6 | 30.4–36.8 | Long term: inner-elbow card; muscle vs tendon adaptation (concept sketch) |
| s7 | 36.8–41.5 | Fix: straps on heavy sets (real figure-8 photo), grip trained on lighter sets; honest line about the back |
| s8 | 41.5–44.7 | End card: logo, «اطلبه من نايترون», "general information" note |

Every number and name on screen is in `facts.md` with its source. The post caption, with the source list, is `caption.txt`.

## Build
Needs `assets/fig8.png` (`product_cutout.py` on the figure-8 photo) and `assets/logo.png`. These are not committed.

1. `python3 gen_timeline.py` writes `timeline.json` (bar-aligned scenes and transitions).
2. Render with the majed-video motion engine. On Linux use `chrome-gl.sh`, because the engine asks for ANGLE-Metal.
   - `CHROME=…/chrome-gl.sh node <motion>/render.js . preview 2.0 8.0 --safe`
   - Full render: `render4.sh` runs 4 parallel range renders, then the encode. That gives about 2.2 fps on 4 CPU cores; one browser with 4 workers only manages 0.7 fps.
3. `python3 nitron-kit/motion_mix.py .` adds the house track (bar-aligned) and the SFX in `sfx_plan.json`, normalises to −14 LUFS and writes `renders/final.mp4`.
4. Make the cover with `product_cover.py cover assets/fig8.png "القبضة|بتفلت أول" "ديدلفت بلا ستراب" --logo assets/logo.png --first renders/final.mp4`.
