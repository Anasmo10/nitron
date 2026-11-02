# Nitron video template: motion graphics + voice-over (9:16, 35–45 s)

Fill in sections 1–3 and send them along with the voice files. That's everything needed to make the video in one round.

---

## 1. Brief

| Field | Your answer | Example (deadlift straps video) |
|---|---|---|
| Product | | Figure 8 Strap |
| Product name on screen (English or Arabic?) | | English: "Figure 8 Strap" |
| Product photo (transparent PNG) | attach | fig8.png |
| One-line goal | | Show that the grip gives out before the back on heavy deadlifts |
| Audience | | Gym-goers who lift heavy |
| Length | 35–45 s | 41 s |
| Ending (CTA) | | «اطلبوا هلق من نايترون» (order now from Nitron) + nitron.sport |

## 2. Video structure (5 parts)

| Part | Time | Job | Example |
|---|---|---|---|
| **Hook** | 0–5 s | One surprising sentence + a strong visual | «ضهرك مو هو اللي بيوقّفك… قبضتك هي» (it's not your back that stops you… it's your grip) + 3D barbell |
| **Problem** | 5–20 s | What happens and why | The grip tires first, then the bar slips |
| **Proof** | 20–35 s | One number from a real study, clear on screen | +10%: 160.6 → 177 kg with straps |
| **Solution** | 35–40 s | The product, real photo, its name | «الحل؟» (the solution?) + strap photo |
| **CTA** | last 3 s | Logo + one line + call to action | «اطلبوا هلق من نايترون» |

## 3. Script (one line = one scene)

| # | Voice line (Syrian dialect) | Headline on screen (4 words max) | What we see | Source (study, year, number of people) |
|---|---|---|---|---|
| 01 | | | | |
| 02 | | | | |
| 03 | | | | |
| 04 | | | | |
| 05 | | | | |
| 06 (solution) | | | product photo | — |
| 07 (CTA) | | | logo + button | — |

**Writing rules (to keep viewers watching):**
- One idea per line, 8 seconds max per line.
- Each sentence should open a question the next sentence answers.
- One number per scene, rounded and easy to say.
- Only facts from studies **on lifters**. Skip anything indirect or that needs explaining.
- No long pauses: the voice keeps moving from start to end.

## 4. Recording the voice (no AI voice)

- Use your phone (WhatsApp is fine) in a quiet room, with the phone about 20 cm from your mouth.
- **One file per line**, named by number: `01`, `02`, …
- Leave a second of silence before and after each line.
- If you slip, say the whole line again in the same file. I'll keep the best take.
- Record all the lines **in the same place, same day, same phone** so they sound alike.

## 5. Files to send

- [ ] Voice files 01 … 07
- [ ] Product photo (transparent background if possible)
- [ ] Any change to the product name or the CTA

## 6. What you get back

- Video 1080×1920, 30 fps, at Instagram's level (−14 LUFS)
- Cover showing the product (two-line title at most), set as the video's first frame
- Instagram caption with the sources
- The Nitron house music under the voice, with light sound effects

## 7. Feedback (one round)

Write each note like this: **time + what to change**
> 0:12: the number is too small · 0:38: shorten the pause

---

### For Claude (build steps, no guesswork)
1. Copy `nitron-motion/deadlift-straps-v2/` as a base (`scenes/lib.js` has `NK.head`, `NK.note`, `NK.bumper`, glass, shadows).
2. Voice: `afftdn` + highpass 80 → tone-match to the reference lines → −24.1 LUFS per line → align (`align.py`) → `vo/lines.json` → `gen_timeline.py` (natural 0.6 s pause between lines).
3. Two to four preview frames per scene → one parallel render (4–6 range processes) → render only the changed frames after that.
4. `motion_mix.py` (house music, −22 LU under the voice) → `product_cover.py --first` → deliver.
