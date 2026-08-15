# PassSafe Pro — Mobile Interface Design

## Design intent

PassSafe Pro is a calm, confidence-building study companion for food-safety certification preparation. The visual language uses deep forest green (`#1B5E40`) for progress, assurance, and primary actions, supported by warm amber (`#F59E0B`) for attention and premium cues. The design is optimized for a **9:16 portrait phone**, supports one-handed use, and follows iOS Human Interface Guidelines through clear hierarchy, full-width tap targets, generous spacing, Safe Area awareness, and native bottom-tab navigation.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Welcome | Branded shield mark, focused value proposition, and a single clear path into setup. |
| Language selection | Four large radio-style language rows for English, Spanish, Chinese, and Korean. A primary bottom action persists the choice. |
| Exam setup | Certification-track cards and an exam-date field build the initial study plan. |
| Home | Readiness gauge, daily progress, practice recommendations, focus areas, and the free-plan usage status. |
| Study modes | Four concise entry cards: quick practice, topic drill, mock exam, and Night Before review. |
| Topic selection | Searchable or scrollable topic rows with question counts and touch-friendly drill actions. |
| Study session | Full-screen question flow with a compact progress indicator, accessible answer options, immediate feedback, explanation, and tip. |
| Study result | Result summary, score, answer statistics, and clear retry or home actions. |
| Progress | Readiness gauge plus per-topic performance bars and direct drill entry points for weak areas. |
| Profile | Learner identity, streak, language and exam preferences, subscription state, notification setting, legal notice, and logout action. |
| Paywall | Bottom sheet that transparently presents rewarded unlocks and the unlimited Pro offer without blocking dismissal. |

## Key user flows

| Goal | Flow |
|---|---|
| Start studying | Welcome → language selection → exam setup → home → daily questions or study modes → study session → result → home. |
| Improve a weak topic | Home focus area or Progress topic row → drill action → topic session → immediate explanations → result. |
| Change language | Profile → language row → language selection modal/screen → save → content immediately updates to the selected translation with English fallback. |
| Continue after free limit | Study session detects the answer limit → paywall → watch rewarded placement for 10 questions or enable Pro → return to session. |
| Review readiness | Home gauge → Progress tab → review topic bars → select a topic below 50% → drill. |

## Layout and interaction rules

The overall canvas uses an off-white background (`#FAFAF8`) with white cards at 16px corner radius and restrained soft elevation. Primary and secondary actions use a consistent 56px minimum height with 28px corner radii, while answer rows are at least 64px tall. Primary actions sit in the lower reach zone where feasible, and the persistent Home, Study, Progress, and Profile tabs remain clear of the iPhone home indicator.

Question sessions remove the tab bar so learners can focus. They place close and progress controls at the top, question text in a readable 18px weight-600 treatment, and large vertically stacked answer targets. Correct, incorrect, and selected states are announced through color plus visible iconography so color is not the sole feedback mechanism. Toasts and inline explanatory cards provide feedback without forcing navigation changes.

## Brand and color choices

| Token | Value | Use |
|---|---:|---|
| Primary | `#1B5E40` | Primary buttons, correct answers, readiness, selected states. |
| Primary light | `#2D7A55` | Supporting green surfaces and Pro accents. |
| Accent | `#F59E0B` | Badges, free-limit prompts, fast drill cues, and supporting emphasis. |
| Accent light | `#FEF3C7` | Low-contrast amber backgrounds and tags. |
| Background | `#FAFAF8` | Screen canvas. |
| Surface | `#FFFFFF` | Cards, inputs, and answer rows. |
| Text | `#111827` | Primary type. |
| Secondary text | `#6B7280` | Helper copy and quiet metadata. |
| Success | `#1D9E75` | High performance and correct-answer feedback. |
| Danger | `#EF4444` | Incorrect answers and low-readiness emphasis. |

Typography uses the system sans-serif family for optimal native performance and character support, with 600-weight headings, 400-weight body copy at roughly 16px, and 500-weight buttons. CJK text uses the platform’s native CJK fallback fonts to retain legibility across all supported languages.
