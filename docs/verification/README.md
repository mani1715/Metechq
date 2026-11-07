# Verification evidence — 7 November 2026

| Check | Result | Evidence |
| --- | --- | --- |
| Security / API regression pytest | 53 passed | backend-results.txt, backend-tests.xml |
| General admin/API CRUD | 37 passed | backend-results.txt |
| Client management workflow | 12 passed | backend-results.txt |
| Frontend regression tests | 17 passed, 5 suites | frontend-tests.txt |
| Production compilation | Passed | frontend-build.txt |
| Dependency audit | Findings remain: 0 critical; 243 high, 132 moderate, 38 low dependency paths | frontend-dependency-audit.jsonl |
| Browser review | Homepage, five existing portfolio records, detail navigation, client login, mobile menu and widths checked | Local preview; no hosted verification claimed |

Backend execution uses a disposable random database and temporary uploads. The frontend suite uses mocked API responses to test token selection, URL validation, sanitized HTML, paging beyond 100 records, client refresh selection and offline error handling. These frontend tests are not a full authenticated browser journey. Production compilation was run after dependency updates. CI workflow is configured but a remote CI run was not performed.

The existing demo record imagery was restored from its stored URLs; owner-supplied real screenshots/deployed links remain content preparation. Mobile image lazy loading means offscreen images do not necessarily load until scrolled into view.

Reproduction commands and limitations are in ../../THREATS.md. Server logs are ignored because diagnostic logs should not be published indiscriminately. Deployment, hosted TLS/CSP verification, Python dependency audit, remaining legacy admin permission review and dependency remediation are outstanding release work, not passed checks.
