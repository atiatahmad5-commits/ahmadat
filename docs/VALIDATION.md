# Validation record — 23 November 2026, Dubai time

## Automated behavior checks

`node --test`: 13 tests passed on the local Node.js 24.22.3 runtime. Coverage includes Arabic pressure evidence, no-URL state, reference-domain boundaries, userinfo deception, IP/HTTP/punycode, brand typo, English/Arabic safety advice, separate malicious clauses, input validation, URL caps, score bounds, unknown vocabulary, and HTTP integration. The HTTP test covers successful Arabic analysis, invalid/oversized input, wrong origin/content type, missing routes and security headers. Node.js 22 CI is configured but has not run remotely.

## Synthetic classifier smoke evaluation

`node src/evaluate.mjs`: 20 authored cases at threshold 30. TP=9, FP=0, TN=10, FN=1. The missed case S10 combines curiosity and a short link. Exact evaluation text is separate from the 40 training examples. The design process is not independent, so this does not establish general accuracy or calibration.

## Browser checks

Observed live: Arabic fine example (55 technical / 70 manipulation / 79 final), English language switch preserving the result, safety-advice example (0 final), OTP request (100 final / 90 manipulation), clear and empty-input error, JSON report download and matching exported scores. Desktop layout reviewed at 1280-pixel viewport and the narrow interface was visually inspected. Full responsive accessibility certification was not performed. The report uses synthetic data only.

## Presentation

Ten editable slides saved in the shared presentation viewer; all ten rendered and visually inspected. English slide text with Arabic speaker notes. PowerPoint export is available through the viewer. The exported PPTX has not been opened in desktop PowerPoint.

## Remaining release gates

Remote GitHub publication is pending: account connection succeeded, no accessible repository was listed, and repository creation in the browser requires sign-in. No remote commit, CI pass or public sharing is claimed. Two-device/offline rehearsal and real-data validation remain team tasks. There is no production-readiness or competition-compliance certification.
