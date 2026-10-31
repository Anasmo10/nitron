# Handoff: Nitron Reels (nitron.sport)

This file is for whoever (person or Claude session) picks up this work next.
- **Repo:** `anasmo10/nitron`, branch `claude/kind-lamport-c9l5c4`.
- **Last commit before this file:** `77333bd`.
- **Date:** 31 Oct 2026.

## 1. Client and goal
- **Client:** Nitron Fitness Store (nitron.sport), a gym-accessories store in Syria. It sells straps, wrist wraps, gloves, belts and similar gear.
- **What we do:** edit raw iPhone talking-head clips into Instagram Reels (9:16, 10–17 s) in one house style. We also wrote scripts and hooks and audited Reels skills for claude.ai.
- **How the client writes:** Syrian Arabic, usually voice-dictated, so words come out garbled ("ستروب" = strap, "ليكويد جلاس" = liquid glass).
  - Reply in short Syrian Arabic.
  - Send finished files with `SendUserFile`.
  - **Never publish or post anything.**
- **Identify videos by topic or product, never by number.** "الفيديو الأول" once meant reel #3, not reel #1, and the client was angry when the wrong one was edited. If unsure which video, name the candidates by topic (e.g. «التكنيك قبل المشد» / BIMute) before working.

## 2. Standing rules from client feedback (all of them still apply)
| Rule | Origin |
|---|---|
| Colours only from the logo: black `#0A0A0C`, white, purple `#76028A` (light purple `#C77DDB` for text on dark). Cairo 900 for Arabic, Inter for English. | reel #1 |
| Text behind the speaker (words on the wall behind his head, person cut out on top), at least twice when there is wall above the head. | reels #1, #4 |
| Better image quality: grade, denoise, sharpen, white balance matched across clips. | reel #1 |
| Original background music plus meaningful SFX; music about 12 dB under the voice; −14/−15 LUFS. | reel #2 |
| A strong hook with motion graphics; one unified Nitron identity across reels. | reels #2, #3 |
| **Never shrink the speaker or push him down** (no card, no lower-panel `R_DOWN`). Full frame; eyes around y 600–750; respect Instagram safe zones. | reel #4 |
| **Liquid glass like iPhone:** graphics are frosted glass panes over the video, never a solid panel that takes part of the screen. Captions are glass too. | reels #1–#3 note |
| **Real product photo in every video**, and the **cover shows the product, not the person**. No ✕ on Nitron products. | reels #1–#3 note |
| **Show what his hands do** (putting on, tightening, showing the product), even in silent moments: hands close-up, captions lifted off the hands. | reels #1–#3 note |
| The product name in reel #2 must be English: "Figure 8 Strap", not «الفيغر 8 ستراب». Possibly a general preference for English product names; **ask before applying it elsewhere**. | reel #2 |

The full style guide is `nitron-kit/NITRON-STYLE.md` (v2.1). The pipeline skill is `.claude/skills/nitron-edit/SKILL.md`. The script and wording rules are in `.claude/skills/content-principles/SKILL.md`.

## 3. Status of every reel
| Reel | Topic / clips | Current deliverable | Notes |
|---|---|---|---|
| #1 | «معصمك لازم يضل ثابت», wrist wraps (BIMute), IMG_6860/6869/6872 | **v1** (old plugin layout with two `R_DOWN` panels) | A v2.1 redo was made, then **deleted at the client's request**: they had meant reel #3. Only v1 stands. Project: `nitron-reel/`. |
| #2 | «لا تشتريها للمنظر», figure-8 strap, IMG_7231/7237/7242/7245 | **v2.1** `deliver-v2/nitron-reel-2-v2.mp4` (13.9 s) | Full frame, glass, product photos (5.jpg figure-8, 6.jpg BIMute), «اشتريها → لمشكلتك» behind his head, "Figure 8 Strap" in English (caption and card label), product cover. Project: `nitron-reel-2/v2/`. |
| #3 | «التكنيك قبل المشد», BIMute wrist wraps, IMG_7250/7253/7260 | **v2.1** `deliver-v2/nitron-reel-3-v2.mp4` (13.6 s) | Camera pushes in on his hands while he wraps the wrist (3.40–4.86 s, `hands_r3.py`), BIMute glass card ✓/✕, hook words behind his head, glass equation list, product cover. Project: `nitron-reel-3/v2/`. |
| #4 | «المشد مو علاج», SBD wrist wraps, IMG_7263/7265/7277 | **v2** (full frame, wall words, SBD side card, person cover) | Not yet converted to v2.1 (glass captions, product cover). Offer it, don't do it unasked. Project: `nitron-reel-4/`. |

QA on every delivered v2/v2.1 reel:
- `08_safe_check.js` all ✅.
- Caption sync ≤ 0.06 s.
- −15 LUFS, peak ≤ −1.1 dBTP.
- Music −12 dB under speech.

