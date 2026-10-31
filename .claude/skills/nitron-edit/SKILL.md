---
name: nitron-edit
description: Use when editing a Nitron (nitron.sport) talking-head reel from raw clips — cutting, captions, motion graphics, product image, music, sound effects, cover. Applies the Nitron house edit system in nitron-kit/ so every reel looks like the same page.
---

# Nitron house edit

Read `nitron-kit/NITRON-STYLE.md` first. It is the identity: colours, structure, motion, sound, cover, QA.
Script and wording rules come from the `content-principles` skill.

## Pipeline (one work folder per reel)
1. **Transcribe and choose:** read every clip, align words (CTC aligner), and drop outtakes and dead air. Ambiguous words that change the meaning get flagged to the user, not guessed silently.
   Before cutting a silence, look at it: if he is putting on, tightening or showing the product, keep it as a hands close-up (no caption, `velcro`/`stretch` SFX).
2. **`reel.json`:** list the pieces (raw in/out, zoom, `toplock` for panel pieces). Then run `python3 nitron-kit/build_cut.py reel.json <work>`.
3. **Captions:** cards of 2–5 words, `a.json` / `fixes.json` / identity `cut.json`, then `02_captions.py` from the majed-video plugin.
4. **Masks:** cut the person out for the hook frames, then write `behind.json` with `ranges` and `faces`.
5. **`scenes.js`:** use the kit components only: liquid glass (`glassPane`, `nkGlassCard`, `nkGlassChip`, `nkGlassPill`) on the full-frame video, never a solid panel that takes part of the screen. Cut the product photo out first (`python3 nitron-kit/product_cutout.py photo.jpg <work>/product.png`). Where his hands are under the caption, lift it with the scene's `capY`. Then run `python3 nitron-kit/assemble.py <work>`.
6. **Preview:** check the hook, every panel, and the outro. Fix before the full render.
7. **Sound:** write `sound.json` (drop = first cut, slam = hook headline, events on spoken words), then run `python3 nitron-kit/sound.py <work>`.
8. **Render and master:** `04_render_frames.js all`, then `06_encode.sh`, then `nitron-kit/finish.sh <work>`.
9. **Cover:** `python3 nitron-kit/product_cover.py <work>/cover product.png "سطر|سطر" ["سطر صغير"] --logo logo.png --first ad-master.mp4`: the product is the hero, never the presenter. Then the QA checklist, then deliver: video, cover, srt, txt, music.

## Hard rules
- The real product photo always goes where the speaker explains the product, and it leads the cover. Never a frame or cutout of the presenter in its place, and never a ✕ on a Nitron product. If there is no photo yet, ask for it as a file before delivery (the kit's wrap glyph is a placeholder only).
- No new colours, fonts or motion styles inside a reel. A new component goes into `kit.js` so the next reel has it too.
- Keep the hook card to the first spoken sentence, so the first cut lands on the music drop.
- Never publish. Deliver files only.
