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
  - **One doctor box, one style.** Every reason to see a doctor is a chip in the same list under one heading with no «فوراً» (EP02: «لا تأجّل الدكتور إذا:»). Never split the doctor advice into an urgent box and a differently styled line or box. The client flagged this on EP01 («مو نفس الشيء», then «ليش هنن مو نفس التصنيف») and again on EP02 («the same mistake again»): the earlier reading, that he wanted them separated, was wrong.
  - The source, the disclaimer and the logo at the foot.
- **Spacing:** keep a clear gap between the two title lines (t1 top 104, t2 top 206) and between the rows and the box. The client has twice asked for text that doesn't touch.
- **EP01 files:** `ep01/awareness-post.json` (content); the caption is `ep01/awareness-caption.txt`.
- **EP02 files:** `ep02/awareness-post.json` (layout `focus`) and `ep02/awareness-caption.txt` (rotator cuff).
- **Default layout from EP02 on: `focus`** (`nitron-kit/awareness_post2.py`). Client, 11 Nov, on the denser designs: «في تشتت واضح ومعلومات كتيرة بصورة واحدة، ما بيعرف المشاهد شو بده يقرا».
  - Four levels only, each a clear step down in size: the headline, the injury hero beside three numbered steps of two or three words (no boxes, no sub-lines), one doctor line on a glass capsule, the foot.
  - Everything else (recovery time, each warning sign, the lifting tip) goes in the caption, not on the image.
  - No product on an awareness post unless the client asks for one. He asked for the wrap, then dropped it the same day («المشد ماله لازمه»); the layout still takes an optional `product` band.
  - The `steps` and `versus` layouts stay in the script but were not chosen.