**Known nit (reel #2, not raised by the client):** at 6.7–7.6 s the grip/back meter panel briefly overlaps the figure-8 glass card.

**Open question (reel #3, never confirmed):** «مو يصحّح» was chosen over «ويصحّح» from the audio and the meaning.

## 4. Where things are
**In the repo** (public, so never commit media, product photos, logos or personal data):
- `nitron-kit/`: the house edit system.
  - `engine.html` is the canvas engine. It holds `glassPane`, the glass caption style and the per-scene `capY`.
  - `kit.js` is the component library:
    - v2.1 (glass): `nkGlassCard`, `nkGlassList`, `nkGlassChip`, `nkGlassPill`, `nkGlassLens`.
    - v2: `nkWallWords`, `nkChest`, `nkSideCard`, `nkOutro`.
  - `assemble.py`, `build_cut.py`, `behind_fix.py`, `sound.py` (SFX kinds include `velcro` and `stretch`), `finish.sh`.
  - `product_cutout.py` (BiRefNet-lite), `product_cover.py`, `NITRON-STYLE.md`.
- `nitron-reel*/`: per-reel project files (scenes, captions, sound plans, READMEs).
- `nitron-scripts/`: hook and spoken scripts.
- `nitron-skills/`: the audit of 6 Reels skill repos, upload-ready ZIPs and `HOOKS.md`.
- `deliver-v2/`: delivered files. **Git-excluded** through `.git/info/exclude`.

**Outside the repo (ephemeral container; lost when the session ends):**
- **Raw clips:** `/root/.claude/uploads/<session>/…IMG_*.MOV`.
- **Images:** `/tmp/claude-0/-home-user-nitron/<session>/images/`.
  - `1.jpg`: Nitron logo.
  - `2.webp`: red figure-8 straps.
  - `3.webp`: Everlast dumbbells.
  - `4.jpg`: SBD wrist wraps.
  - `5.jpg`: black figure-8 strap.
  - `6.jpg`: BIMute wrist wraps.
- **Work folders:** `/home/user/work/`.
  - `r2/` and `r3/`: current v2.1 builds of reels #2 and #3.
  - `v4/`: reel #2 v1 pieces.
  - `v5/`: reel #3 v1.
  - `work/`: reel #1 v1.
  - `r1/`: the deleted reel #1 redo.
  - `assets/`: product cutouts.
- The old scratchpad (`deliver…deliver4`, `v6` = reel #4 work) still exists on disk, but the harness marked it unavailable. Copy anything needed out of it first.
- **If the container is gone:** ask the client to re-upload the clips and product photos.

## 5. Environment notes
- **Editing plugin:** majed-video `video-ad-editor`, at `/root/.claude/plugins/synced/…/majed-video/video-ad-editor/scripts`. The scripts used are:
  - `02_captions.py`
  - `04_render_frames.js` (`preview` / `range` / `all`)
  - `06_encode.sh`
  - `08_safe_check.js`
  - `09_srt.py`
- **Chrome:** set `CHROME_PATH=/home/user/work/bin/chrome`. That file is a wrapper: `exec /opt/pw-browsers/chromium --no-sandbox "$@"`.
- **Hugging Face is blocked.** The models in `/root/models` came from GitHub releases:
  - sherpa-onnx whisper turbo: transcription.
  - Meta omnilingual 300M CTC: word timing (alignment).
  - u2net_human_seg: person masks.
  - BiRefNet-lite: product cutouts.
- **Python and fonts:** use `opencv-python-headless<5` (v5 has no Haar cascades). Cairo and Inter are installed under `~/.local/share/fonts`.
- **Music:** synthesized in numpy (no samples, no rights issues). Higgsfield only has a game-music model, and no credits were spent.

## 6. How to build a reel (short version; full steps in the nitron-edit skill)
1. Transcribe and align the clips. Pick the takes. **Look at silences before cutting them**, because hand actions hide there.
2. `build_cut.py reel.json <work>` produces the frames and the levelled voice.
3. Captions with `02_captions.py`.
4. Person masks for the wall-word frames: `personmask.py`, then `behind_fix.py <work> wall f0 f1`.
5. Product photo cut out with `product_cutout.py`.
6. Write `scenes.js` with kit components (full frame, glass, `capY` where the hands are), then run `assemble.py`.
7. Preview, then `04_render_frames.js all`.
8. Write `sound.json`, then run `sound.py`.
9. Run `06_encode.sh`, then `finish.sh`.
10. Make the cover: `product_cover.py <work>/cover product.png "سطر|سطر" --logo logo.png --first ad-master.mp4`.
11. Run `08_safe_check.js`, then deliver the mp4, cover, srt, txt and music.

## 7. Repo and git rules
- Develop and push only on `claude/kind-lamport-c9l5c4`. **No pull request unless the client asks.**
- Commit trailers:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
  `Claude-Session: https://claude.ai/code/session_01KyM4H1tskA1xQH68ow6ACi`.
  No model IDs anywhere else.

## 8. Suggested next steps (offer them; don't do them unasked)
- Convert reel #4 to v2.1: glass captions and a product cover with the SBD photo.
- Ask whether other product names should also appear in English, as "Figure 8 Strap" now does.
- Reel #1 stays at v1 unless the client asks again; the redo is in git history at `215ca96` if needed.
