# Privacy and threat model

## Data flow

Browser memory → loopback JSON request → process-memory analysis → browser memory. No external AI, DNS resolution for analyzed links, analytics, database, cookies or persistent browser storage. The server logs startup only, not request bodies. Clearing removes the visible input/results and drops references; closing the page/process releases normal application memory, not forensic traces. The operating system may still swap memory.

JSON export is explicitly user initiated and includes evidence/URLs. Exported files remain in Downloads until the user removes them. Do not demonstrate with actual OTPs, account details, private conversations or victim records. The app does not promise automatic redaction.

## Implemented controls

Loopback bind; expected Host check; browser Origin check on analyze requests; JSON-only input; 50 KB body and 12,000-character limits; 20-URL limit; request timeout; no-store responses; restrictive Content Security Policy; no innerHTML interpolation; no clickable analyzed URLs; no remote fetch path. Host and Origin controls reduce browser cross-origin/DNS-rebinding exposure but do not authenticate local processes.

## Threats and residual risks

| Threat | Current control / limitation |
|---|---|
| SSRF / malicious website execution | No remote fetch or rendering exists |
| HTML/script injection in evidence | Render as text; CSP blocks inline and foreign scripts |
| False reassurance | Never label safe; missing checks explicitly shown |
| Prompt injection | No instruction-following LLM, tools or prompts consume input |
| Resource abuse | Bounded input and URLs; no hosted-service rate limiting |
| Hidden manipulation | Rules/model may miss it; human verification remains necessary |
| Shared-device exposure | Clear the page and avoid real sensitive data; downloaded reports persist |

A future cloud LLM must use explicit user consent, data minimization, redaction, retention/vendor review, schema validation and untrusted-input isolation. A future fetcher must restrict schemes/ports, validate DNS/IP at each hop, reject private/link-local/metadata destinations, cap redirect count/body/time and use network isolation. Those are future requirements, not implemented protections for a fetcher.
