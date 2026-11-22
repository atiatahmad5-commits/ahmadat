# SCAMSHIELD AI — Human Firewall

An Arabic/English, locally running prototype for Ahmad, Hamoudeh and Rasha's SCAMSHIELD AI challenge entry. It inspects suspicious messages and URLs and explains the pressure used on the recipient.

**Working scope:** text + URL analysis, separate technical/manipulation indexes, local machine learning, evidence, independent-verification advice and JSON report export. **No API key, npm install, network dependency or build step is required.** This is a prototype, not an official police service or a production fraud verdict.

## Run in two steps

Install Node.js 22 or newer from the official Node.js distribution if needed. In this folder:

```sh
node src/server.mjs
```

Open **http://127.0.0.1:4173**. Keep the terminal running. Stop with Ctrl+C. On Windows you can double-click `start.cmd` after installing Node.js. A port conflict can be resolved by stopping the previous instance or setting `PORT` to another free port. The application binds only to loopback.

```sh
node --test
node src/evaluate.mjs
```

`npm start`, `npm test` and `npm run evaluate` are equivalent when npm is installed. No compilation is needed. The runtime has zero third-party dependencies.

## Problem and solution

A plausible-looking link can arrive with a threat, reward or urgent demand. A URL verdict alone does not explain why someone might act. We expose technical indicators alongside the social-engineering cues in the message, then show a Human Firewall pause with practical next steps. We analyze **message tactics**, not the recipient's personality, mental health or susceptibility.

## Current MVP contract

| Input / output | Implemented behavior |
|---|---|
| Arabic / English message | Up to 12,000 JavaScript characters; Arabic normalization; evidence for detected tactics |
| URL or URLs inside text | Up to 20 URLs; parsed locally without requests to the destination |
| Technical score | Max URL index, 0–100; `null` when no URL is present |
| Manipulation score | Capped sum of distinct rule weights, 0–100 |
| Final score | Strongest rule index plus bounded ML contribution, capped at 100 |
| Human Firewall | Persistent pause/checklist and advice, no automatic link opening |
| Interface | Arabic RTL and English LTR, editable input, examples, clear, JSON download |

No result is labeled “safe.” A value such as **79/100 is a heuristic risk index**, not a 79% chance of fraud. A reference-domain match does not authenticate a sender, page or transaction.

## Technology choices and trade-offs

- **Node.js + standard HTTP server:** same language for server and interface, no dependency installation, simple offline demo. Trade-off: manual validation and routing; intentionally loopback-only, no multi-user hosting.
- **Plain HTML/CSS/JavaScript:** small, auditable bilingual UI with no build pipeline. Trade-off: fewer framework conveniences.
- **Multinomial Naive Bayes:** actual locally trained text classifier with Laplace smoothing, using 40 original synthetic bilingual examples. Trade-off: weak semantics, tiny vocabulary, uncalibrated output, no production accuracy claim.
- **Explicit rules:** evidence and predictable behavior. Trade-off: paraphrases, dialects, obfuscation and negation can evade or confuse them.
- **No URL fetching:** avoids exposing visitors to destinations and eliminates server-side request forgery in this version. Trade-off: no webpage inspection, redirects, reputation or domain-age evidence.

Model output can contribute at most 10 points and cannot reduce rule evidence. See [technical design](docs/TECHNICAL.md) and [model card](docs/MODEL_CARD.md).

## Repository structure

```text
src/       server, URL/psychology rules, ML classifier, evaluation
public/    Arabic/English UI
data/      40 training examples + 20 separate synthetic smoke cases
tests/     behavioral and API tests
docs/      architecture, privacy, model card, delivery plan, pitch, judge Q&A
.github/   test workflow
```

## Demo

1. Choose “مخالفة مستعجلة” and analyze. Discuss the actual host, urgency, legal threat and authority claim. The fake domain uses `.example`.
2. Choose “رسالة سليمة”. Explain that few detected signals do not prove safety.
3. Switch to English. Choose “OTP request”, analyze and show the Human Firewall advice.
4. Download a report only with synthetic content. Reports contain evidence text and URLs.

## Evaluation

`node --test` checks behavior and safety boundaries. `node src/evaluate.mjs` prints a confusion matrix at a review threshold of 30. The 20 evaluation strings are separate from training strings, but authored for this prototype and therefore **not an independent benchmark**. Do not advertise these results as field accuracy. The curiosity/short-link case S10 currently falls below the review threshold; preserve this known limitation in the presentation.

## Not implemented because of time

Screenshot upload/OCR, QR decoding, webpage fetch/render, redirect following, domain reputation and age, browser extension blocking, threat-intelligence integrations, dialect-robust semantic models, and calibrated fraud probabilities. The UI states these limits. Users can manually paste visible text from a screenshot, but that is not OCR support.

## Next improvements, in priority order

1. Independently collect and label consented, de-identified Arabic/English cases, including difficult legitimate messages and dialects. Freeze evaluation data before adjusting rules.
2. Evaluate a multilingual semantic classifier or a structured-output LLM against this baseline. Add consent and redaction before any cloud model, and retain the offline fallback.
3. Add screenshot OCR and QR decoding only after the core demo passes on both team laptops; require user confirmation of extracted text.
4. Evaluate domain reputation and redirects behind an isolated fetcher with DNS/IP checks at every hop, limits and explicit unknown states.

## GitHub delivery

Use branch **master** as requested. The local handoff is prepared for Git. Remote publication requires the team's chosen GitHub repository and authenticated access. Follow [delivery checklist](docs/DELIVERY.md); do not claim upload until the remote commit and branch are verified. CI runs tests and prints evaluation on push/PR.

## Privacy and originality

Input stays between the browser and a loopback server. No telemetry, cookies, database, localStorage or external requests are used. Input is kept in memory until cleared or the page/process is closed; this is not a cryptographic deletion guarantee. JSON exports persist on disk at the user's request. See [privacy and threat model](docs/PRIVACY.md).

Code and synthetic examples were newly authored for this project with AI assistance. No external dataset, third-party logo or visual asset is included. The team must review and understand the implementation and disclose assistance if the organizer requires it. No license is granted by this repository until the team selects one.

Challenge context: [published event page](https://podium.aevsoft.cc/HackathonMngtWebApp/event.php?e=ad-police-x-42ad-hackathon), checked 23 November 2026 Dubai time. Source-code, master-branch and presentation requirements are taken from the team's supplied brief; reconfirm the final organizer rubric.