- **Warning signs:** only what a named source lists. No number of days when the source gives none. The condition a source attaches (EP02: Mayo's urgent signs follow an injury) goes in the caption, not into a separate group on the image.

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

## EP03 changes (client, 11 Nov), now the series default
Brief: «مشان يطلع الفيديو viral بدي منك تحدد هدف هاد الفيديو واهتم بالهوك… الكتابة لازم تكون مدروسة الأماكن، لا تعمل تشتيت للمتابع… كبّر أحمد بحيث يكون هو فعلاً جوّا الفريم… المصادر بشكل دائري تلتف حول أحمد… الانتقالات سموز وخفيفة… لا تبالغ بالأصوات».
- **One goal per episode, decided before the cut.** EP03: saves and shares (everyone knows someone who loads past what he is ready for). The message is his last line, «سلامتك أهم من الوزن الذي ترفعه»; the end card asks for the share («ابعتها لصاحبك اللي بيحمّل فوق طاقته»).
- **Hook:** the injury happens inside the first second (EP03: 0.9 s). His hook line is laid over the footage as a voice-over, cut with its own rhythm untouched.
- **Injury clip that comes inside a news template** (`ep03/hook.py`): crop to the real footage only (EP03: 426×376 of a 426×640 frame; the outlet's mark and caption box fall outside), never inpaint. Show it as a full-width cinema band on a dark, blurred, purple-tinted copy of itself. Hook words go in the band above the picture, the «REAL FOOTAGE» tag and the credit in the band below, nothing on the picture. Credit the person who filmed it.
- **Slow motion on the moment:** real time to the instant he gives way, 30% through the collapse (120 fps motion-interpolated source, checked frame by frame for warping), back to real time on the aftermath, with a 1.0 → 1.3 push-in on the injured joint.
- **Ahmad bigger, and inside the frame** (`ep03/prep3.py`). In EP02 he was scaled *down* to place him, so the edges of the raw frame, where his shoulders and arms are cut, showed inside the picture («عم يطلع من الفريم»). Rule: frame every on-camera take from the 4K original so that the scaled raw frame covers the output on the left, right and bottom. Face width 0.42·W (Haar box), centre at (540, 730). Above his head the raw frame may end: the cloth is smeared upward before the matte. A take shot too close to reach that size stays as shot (scale 1.0).
- **One thing to read at a time.**
  - The hook's first words leave when the second line arrives.
  - A canvas whose rows are his own words has no caption (`nocap`): EP03's prevention rows, his question (drawn above his head, where the frame is free), and his last line on glass.
  - On camera with the sources orbiting: only the caption and the orbit. No rows above his head, no source capsule (the orbit is the source).
  - One label per drawing. EP03 names the tendon, then the word «تمزّق» lands under it, so the two read as one line.
- **Sources orbit him** while he gives the treatment (`orbitDraw`): ring centre y 1075, rx 335, ry 90, lifts −70 / 5 / 80, one turn in 5.5 s. With the bigger framing the front half stays between his chin (y 985) and the caption (from y 1320).
- **Take changes:** every one but one is hidden under a canvas. The one on screen (medium shot → his question, close to the lens) is a camera push-in (`ep03/camera.py`): after his last word, the last 8 frames of the outgoing take scale and move, he and the gym together, until his face is where and as large as it is in the first frame of the next take; the move is blurred along its direction (a linear blur stands in for the shutter); the next take's gym is scaled by the same factor; then the last frame of the move fades off the next 3 frames (`ep03/bake.py`). A two-sided dissolve there showed the next face early, beside the moving one. Measure both faces at the cut, and follow the outgoing face frame by frame.
- **The product** (client: «صورة المشد بدك تحطّه لما يذكر المشد»): its photo on a glass card at chest-left the moment he says its name (clear of his mic hand, ending 40 px above the caption), then alone on the next canvas with what it is (✓) and what it is not (✕).
- **A caption card must never read as a promise on its own.** His sentence is «ما بيعني أبداً إنه بيمنع التمزّقات»; the last card is «أبداً إنه بيمنع التمزّقات», never «إنه بيمنع التمزّقات» alone.
- **Diagnosis:** when the press has reported it, the title card says «بحسب التقارير الصحفية عن الحادثة» and the end card lists the reports (EP03: Milenio, Uno TV, Feb 2026). «على الأغلب · من شكل الحركة» is only for a diagnosis read off the footage.
- **Numbers from sources:** only those the source page states. EP03's sources give no recovery time in the summaries that were checked, so none is shown; his own «أشهر» is supported by the athlete's statement in the press.
- **A glass card opens with its line.** The closing card starts as a one-line strip («وآخر شي… تذكّر») and grows when «سلامتك أهم» lands: never a large empty panel on screen.
- **Two texts never share a place in time.** The title card is gone before the first caption of the canvas; his question above his head is gone before the canvas title takes that spot; the last caption of a take leaves before a camera move starts.
- **Checks on the delivered file (v1):** 1152 frames, 30 fps, 38.4 s; −15.1 LUFS, peak −1.8 dBFS; voice offset 0.0 ms (100 ms in the cover-first file, which is the cover's 3 frames); voice 17–22 dB ahead of music and effects in the 300–4000 Hz band; every cut in silence (−59 dB or lower against −24 dB speech); `08_safe_check.js` all ✅ (right column 0.51%, limit 1%).
- **Sound:** five effects in the film. A swell and a hit when he gives way, soft air into the first two canvases, a low thump when the tendon tears in the drawing, a thump on the end card. Nothing on captions, rows, chips or the product.
- **Cover:** the bent knee in ink with the torn tendon ringed (`ep03/cover-hero.html`), «تمزّق وتر» / «العضلة الرباعية», tag `INJURY BREAKDOWN · EP 03`.
- **Sources (EP03):** AAOS OrthoInfo, Quadriceps Tendon Tear and Safe Exercise · Cleveland Clinic, Quadriceps Tendon Tear · Mayo Clinic, Weight training · Sharif et al., Phys Ther Sport 2017;28:44–52 (knee sleeves). They were confirmed from search summaries: the pages themselves do not open from the cloud session.

## Fact-check report with every episode (client, 14 Nov: standing rule for the whole series)
Client: «بكل فيديو ابعتلك ياه تتأكد من كامل المعلومات وتذكر كامل الأبحاث اللي ذكرت جوّا الفيديو، ما ناقص أي شيء، وإذا في معلومات خاطئة علّم عليها مشان أنا أتوخّى الحذر».
- Deliver `epNN/fact-check.md` (Arabic, also copied to `deliver-v2/`) with every episode, beside the video.
- **Every sentence the presenter says,** one per row: ✅ correct / ⚠️ incomplete or wrong (and how it was corrected on screen) / ❓ cannot be verified, each with its source.
- **Every on-screen text he did not say,** with its source, including what the drawings imply (for example «both bones broken» in a drawing when the footage cannot tell).
- **Every source named in the video, in full:** organisation, page or paper title, year if any, link.
- **What to watch before posting:** unknown footage owner, claims with no evidence, wrong lines left in his voice (they are corrected on screen, never cut).
- Say how the sources were checked (search summaries; the pages themselves do not open from the cloud session).

## EP04 changes (client, 14 Nov)
- **The hook when the source has a graphic over the action** (EP04: a large skeleton image over the wide shot): use the clean replay at the end of the clip instead (`ep04/hook.py`), cropped above the caption box. Slow it to 25% on the break, push in on the joint, and put a lilac ring that follows the limb where it breaks, with one small glass label («الساعد»).
- **Realistic motion graphics** («بدنا واقعية أكثر»): a radiograph rendered from physics (`ep04/xray.py`). Each bone is a hollow tube seen in projection: brightness = how much bone the beam crosses, so the cortex edges glow and the core is darker; the ends are spongy (trabecular texture); metal saturates; soft tissue is a faint glow with soft edges. It ships as layers (forearm, hand, dumbbell, fixation plates, cast), and the scene moves them: the hand and dumbbell tilt about the wrist, the forearm splits along a jagged line and angulates, the plates and the cast fade in. It is shown on a «film» on the dark canvas, revealed by a scan line, and labelled «رسم توضيحي» in the corner (a realistic X-ray must never pass for the patient's own).
- Higgsfield image generation now refuses on the account's free plan («Requires basic plan or higher»): no credits were spent. Render anatomy in code instead.
- **Ahmad's sources are 1080×1920 now** (EP03's were 4K): the bigger framing is kept to face width 0.40·W (about ×1.15), so he stays sharp (`ep04/prep4.py`).
- **Take change Ahmad → Ahmad with a small offset** (EP04: 38 px, 7% size): P4's first 6 frames start with him scaled and moved so his face sits exactly where P3 left it, then ease to his own framing (`ep04/settle.py`); P3's last frame fades off P4's first 3 frames. Only ever **enlarge** him in such a move: shrinking him (the first try) lifted his body off the bottom edge and showed the raw frame's edge.
- **Checks on the delivered file (v1):** 932 frames, 30 fps, 31.07 s; −15.0 LUFS, peak −1.8 dBFS; voice offset 0.0 ms; voice 15–21 dB ahead of music and effects in the speech band; every cut in silence (−75 dB or lower against −24 dB speech); `08_safe_check.js` all ✅.
- **Sound:** four effects plus the end card. A swell and hit on the real break, soft air into the canvas, and a dry crack when the bones break in the drawing. `nitron-kit/sfx/es_crack` is layered from earshot's bamboo tok, wood snap and short punch (the wav is local only).
- **Wrong lines in his voice:** «ستتطلّب جبيرة» (most adult forearm fractures need surgery; a cast only for one bone not out of place, AAOS) and «لستّ أشهر» (Cleveland Clinic: at least a few months, depending on the fracture). Both are corrected on glass cards over the X-ray while he says them, with the source capsule.

## The cut-out (client, 14 Nov, on EP04 v1: «القص مو نضيف كتير، بيغبش… التفريغ أبداً مو نضيف، عم تروح وتجي الخلفية البيضاء. أنا ليش عامل لك إياها على خلفية بيضاء؟ مشان يكون القص نضيف»)
What was wrong in v1 (and in EP02–EP03, which used the same chain):
- **The cloth came and went.** BiRefNet ran on every 6th frame and optical flow carried it to the frames between. The model was run on the *enlarged* frame, where the cloth beside his arm touches the frame edge, so some key frames took that strip for his body and others did not.
- **The edges were soft.** The set's blur bled 35% into his edge (`stage_composite` wrap), on top of the carry.

Now (`ep04/ml_raw.py`, `ep04/matte_v2.py`, `ep04/ahmad4v2.sh`):
1. **Cut on the wide original frame,** before it is enlarged and cropped, then enlarge and crop the alpha exactly like the picture. On the original, the cloth beside him is a clear strip of backdrop and the model cuts it away (tested on the same frames: the strip stayed in every cut of the enlarged frame, and went in every cut of the original).
2. **BiRefNet on every second frame.** The frame between is the average of its two neighbours, moved onto it by optical flow. Then a 3-frame median, its neighbours moved onto the frame by flow first, so a fast hand keeps its fingers.
3. **The backdrop plate:** per take, the median of each pixel over the frames where he is clearly not there. Wherever a frame equals the plate within the cloth's own noise, it is backdrop. Only regions that touch the known backdrop are removed: the cream hoodie and the cloth are within 1% in colour, so colour alone would cut holes in him.
4. **The cloth's colour comes out of the edge** with the plate as the known background: F = (I − (1−a)·B)/a.
5. **A thin edge wrap:** `stage_composite.py --wrap 0.15`.
- **Never decide unsure regions by the backdrop colour** (EP04 v3: `--decide`, now off). Around his hair it turned the soft wisps into a solid white cap of cloth, because the plate near his head held hair, not cloth. The client caught it: «شوف كيف شعره». Keep the model's own soft hair edge.
- **Do not cut by the plate alone on a cream or white garment.** The first v2 removed every region matching the plate that touched the backdrop, and it bit notches out of his shoulder. The wide-frame cut had already left the cloth out, so that step is now off (`--plate-cut` to turn it on).
- **The model:** BiRefNet-lite (about 15 s a frame here) was clean on the last two takes. On the first take it took the hood's grey lining behind his neck in and out, in runs of a few frames. A long majority vote over 13 or 31 frames only left ragged half-edges, so it is off. BiRefNet-portrait (about 27 s a frame, the model in the client's skill) kept the lining in on every frame checked. Use portrait wherever a hood or collar shows behind the neck.
- **Checks on the delivered file (v2):** 932 frames, 30 fps, 31.07 s; −15.0 LUFS, peak −1.8 dBFS; `08_safe_check.js` all ✅. v1 was deleted from `deliver-v2/`.

## Blends read as blurred frames (client, 14 Nov, on EP04 v2: «كم فريم أكل هوا بالتغبيش»)
- **Measured on v2:** the cut itself was sharp (sharper than the source after grading). The soft frames were all blends: 12 frames from the soft replay into him, 13 frames of canvas fading in over him and again out, and a 3-frame fade at the matched take change.
- **Now:**
  - footage → presenter: a 4-frame dissolve
  - a canvas over him: in and out in 0.2 s (6 frames)
  - a face-matched take change: no fade at all
- **Check every delivery with a per-frame sharpness scan** (Laplacian variance against the 9 frames around). In v3 the only dips are 2–3 frames at each canvas edge and in the 4-frame dissolve.

## Files
- `nitron-kit/injury_series_template.js`: the scene system (EP01 values).
- `reels/injury-series/ep01/`: cut list, scenes, captions, sound plan.
