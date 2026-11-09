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
- **Lighting pass** (client, 8 Nov: «a lot of adjustments to the lighting»):
  - **Presenter** (`nitron-kit/relight.py` on the cut-out): exposure +3%, an S-curve with a highlight roll-off, warm skin mids and cool lilac shadows. A soft key from camera left shapes his face, with the far side a touch darker and light falling off down the body. Clarity stays inside the cut-out, and a lilac rim light from behind (strongest on the right and on his hair) ties him to the shimmer.
  - **Presenter colour** (`nitron-kit/cleancool.py --level A`, after `relight.py`). Client, 8 Nov: «اللون الأصفر كثير، بدي بشرة أنقى ولون أبرد وشكل أوضح»; option A chosen over the colder B.
    - Lab b* ×0.85 −4 on the whole person, plus 12% more on skin, and a* −10% on skin. Face b* goes from about +27…+32 to +16…+20, the sweater from +16 to +9.
    - Skin is cleaned with a bilateral filter, keeping 35% of the fine texture, so it never looks plastic.
    - A fine unsharp mask on the eyes, brows, beard, hair and clothes, kept light on the skin.
    - Only the person changes: the backdrop and graphics keep their colours.
  - **Backdrop** (`presenterBg`): falls off to dark lilac-grey at the edges, and he casts a soft contact shadow (blur 30 px, 18%, offset right and down), so he sits in the space instead of looking pasted on.
  - **Cold open** (`nitron-kit/regrade_hook.py`): CLAHE opens the crushed shadows (his dark skin was lost in the black trousers), the highlights roll off, the red plates come down 22%, the shadows go cool, with a soft top light and a vignette.
  - **DaVinci:** `nitron-kit/luts/nitron-injury-presenter.cube` holds the global part of the presenter grade (Rec.709), including the option-A cooler balance. The key light, rim light, shadow and skin cleaning are local, so in Resolve they are Power Windows and a skin qualifier, not a LUT.
- **Fine grain over the final** (`noise=alls=4`).
- **Chapter indicator:** ١ ٢ ٣ at the top of the dark chapters, echoing the intro's three questions.
- **Lilac light sweep (right→left)** between chapters, plus a slow 1.8% camera drift in each chapter.

## Thumbnail / cover (`nitron-kit/injury_thumbnail_template.js`)
Client, 8 Nov: the footage-frame thumbnail was rejected. Covers must not break the page's look («ما تنزع الهوية البصرية تبع الصفحة»), and must not show the presenter.
- **Style:** the page's dark product-hero cover, the same family as «قدّيش لازم تشدّ المشد؟» and «تحدي القبضة». A black stage, a Nitron purple spotlight, the logo under the square.
- **Text:** the tag `INJURY BREAKDOWN · EP nn` (lilac, letter-spaced), line 1 in white (128 px), line 2 in lilac (150 px), then the purple bar. EP01: «شدّ عضلات» / «أسفل الظهر».
- **Hero:** the injured area drawn in brand colours by `nitron-kit/injury_hero.py` (EP01: lumbar spine, purple discs, lilac back muscle, glowing strain at L4–L5). No footage frame and no presenter.
- **Spacing** (client: «الكلام فايت ببعضه»): tag y 480, line 1 650, line 2 830, bar 888, hero w 430 at cy 1190. Nothing touches, and everything sits in the 1:1 square (y 420–1500).
- **Delivery:** `cover.jpg`, the crops sheet (9:16 · 4:5 · 1:1), and the video with the cover as its first 0.1 s.

