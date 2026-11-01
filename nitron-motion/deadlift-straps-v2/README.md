# Nitron motion film v2 — voice-driven («ديدلفت بلا ستراب»)

This version is rebuilt around the client's own voiceover, at 30 fps. The voice audio itself is not committed.

## What changed from v1
- The timeline follows the voice. Each scene is one recorded line (`vo/lines.json` has the word times from CTC alignment), and every graphic lands on its spoken word (`ctx.wordTime`).
- **s1:** 3D barbell with a cinematic pull-back from the knurl and chalk dust. «ضهرك؟» is crossed out, then «قبضتك هي.» lands.
- **s2:** a 3D steel chain (legs · back · grip) carrying a plate. The grip link turns lilac and snaps on «أول», then the study bars grow from 160.6 to 177.
- **s3:** an X-ray scan reveals the finger flexors and tendons; on «يوقع» the bar falls out of the hand.
- **s4:** the left hand flips palm-up, the 96.4% card appears, the distal biceps tendon fibres fray on «بيتمزّق».
- **s5:** a lit 3D lumbar segment (L3–S1); the discs compress on «بيتحمّل ضغط», then the 17,192 N counter and the «أضعاف وزن جسمك» chip.
- **s6–s8:** waiting for voice lines 06–08.

## Voice as recorded vs the script
- **L1:** «إيدك اللي بتوقّفك». The screen keeps «قبضتك هي» at the client's request.
- **L2:** «بتتعب أول», «رفعوا عشرة أكتر» (no «بالمية»; the screen shows +10%).
- **L3:** «رح يوقع».
- **L5:** «أضعاف وزن جسمك»; «خلّي البار لازق بجسمك» was not recorded, so it is shown as an on-screen tip.
- One clip (7.37.52_PM_3) was silent.

## Mix
`python3 nitron-kit/motion_mix.py .` places each line at `vo/place.json`. The house track ducks 10 dB under the voice and sits 22 LU below it (K-weighted). SFX drop further.
