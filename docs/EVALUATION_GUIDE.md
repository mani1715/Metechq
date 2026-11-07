# Evaluation guide

Prepared 2026-11-07. This is an evidence map for the supplied 100-mark rubric, not a claimed score. Deployment is reserved for the final stage.

## 1. Rubric and evidence

| Area | Marks | Review evidence |
| --- | ---: | --- |
| Security | 35 | `THREATS.md`; token realms, ownership checks, permission dependencies, uploads, URL validation, sanitization and deployment headers |
| Threat analysis and testing | 15 | Threat register; isolated runner; regression tests and saved verification reports |
| Functionality | 15 | Public portfolio with search/filter/details/deployed links; admin editing; client project information, milestones/tasks, files and communication |
| AI usage and prompt documentation | 15 | `PROMPTS.md`: dated paraphrased requests, changes, validation and limitations; explain AI suggestions you accepted and corrected |
| Engineering quality | 10 | Shared API/services, URL/image handling, explicit loading/error/empty states, bounded API pagination, reproducible tests |
| Documentation, deployment and demo | 10 | README, this guide, portfolio/client guide, verification reports; hosted release checks remain pending |
| Total | 100 | Assessor determines marks based on the delivered evidence |

## 2. Suggested demo (7 minutes)

1. Public homepage and mobile menu: explain mocha/champagne/amber design and visible client portal entry.
2. Our work: search/filter, open a case study, show a real screenshot and deployed website. Label seeded demo projects honestly.
3. Admin: create or edit a project with its actual screenshot, stack and deployed HTTPS link; show it appears publicly. Demonstrate private visibility separately.
4. Client workflow: create a dedicated demonstration client, assign a project, add milestones/tasks/files, then sign in as that client in a separate browser profile. Show assigned information and communication.
5. Security: explain why a client token cannot call admin APIs and why another client's project ID is denied. Show isolated test reports instead of attacking real customer data.
6. Explain one repaired defect: missing project API connection, token realm confusion, missing upload Path import, or misleading error-as-empty UI. Show the regression test where available.
7. Open PROMPTS.md and THREATS.md; acknowledge remaining dependency/hosting work. Explain your implementation choices in your own words.

## 3. Before the assessment

Replace demonstration project records with your actual work, verify all deployed links and images, remove unverifiable metrics/testimonials, prepare non-sensitive demonstration accounts and sample files, and run the commands in THREATS.md. Never put credentials in slides, git, screenshots or public documentation.

## 4. Deployment comes last

Choose host/database/storage; provision secrets outside source control; configure exact frontend/API origins and HTTPS; configure production CSP and SPA fallback; ensure uploads persist privately; configure backups and restore checks; resolve dependency findings; smoke-test authentication, client isolation, uploads/downloads, deployed links and mobile layout on staging. Only then publish. No deployment was performed in this revision.
