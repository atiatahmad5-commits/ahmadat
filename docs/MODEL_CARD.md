# Model card

**Model:** Multinomial Naive Bayes v0.1 with Laplace smoothing. **Purpose:** a small offline text signal for a bilingual fraud-message prototype. **Owner:** the SCAMSHIELD team. **Training:** 40 newly authored synthetic examples, 20 scam-like and 20 routine/safety examples, balanced across Arabic and English. No real victim records or personal data.

Tokens are lowercased Unicode letters/numbers of length two or more. Unknown tokens are ignored. Priors use class counts. Word likelihoods use `(count + 1) / (class token total + vocabulary size)`. Log probabilities avoid underflow. The two class log scores are converted to a bounded 0–100 signal. A no-known-token input returns a neutral 50 and contributes zero points.

This signal is **not calibrated confidence**. Correlated words, bag-of-words semantics and a tiny synthetic corpus make extreme outputs easy. Its contribution is capped at 10 and requires independent rule evidence plus three known tokens. It cannot lower risk already detected by rules.

## Evaluation plan and limits

The repository includes 20 different authored synthetic smoke strings, not a random sample of real traffic. These test basic integration and known patterns. They are not independent of the design process, even though the exact strings differ from training. Do not call them a statistically valid holdout or use them to advertise accuracy.

The initial run at review threshold 30 yields TP 9, FP 0, TN 10, FN 1. Case S10 uses curiosity plus a short URL and scores 15. This missed case remains recorded. Precision 1.0 and recall 0.9 apply **only to these 20 synthetic examples**, with too little evidence to generalize. No subgroup or production benchmark is available.

Required before a real pilot: consented de-identified samples, two-person labeling/adjudication, source/campaign-separated splits, duplicate removal, dialect coverage, legitimate urgent-message controls, held-out adversarial tests, precision/recall/FPR by language, reliability assessment and monitoring. Evaluate whether adding ML improves results over rules alone. A more capable semantic model is a proposed next step, not part of this version.

Failure modes: implicit coercion, paraphrases, Arabic dialect, transliteration, quoted warnings, mixed benign/malicious clauses, URL-only campaigns, Unicode tricks and unfamiliar brands. The model describes visible message cues; it does not diagnose psychology or predict individual vulnerability.
