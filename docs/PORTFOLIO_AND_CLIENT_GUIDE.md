# Portfolio and client portal operating guide

## Add your real portfolio projects

1. Sign in with your existing administrator account at `/admin/login`, then open Portfolio management.
2. Enter the real title, category, concise problem/solution description and technologies. Add your role and evidence in the case-study text where supported.
3. Set the cover image and gallery URLs to screenshots belonging to this project. Use publicly reachable HTTPS image URLs. Missing/broken images display an explicit fallback, not an unrelated invented preview.
4. Enter the deployed website URL and optional source-code URL. External websites open separately; internal `/demo/` links are demonstration projects.
5. Choose featured for homepage selection. Keep confidential projects private. Save and verify the public listing and detail page in a signed-out browser.
6. Repeat for all projects. API requests use bounded batches, and the frontend aggregates beyond 100 records. Search/filter assists navigation. Concurrent changes while paging can require a refresh.

The five records already in the local database are existing sample/demo records. They are not proof of your real deployments. Your real screenshots and URLs were not supplied; add those before submitting. Do not invent client results, usage numbers or testimonials.

## Manage client work

1. In admin client management, create a client and provide credentials through a private channel. Do not reuse an administrator password.
2. In client projects, assign the correct client and maintain the project status, description, progress, milestones, tasks and relevant financial information.
3. Attach approved project files, then use project comments/chat for delivery updates. Verify the selected recipient/project before sharing confidential material.
4. The client enters through the visible Client portal link and signs in at `/client/login`. They see assigned projects and the available detail tabs. Refresh keeps the selected project when it still exists; connection errors have a retry action.
5. Test with two dedicated demonstration clients: each must see only their own assigned project. Existing automated API tests exercise this boundary without changing your real records.
6. Deactivate clients who no longer need access. Treat downloaded copies as outside the application's control.

## Content and troubleshooting

If projects fail to load, check the API process and frontend backend URL; do not interpret connection failure as an empty portfolio. Local frontend preview uses port 3001 and the API port 8002; CORS must allow the exact frontend origin. Restart the API after backend code changes. Never copy local development origins or credentials blindly into production.
