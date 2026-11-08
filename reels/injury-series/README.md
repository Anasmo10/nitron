# NITRON — Injury Breakdown (10-episode series)

## Fixed structure (every episode)
1. **Cold open:** the real injury moment only. Original audio removed, overlays cropped, no slow motion, "REAL FOOTAGE" tag. Credit the creator when the clip isn't the client's.
2. **Purple flash:** the series' signature transition, used every time the video moves between shots or sections.
3. **Presenter:** cut out of his backdrop and placed on a white background with a purple shimmer.
   - The three questions appear on his words: «شو صار؟ · ليش صار؟ · كيف تحمي حالك؟».
   - A white glass title card shows "INJURY BREAKDOWN · EP nn", the English name, and the Arabic name.
4. **Explanation chapters:** usual Nitron dark canvas (black, purple glow, faint lilac dot grid).
   - Each chapter has a kicker and header: «WHAT HAPPENED / شو صار؟» · «HOW TO PROTECT YOURSELF / كيف تحمي حالك؟» · «GOOD NEWS / خبر حلو».
   - Anatomy is drawn in lilac/purple only.
   - The injured structure is named: the muscle for a strain, the bone for a fracture.
5. **Takeaway:** the presenter, with his last line on the white glass card.
6. **End card:** dark, white NITRON logo, purple bar, "INJURY BREAKDOWN · EP nn / 10", and the sources list.

## Sources rule
- Every medical claim shows its source on screen while it's said, and again on the end card.
- A cause the footage doesn't show is said as «من أشيع أسبابها».

## Picture
- **Cinematic grade on live action:**
  - Lifted, slightly purple-cool blacks, warm soft highlights, saturation −5%, gentle contrast.
  - The cold open is graded harder, with −14% saturation and a vignette.
- **Fine grain over the final** (`noise=alls=4`).
- **Chapter indicator:** ١ ٢ ٣ at the top of the dark chapters, echoing the intro's three questions.
- **Lilac light sweep (right→left)** between chapters, plus a slow 1.8% camera drift in each chapter.

## Thumbnail (`nitron-kit/injury_thumbnail_template.js`)
- The real injury frame, graded, rising out of black.
- The injured spot circled in lilac with a soft glow.
- Top: «INJURY BREAKDOWN» and an «EP nn» pill.
- Bottom: the Arabic injury name (white, 136) and the English name (lilac).
- The logo sits below.
- Per episode, set `window.EP = {n, ar, en, dx, dy, sc, ring:[x,y,rx,ry,rot]}` and swap `assets/shot.jpg`.
- Everything sits inside the 1:1 grid square.

## Sound
Dark and cinematic, like a medical documentary. Client, 8 Nov, on the v3 pops, dings and shimmers: «very childish».
- **Signature transition** (every purple flash):
  - `es_rev_dark`: a low reverse swell whose peak lands on the flash.
  - `es_imp_deep`: a deep impact on the same frame, with a long low tail.
- **Cold open:** one `es_imp_deep` on frame 1.
- **Between chapters:** `es_wind`, a soft, dark air whoosh.
- **End card:** `es_thump_deep` (`outro_lib`), a low whoosh into a deep thump.
- **Nothing on labels, chips or ✓ marks.** No pops, dings, shimmers, cymbals, risers or anything bright. The SFX bed keeps under 2% of its energy above 3 kHz.
- **Levels:** `sfx_gain` 0.30. Each flash pair at 0.34, the chapter whooshes at 0.24.
- **Music arc (`music_auto`):** −3 dB under the cold open, +1 dB at the first flash, −1 dB through the explanation, +1.5 to +2.5 dB at the good news and the end card. It never drops out.
- **Music:** Nitron music, muffled under the cold open, opening at the first flash, −20 LU under speech.
- **Never cut the voice** (client, 8 Nov). Every sentence the presenter says plays to its end. Correct a figure on screen with its source, never by trimming his words.

## Files
- `nitron-kit/injury_series_template.js`: the scene system (EP01 values).
- `reels/injury-series/ep01/`: cut list, scenes, captions, sound plan.