## Awareness post: one image (client, 9 Nov: «ما بدي كاروسيل، بدي بوست»)
- **Format:** `nitron-kit/awareness_post.py <spec.json> <out.jpg>` makes one 4:5 image (1080×1350). This is the default; the carousel below is only for when it's asked for.
- **Layout, top to bottom:**
  - The tag, then the hook in two lines (white 58 px, lilac 112 px) and the purple bar.
  - The injury hero on the left, beside three ✓/✕ glass rows.
  - A glass box: «روح عالدكتور فوراً إذا:» with the warning signs as chips (emergencies only).
  - A separate, calmer box with an «i» mark: «وراجع دكتور إذا الوجع ما خفّ خلال أسبوعين.» (client, 9 Nov: «مو نفس الشيء». Never put a non-urgent line under the «فوراً» heading.)
  - The source, the disclaimer and the logo at the foot.
- **Spacing:** keep a clear gap between the two title lines (t1 top 104, t2 top 206) and between the rows and the box. The client has twice asked for text that doesn't touch.
- **EP01 files:** `ep01/awareness-post.json` (content); the caption is `ep01/awareness-caption.txt`.

## Awareness carousel (only when asked, `nitron-kit/awareness_carousel.py`)
Six 4:5 slides (1080×1350) in the dark cover style, with the injury hero on the cover. The content follows the house content principles.
- **Slides:**
  1. A hook that contradicts a belief (EP01: «انشدّ ظهرك بالتمرين؟ / التخت مو الحل»).
  2. What happened, as a situation they live, with the cause said as «من أشيع أسبابه».
  3. The good-news number, exactly as the source says it (EP01: +90% within a month, AANS).
  4. What to do: ✓ and ✕ rows.
  5. When to see a doctor, plus «هالمعلومات للتوعية، ومو بديل عن الطبيب».
  6. One thing to try at their first lift, and the send CTA.
- **Sources:** every slide that makes a medical claim prints its source at the bottom. The caption repeats the source and the disclaimer.
- **Numbering:** use «٤ — …» with a dash, never «٤ · …»: next to Arabic digits the dot reads as a zero (٤٠). The counter is in Latin digits (`1 / 6`), so it can't be read backwards.
- **EP01 files:** `ep01/awareness.json` (content) and `ep01/awareness-caption.txt` (caption).

## Sound
Cinematic, like a trailer or a medical documentary: low, big, dark. Client, 8 Nov: v3's pops, dings and shimmers were «very childish», v4 was too bare («use a sound effect cinematic mode»).
- **Cold open:** `es_trailer_hit`, a trailer boom with a 6 s low tail, on frame 1. Under it, `es_shepard`, a low Shepard-tone tension riser that peaks on the first flash.
- **Every purple flash:**
  - `es_riser_dark`, a short dark riser into the flash (flashes 2 and 3).
  - `es_rev_dark`, a low reverse swell whose peak lands on the flash.
  - The hit: `es_trailer_hit` on the first and last flash, `es_classic_hit` in the middle.
  - `es_sink`, a low downlifter just after: the air settles.
- **Chapters and the two ✓ marks:** `es_thump_airy`, an air whoosh into a soft low thump.
- **Captions and labels:** `es_sleeve`, a soft dark air movement at a low level. Never a pop, ding, shimmer or cymbal.
- **End card:** `es_thump_deep` (`outro_lib`) + `es_sting`, a warm swell.
- **Levels:** `sfx_gain` 0.34, hits 0.38–0.40, risers 0.20–0.22, thumps 0.15–0.26, captions 0.11. The booms are mostly low end. Check that the voice stays at least 6 dB ahead of the effects in the 300 Hz–4 kHz band.
- **Music arc (`music_auto`):** −3 dB under the cold open, +1 dB at the first flash, −1 dB through the explanation, +1.5 to +2.5 dB at the good news and the end card. It never drops out.
- **Music:** Nitron music, muffled under the cold open, opening at the first flash, −20 LU under speech.
- **Never cut the voice** (client, 8 Nov). Every sentence the presenter says plays to its end. Correct a figure on screen with its source, never by trimming his words.

## Files
- `nitron-kit/injury_series_template.js`: the scene system (EP01 values).
- `reels/injury-series/ep01/`: cut list, scenes, captions, sound plan.
