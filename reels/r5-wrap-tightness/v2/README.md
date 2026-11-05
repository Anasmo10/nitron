# Reel #5 v2: production pass (5 Nov 2026)

Work folder: `/home/user/work/r5v2` (session-local). The first version stays in `/home/user/work/r5`; its files and exports were not touched.

## Rebuild
1. Run `python3 nitron-kit/build_cut.py reels/r5-wrap-tightness/v2/reel.json <work>`.
   - The `sdr4k/` sources are the iPhone HLG clips tone-mapped with `zscale` + `tonemap=hable`.
2. Person layers for the wall words: frames 72–120 and 242–478.
   - Run `bin/personmask.py`.
   - Then run `nitron-kit/behind_fix.py <work> wall 72 120 wall2 242 478`.
3. Copy `scenes.js` in, then run `assemble.py`, then `04_render_frames.js all`.
4. Run `voice_polish.sh`, then `sound.py`, then `06_encode.sh`, then `finish.sh`.
5. For the cover, use `cover_cv.js` as `scenes/cv.js` in a motion one-frame project.
   - The project needs `assets/prod.png` (the BIMute photo) and `assets/logo.png`.

## earshot (https://github.com/Leonxlnx/earshot, MIT, v0.4.0)
- Install: `python3 -m venv .venv && .venv/bin/pip install numpy scipy soundfile soxr librosa pyloudnorm scikit-learn pillow matplotlib "mcp>=2" && .venv/bin/pip install --no-deps -e .`
- Skills: copy `skills/earshot` and `skills/real-sound` to `~/.claude/skills/`.
- MCP: `claude mcp add earshot --scope user -e EARSHOT_THREADS=3 -- <repo>/.venv/bin/python -m earshot mcp`.
- In this environment, `download.pytorch.org` and `huggingface.co` are blocked.
  - So torch and the two listening models (CLAP, AST) are not installed.
  - `measure`, `critique --fast`, `sfx` and `kit` work.
  - `describe`, `match`, `realness`, `timeline`, `sheet` and full `critique` need those two hosts allowed.
- Bank sounds used, all pitched to the music's key: `cut_hit/sub` and `cut_hit/kick` at B♭1, `ui_pop/soft` at F4, `ui_pop/step` at B♭4, `shutter/quick`, `swish/soft`, `reverse_swell/short`, and `downlifter/tape` with `--dur 0.9`.
- `real-sound` sources recordings from Freesound and Mixkit, and both are blocked here.
  - So this reel uses Nitron's own SFX pack plus the earshot bank.
