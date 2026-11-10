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

## EP02 changes (client, 10 Nov), now the series default
- **Presenter backdrop:** a realistic dark gym generated on Higgsfield (kling_omni_image, 0.5 credit), with purple LED accents and **no products and no shelf**. The first try, a shelf wall with products, was rejected: the products came out the size of his head. The room must be far behind him (back wall about 8 m), camera at chest height, everything small and softly out of focus.
- **Cut-out:** `kf_matte.py` (BiRefNet-portrait on every 6th frame) + `propmatte.py` (carry + unmix against the cloth). The full matte on every frame is too slow on the cloud machine (about 25 s a frame).
- **Placing him:** `stage_composite.py --face_x 0.52 --face_y 0.30 --face_w 0.34 --blur 5`, one fixed transform per take, body to the bottom edge. Run `relight.py --no-rim` and `cleancool.py --level A` first.
- **Transitions:** few and smooth. No purple flash and no hard cut. Footage → presenter is a 12-frame dissolve baked into the frames (`ep02/bake.py`); the canvas dissolves in and out over him (0.45 s) and leaves *after* the cut to the next take, so only that take shows through.
- **Take → take on camera:** only where his head is in the same place at the cut (EP02: one cut, 17 px apart, a 4-frame settle). Where it is not (EP02: 120–140 px apart at two cuts), a dissolve shows two faces: put that take change under a graphics canvas instead. Measure the head position at every cut (last 3 frames vs first 3) before deciding.
- **Motion graphics first:** when he explains something, leave him and show it. The injured part is drawn in ink, line by line (SVG paths, `inkd()`), then it moves. Then a graph or figure per point, on the same dark canvas.
- **Around him:** the source names orbit his chest on an ellipse while he gives the treatment (`orbitDraw`): the back half is drawn before the presenter layer, the front half after. One turn in 6.5 s, each chip on its own stacked ring, starting near the centre.
- **EP02 canvases:** (1) the shoulder in ink, then moving · why: load vs the body's capacity · what it feels like: the arm raise. (2) prevention: small steady steps ✓ next to one reckless jump ✕, then «الألم إنذار… مو تحدّي». Each canvas answers a question he has just asked to camera.
- **Sound effects:** only where something happens. EP02 has 5 in the whole film: a swell + hit when the arm gives way, soft air into the drawing and back, a thump on the end card. Nothing on captions, chips, labels or chapter changes (client: «مو كل ما أحمد تنفّس بتحطّلي ساوند إفكت»).
- **Hook:** the injury clip starts after its burnt-in caption ends (no inpainting needed), slows to 40% at the moment (motion-interpolated) and pushes in to 1.34×; his «لحظة… شوفوا هون» is laid over it.
- **Diagnosis wording:** the footage shows a sudden failure and he names a tendinopathy, so the title card carries «على الأغلب · من شكل الحركة». His voice is never cut.
- **Same face height in every take:** the takes were framed differently, so anchoring the body to the bottom edge left his face at 0.30, 0.35 and 0.41 of the frame, and the dissolves between takes showed him jump. Put the face centre at y 730 (0.38·H, the reel's eye zone) in every take: move the placed layer down, and enlarge the one take that has the least body below the face (`ep02/reshift.py`). Check with a face detector per take before rendering.
- **Instagram's zones** (`08_safe_check.js` must be all ✅ before delivery):
  - Nothing below y 1500, and nothing in the right column x ≥ 950 between y 1100 and 1750.
  - So: the source capsule sits at y 1450–1494 (under the caption, above the belt), title cards end at x 930 and y 1480, labels never go to the right edge, and orbit chips start near the centre.
  - Text over the presenter always sits on a dark capsule or glass (his jacket is light).
- **First half second:** an on-screen line from frame 4 («ركّز على كتفه»), kept as caption card 0 so the checker sees it; the spoken cards start at 1 (`nkQ`).
- **Voice-over laid over footage:** cut it with `-ss` *before* `-i`. With `-ss` after the input, an `afade` out is timed on the source clock and silences the whole cut (EP02's hook words were silent until the final check caught it). Always measure the voice track around a laid-over line before delivery.
- **Never over his head:** measure the hair line from the placed presenter layer (EP02: never above y 390) and keep rows and notes above it.
- **Words that orbit him must not touch each other or leave the frame:** each chip rides its own ring (three stacked), radius 335 px.
- **Scene names:** never reuse engine globals (`INK`, `label`, `BG`, `ACC`…): the scene script then fails silently and only captions render. Run `ep02`'s `jscheck.js` idea (load compose.html, print page errors) before a render.

## Files
- `nitron-kit/injury_series_template.js`: the scene system (EP01 values).
- `reels/injury-series/ep01/`: cut list, scenes, captions, sound plan.
