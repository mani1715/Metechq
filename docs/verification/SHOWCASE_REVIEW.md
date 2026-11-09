# Showcase and enquiry verification

**Date:** 9 November 2026 · **Scope:** local checkout, isolated MongoDB data, production frontend build.

## Changes and findings

- Rebuilt the README around the implemented public website, client workspace and admin suite. Added real local screenshots and links to code, tests, setup and security limitations.
- Aligned the contact hero, form and guidance column; made booking/pricing optional expandable sections; retained a visible success confirmation and an explicit network-error path.
- Added optional `budget` and `consent` fields across contact creation, MongoDB model and response serialization. Existing submissions remain compatible. The admin detail view displays both fields; edits that omit them preserve stored values.
- Fixed the admin login screen: it used the general `/auth/login` route (and duplicated `/api` in its URL) with a username payload. It now uses the shared AdminContext/auth service and `/admins/login`.
- Refined portfolio previews, typography, filters and project labels; added studio attribution on cards, detail pages and demos. An empty successful catalogue response now clears the visible grid instead of retaining stale projects.
- Fixed a runtime crash in the corporate demo caused by a missing `Building2` import and string case-study results being rendered as an array. Added a regression that renders the real bundled data.
- Updated the support address in contact rendering/defaults, shared agency data, footer and studio page. Known legacy contact copy is upgraded without replacing custom administrator-written text.

## Automated results

| Check | Result |
|---|---|
| `python scripts/run_evaluation_tests.py` | 73 pytest checks, 37 API checks, 12 client-management checks passed |
| `cd frontend; yarn test --watchAll=false --runInBand` | 20 tests across 7 suites passed |
| `cd frontend; yarn build` | Compiled successfully |
| README relative links and screenshot paths | Checked against the checkout |
| `git diff --check` | Passed |

The backend runner used a randomly named disposable evaluation database. The new contact regression submits all enquiry fields, reads them back through an authenticated admin request, verifies list membership/read status, and checks that unauthenticated reads are rejected. The admin login tests cover successful shared-session navigation and failed-login feedback.

Build output still reports stale Browserslist metadata and Node's `fs.F_OK` deprecation. These are not resolved dependency advisories. A fresh dependency audit and a hosted CI run were not performed for this revision.

## Browser review

Browser automation used Chromium against the production bundle at `localhost:3003`, the API at `127.0.0.1:8002`, and a separate temporary review database seeded only with the repository's public showcase entries. No production data was used.

Final pass: 18 public/demo routes rendered with no uncaught JavaScript errors. No horizontal overflow was detected on those desktop routes or the four mobile routes checked (home, contact, portfolio and about).

See [machine-readable results](showcase-browser.json) for inspected routes, horizontal-overflow checks and JavaScript errors. Desktop review used 1440px width; mobile review used 390px. Screenshots in [../images](../images) are actual browser captures, not generated mockups.

The checked customer journey includes portfolio search, project details, studio attribution, contact submission, stored budget/consent, admin sign-in and inbox rendering. A deliberately aborted submission verifies error feedback and retention of the user's draft.

## Limits and remaining work

- This is a focused source review, route smoke test and enquiry-flow test, not proof that every control on every page works. Every admin permission combination, booking delivery, newsletter delivery, third-party integrations and all nested demo interactions were not exercised in the browser.
- Demo checkouts, reservations and similar sample workflows must not be interpreted as production payments or confirmed business transactions. Existing demo content includes sample metrics and testimonials; it is not evidence of METECHQ client outcomes.
- External portfolio websites are separate codebases. Attribution was added to pages and demos in this repository; those external deployments were not modified.
- Existing administrator-managed content elsewhere may still contain historical marketing claims. Business metrics, delivery promises and external project implementation details require owner verification before publication.
- Live deployment URLs are retained from repository configuration. Production behavior, current hosted CI, external URL availability, deployed security headers, database configuration, email delivery and file persistence remain unverified for this revision.
- Security limitations documented in the README and threat model still apply, including `localStorage` session exposure, unkeyed audit chaining and recorded dependency advisories.

The user subsequently authorized committing and pushing this revision to `mani1715/Metechq`. No manual deployment or production verification was performed; repository-linked deployment automation may run on push.
