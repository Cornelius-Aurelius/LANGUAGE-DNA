# LanguageDNA v19 — First Five Learning Improvement & Validation

## What changed

- Daily 5 is a consistent five-step learning journey: **Remember → Spot → Use → Say → Real life**.
- Once a learner starts today's session, the focus word and scenario are saved in `ldna-daily5-v1`. Marking a word familiar cannot unexpectedly change the word at the next step or after a reload.
- Beginner's first recall can be skipped with **Show me · no penalty**, which immediately introduces the correct English–Spanish link. The choice is recorded as help used, not as a correct recall.
- Spanish can be replayed at normal browser voice speed or slowly; microphone assessment remains optional with an accessible self-report alternative. The site does not claim to assess native-like accent.
- The completed lesson displays the exact focus word, an encouraging success state, **Discover a pattern**, and **See my progress**.
- My Spanish gains four streak-free learning-day milestones. The first-visit Home stays uncluttered; a compact **Continue Daily 5** card appears only after learning has started.
- Milestones and completion history are computed entirely on-device. Nothing in v19 sends learner analytics to a server. An online account is still not required.

## Verification before release

1. Run `node tests/quality-check.js`: quality and safety regressions.
2. Run `npx playwright test tests/mobile-browser.spec.cjs`: first visit, mobile sizes, 7 app screens, dark mode, offline cache, and an end-to-end Daily 5 from Show me through real-life completion and milestone.
3. Confirm no navigation overflow at 320, 375, 430, 768 and 1280 px.
4. Test TTS and the microphone fallbacks on real iOS Safari and Android Chrome; browser capabilities vary.
5. Verify local progress backup and restore; cloud sync remains inactive pending separate auth verification.

## Real-learner study protocol (NOT yet conducted)

Ask **5–10 first-time learners** aged across the intended audience to attempt, without coaching:
1. Find Patterns within 10 seconds.
2. Start the first Daily 5 without creating an account.
3. Explain the pattern or English–Spanish connection they learned.
4. Complete one five-step lesson, using **Show me** if stuck.
5. Find the next lesson or Patterns and their progress.

Record consent-based *aggregate counts only* (not names, emails, microphones or individual learning histories):
- Number who find Patterns unaided.
- Number who start and complete Daily 5.
- Where they hesitate or abandon the lesson.
- Whether they can say one useful Spanish phrase from the lesson.
- Whether they understand the next action and return voluntarily later.

Do not market learning efficacy or user retention as validated until these tests are actually run. There is no cross-user analytics pipeline in the current static site.

## Future phases, separate from v19

- Human-review the most useful audio and language examples and, if budget allows, commission clear native-speaker recordings with proper licensing.
- Verify email signup/recovery, account isolation and conflicts with two actual accounts before enabling optional cloud sync.
- Validate Spanish learning outcomes before adding carefully authored French and German courses.
