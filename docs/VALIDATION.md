# Validation record — 23 November 2026, Dubai time

## Automated behavior checks

`node --test`: 13 tests passed on the local Node.js 24.22.3 runtime and the uploaded implementation passed CI on Node.js 22. Coverage includes Arabic pressure evidence, no-URL state, reference-domain boundaries, userinfo deception, IP/HTTP/punycode, brand typo, English/Arabic safety advice, separate malicious clauses, input validation, URL caps, score bounds, unknown vocabulary, and HTTP integration. The HTTP test covers successful Arabic analysis, invalid/oversized input, wrong origin/content type, missing routes and security headers.

## Synthetic classifier smoke evaluation

`node src/evaluate.mjs`: 20 authored cases at threshold 30. TP=9, FP=0, TN=10, FN=1. The missed case S10 combines curiosity and a short link. Exact evaluation text is separate from the 40 training examples. The design process is not independent, so this does not establish general accuracy or calibration.

## Browser checks

Observed live: Arabic fine example (55 technical / 70 manipulation / 79 final), English language switch preserving the result, safety-advice example (0 final), OTP request (100 final / 90 manipulation), clear and empty-input error, JSON report download and matching exported scores. Desktop layout reviewed at 1280-pixel viewport and the narrow interface was visually inspected. Full responsive accessibility certification was not performed. The report uses synthetic data only.

## Presentation

Ten editable slides saved in the shared presentation viewer; all ten rendered and visually inspected. English slide text with Arabic speaker notes. PowerPoint export is available through the viewer. The exported PPTX has not been opened in desktop PowerPoint.

## Remaining release gates

The complete source was published to [atiatahmad5-commits/ahmadat on master](https://github.com/atiatahmad5-commits/ahmadat/tree/master), with the delivery snapshot also on main. Implementation commit `19bccb25096a8c19b4cd192c3713693ec9019810` passed [GitHub Actions on Node.js 22](https://github.com/atiatahmad5-commits/ahmadat/actions/runs/45065940250). This supersedes the initial local-only delivery status. Two-device/offline rehearsal and real-data validation remain team tasks. There is no production-readiness or competition-compliance certification.
