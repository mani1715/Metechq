# Threat model and security verification

Reviewed: 2026-11-07. Scope: repository and local isolated API tests. This is not an independent penetration test or production certification.

## System and trust boundaries

A public React SPA calls FastAPI over HTTP locally (HTTPS is required for deployment). FastAPI accesses MongoDB and private project file storage. Public visitors, administrators, and clients are separate trust levels. The browser, submitted HTML, URLs, filenames and uploaded bytes are untrusted. Database contents must not establish authorization by themselves. Assets include credentials, tokens, client identities, confidential projects, files and conversations.

## Threat register

| Threat / impact | Controls in this revision | Verification and remaining limits |
| --- | --- | --- |
| Spoofing: forged, expired or wrong-realm JWT; account takeover | Separate signing keys and token types; required expiry/id; live account lookup; inactive accounts rejected; production validates distinct secrets | JWT unit tests and API cross-realm denial. No MFA or per-token revocation; stolen valid tokens remain a risk. |
| Elevation: client B reads client A project or files | Ownership authorization on client project endpoints, including comments/chat/file downloads | Two-client API tests deny cross-client requests and allow owner operations. Repeat for every new endpoint. |
| Elevation: restricted administrator edits protected resources | Database-backed permission dependency on portfolio, clients, client projects and selected CMS routes; private detail reads check admin authorization | Restricted administrator receives 403. Not every legacy admin module has granular permission checks; use super-admin only for trusted operators until remaining modules are reviewed. |
| Information disclosure: public private-project listing | Public query excludes private records; detail endpoint conceals unauthorized private records; bounded pagination | API private exclusion, pagination validation and unauthorized detail checks. Public UI filtering is additional defense, not authorization. |
| Tampering/XSS: stored article HTML or dangerous project URLs | DOMPurify sanitizes article HTML; server validates project links; frontend normalizes URL schemes; deployment CSP restricts scripts | Frontend sanitizer and URL tests; backend URL validation tests. CSP is configured but not yet verified on a hosted domain. Other rich-text surfaces need ongoing review. |
| Tampering: traversal or active upload content | Generated storage names, resolved-path containment, 15 MB limit, extension/signature checks; SVG uploads rejected; authorized downloads | Tests cover disguised files, late SVG content, oversize files, GIF versions and path escape; owner upload/download API test passes. Signatures are not malware scanning; archives/documents may contain malicious content. |
| Spoofing: public administrator bootstrap | Public initialization endpoint returns 410; initial account provisioning happens through controlled server startup configuration | API regression checks removed bootstrap route cannot create an account. Protect bootstrap environment variables and remove bootstrap credentials after provisioning. |
| Injection: regex email login lookup | Escape normalized email before building regex; typed request schemas | Reviewed source; general malformed-input tests. This does not claim exhaustive NoSQL injection coverage. |
| Denial of service: brute force, unbounded requests | Existing rate limiter and payload validation; project API pages capped at 100 | Existing security suite exercises throttling and malformed requests. Local limiter is per-process; configure Redis and proxy trust for multi-worker production. No distributed load test performed. |
| Credential mix-up in browser | Request interceptor chooses only the appropriate token realm and preserves explicit headers | Frontend interceptor tests. Tokens remain in localStorage, so XSS can steal them; a future HttpOnly-session design would reduce that exposure. |
| Spreadsheet injection in exported client data | CSV values quoted and dangerous formula prefixes neutralized | Source review; no spreadsheet application execution test. |
| Supply-chain compromise | Lockfile, targeted direct dependency upgrades and compatible critical transitive fixes; audit report retained | Latest Yarn audit reports 0 critical, 243 high, 132 moderate, 38 low dependency-path findings. These are not unique vulnerabilities. Remaining findings require triage and build-toolchain migration before deployment. Python dependency audit is still outstanding. |
| Repudiation / loss of data | Existing application logs and access checks | Immutable audit trail, retention policy, offsite backups and restore drill remain deployment work. Never log full tokens or passwords. |

## Reproduce verification

From the repository root, with Python backend/test dependencies and local MongoDB installed:

```powershell
python scripts/run_evaluation_tests.py
cd frontend
$env:CI='true'
yarn test --watchAll=false --runInBand
yarn build
yarn audit --groups dependencies --json
```

The runner creates a random `metechq_evaluation_test_*` database, generated credentials and temporary upload directory. It starts its own local API and removes only those generated resources on exit. It does not use your real client database. Results: `docs/verification/backend-results.txt`, `backend-tests.xml`, `frontend-tests.txt`, `frontend-build.txt`, `frontend-dependency-audit.jsonl`. Audit nonzero exit means findings, not a successful clean scan.

## Release decision

Local tests demonstrate specific controls; they do not prove absence of vulnerabilities. Deployment is deliberately deferred. Resolve/triage remaining dependency findings, audit Python dependencies, review all admin permissions, configure HTTPS, exact CORS origins and distinct random secrets, verify hosted CSP/API routing, configure durable private storage and backups, then rerun smoke and authorization tests against an isolated staging environment. Do not expose the development server publicly.
