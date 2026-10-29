---
name: nitron-edit
description: Use when editing a Nitron (nitron.sport) talking-head reel from raw clips — cutting, captions, motion graphics, product image, music, sound effects, cover. Applies the Nitron house edit system in nitron-kit/ so every reel looks like the same page.
---

# Nitron house edit

Read `nitron-kit/NITRON-STYLE.md` first. It is the identity: colours, structure, motion, sound, cover, QA.
Script and wording rules come from the `content-principles` skill.

## Pipeline (one work folder per reel)
1. **Transcribe and choose:** read every clip, align words (CTC aligner), and drop outtakes and dead air. Ambiguous words that change the meaning get flagged to the user, not guessed silently.
2. **`reel.json`:** list the pieces (raw in/out, zoom, `toplock` for panel pieces). Then run `python3 nitron-kit/build_cut.py reel.json <work>`.
3. **Captions:** cards of 2–5 words, `a.json` / `fixes.json` / identity `cut.json`, then `02_captions.py` from the majed-video plugin.
4. **Masks:** cut the person out for the hook frames, then write `behind.json` with `ranges` and `faces`.
5. **`scenes.js`:** use the kit components only. Then run `python3 nitron-kit/assemble.py <work>`.
6. **Preview:** check the hook, every panel, and the outro. Fix before the full render.
7. **Sound:** write `sound.json` (drop = first cut, slam = hook headline, events on spoken words), then run `python3 nitron-kit/sound.py <work>`.
8. **Render and master:** `04_render_frames.js all`, then `06_encode.sh`, then `nitron-kit/finish.sh <work>`.
9. **Cover:** `28_cover.py --first` on brand purple. Then the QA checklist, then deliver: video, cover, srt, txt, music.

## Hard rules
- The product image always goes where the speaker explains the product. If there is no photo yet, the kit draws the wrap glyph, and the delivery says the photo is pending.
- No new colours, fonts or motion styles inside a reel. A new component goes into `kit.js` so the next reel has it too.
- Keep the hook card to the first spoken sentence, so the first cut lands on the music drop.
- Never publish. Deliver files only.
