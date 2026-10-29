# فحص مهارات صناعة الريلز — التقرير والتثبيت

فُحصت المستودعات الستة بنسخها كاملة (clone) يوم 29 أكتوبر 2026، وقُرئت ملفات SKILL.md وتعليمات التثبيت فعلياً.

## 1) هل الروابط صحيحة؟ وأين تعمل؟

| # | المستودع | موجود؟ | المحتوى الفعلي | claude.ai |
|---|---|---|---|---|
| 1 | social-media-skills/skills | ✓ (آخر تعديل 15 أكتوبر) | 106 مهارات، MIT، ملفات ZIP رسمية بإصدار v1.0.1 | ✓ بملفات الإصدار الرسمية |
| 2 | Ootto-AI/claude-content-skills → `skills/virality` | ✓ (17 أكتوبر) | ملف SKILL.md واحد (من 52 مهارة بالمستودع)، MIT، بلا ZIP | ✓ بعد تغليفه |
| 3 | whatsuppiyush/ad-maker-claude-skill | ✓ (18 أكتوبر) | SKILL.md بجذر المستودع + 11 أمر + 30 إطار هوك + مصفوفة زوايا، MIT | ✓ بعد نقله لمجلد وحذف حقل `homepage` |
| 4 | xnomad-dev/claude-skills → `video-script-writer` | ✓ (8 أبريل) | ملف واحد؛ الاسم `video-script` لا يطابق المجلد؛ **لا يوجد ملف ترخيص** | يحتاج تعديل — غير مُوصى به |
| 5 | arhamhi/hooksmith | ✓ (10 يونيو) | مهارتان + 10 مراجع + سكربت Node، MIT | ✓ بعد حذف حقول خاصة بـClaude Code |
| 6 | w-avw/instagram-viral-reels-research-claude-skill | ✓ (فرع master، 19 أغسطس) | مهارة `viral-outliers` + سكربتات تنزيل وتفريغ | ✗ تحتاج Claude Code + Chrome مسجّل دخول + OpenCLI + agent-reach + ffmpeg + faster-whisper |

ما لم أستطع التحقق منه:
- تجربة الرفع الفعلي على حسابك.
- الادعاءات الرقمية داخل المهارات. virality: 262 منشوراً و3.5 مليون مشاهدة من حساب واحد في مجال أدوات الذكاء الاصطناعي، بيانات يذكرها صاحبها. hooksmith: حالة واحدة 110 ألف مشاهدة. social-media-skills: قواعد خوارزمية بلا مصادر مرفقة.

## 2) التداخل والاختيار

| الوظيفة | المختار | المستبعد بسبب التكرار |
|---|---|---|
| قواعد البيت (الجمهور، اللهجة، بلا حشو) | content-principles (مهارتنا) | — |
| الهوك المحكي ونظام الاحتفاظ | hooksmith | hook-writer، viral-hook-writer، هوكات ad-maker، جدول هوكات video-script |
| الهوك البصري لأول 3 ثوانٍ | virality | لا يوجد بديل بنفس الدقة |
| سكريبت الريل وآليات إنستغرام | reels-script | video-script-writer، reel-scripter، short-form-video-script |
| Shot list والتصوير | scripting-and-storyboarding + talking-head-and-piece-to-camera | storyboard في ad-maker، b-roll-shot-list، قائمة video-script |
| البحث وتحليل الريلز الناجحة | viral-reverse-engineering | viral-outliers (Claude Code فقط) |
| التحويل والإعلانات | ad-maker | ad-copy-generator |

## 3) ما الذي غيّرته في النسخ المغلّفة (كلها MIT، والترخيص مرفق)

- **hooksmith**:
  - حذفت `argument-hint` و`user-invocable` (خاصة بـClaude Code)، ونقلت `version` إلى `metadata`.
  - حذفت ملف Codex.
  - أضفت `HOOKS.md` الخاص بنايترون، وسطراً يجعل المهارة تقرؤه.
- **ad-maker**:
  - نقلتها إلى مجلد `ad-maker/`، ونقلت `homepage` إلى `metadata`.
  - حذفت قسم «nudge rule» الذي يضيف روابط إحالة لـHookAds إلى المخرجات.
- **scripting-and-storyboarding** و**talking-head-and-piece-to-camera**: نقلت `version` إلى `metadata`.
- **virality**: كما هو، مع إضافة ملف الترخيص.
- **reels-script** و**viral-reverse-engineering**: ملفات الإصدار الرسمية كما هي.

## 4) التثبيت على claude.ai من المتصفح

الملفات الثمانية في `nitron-skills/zips/`. كل ملف يحتوي مجلداً باسم المهارة، وبداخله SKILL.md.

1. **Settings → Capabilities**: فعّل «Code execution and file creation».
2. افتح **Customize → Skills** (https://claude.ai/customize/skills)، اضغط **+**، اختر رفع مهارة، ثم اختر ملف ZIP. لا تفك الضغط.
3. كرّر الخطوة لكل ملف من الثمانية، وفعّل كل مهارة بعد رفعها.
4. افتح محادثة جديدة واكتب: «عندي فكرة فيديو عن ستراب الثمانية لنايترون». تأكد من أن Claude حمّل content-principles وhooksmith.

بديل لملفي social-media-skills غير المعدّلين، من الإصدار الرسمي:
- https://github.com/social-media-skills/skills/releases/download/v1.0.1/reels-script.zip
- https://github.com/social-media-skills/skills/releases/download/v1.0.1/viral-reverse-engineering.zip

## 5) طريقة العمل

مكتوبة في content-principles، قسم «Workflow»:
1. الجمهور والهدف.
2. مراجع حقيقية، وكل نمط موسوم «مستند» أو «فرضية».
3. ثلاث أفكار بآليات مختلفة.
4. هوك محكي (hooksmith) + هوك بصري كل نصف ثانية (virality).
5. سكريبت بتوقيتات (reels-script).
6. خطة تصوير ومونتاج.
7. سبب كل اختيار، واختبار A/B مع المقياس الذي يحسمه.

**البحث:** claude.ai لا يشاهد رابط إنستغرام. المطلوب ملفات MP4 للريلز المرجعية، أو تفريغ + لقطات شاشة + المشاهدات والمتابعين. في جلسة Claude Code هذه يمكن استخراج الفريمات وتفريغ الصوت فعلياً.
