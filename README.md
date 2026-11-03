# Udupi Darshan frontend

Angular 21.2.25 application hosted on Firebase, using the secured Udupi Darshan backend.

## Develop and verify

Use Node.js **24.22.2** from `.nvmrc` (for example, `nvm use`). Then:

```sh
npm ci
npm run verify
```

`verify` runs the complete dependency audit, all Vitest tests and the production build. `npm start` serves the development app at `http://localhost:4200`; its backend URL is `http://localhost:8080`. Configure that local backend to allow `http://localhost:4200` in CORS.

Production builds use `https://udupi-darshan-be.onrender.com`. Firebase deploys `dist/udupi-darshan-fe`; the application builder explicitly keeps the browser output at that path. Public pages use hash routes such as `/#/nature`.

## Release

Work on `release-v1`, push the complete change set and open a PR to `main`. Require the frontend verification workflow to pass. Merging into `main` triggers Firebase deployment using the existing service-account secret. After deployment, verify public pages, destination/story links, search and CORS on the hosted site.

See [VERIFICATION.md](VERIFICATION.md) for current results and release boundaries, and [AUTH_SETUP.md](AUTH_SETUP.md) for authentication behavior. Administrators can publish from the dashboard. The public Write to us form opens an email draft; the visitor sends it from their mail app.

### Browser verification

Run `npm run build`, `npx playwright install chromium`, and `npm run test:e2e`.
The tests serve the production build locally and intercept backend API traffic
with fixtures, including sign-in and admin-role responses. No production account
or email is used. Both PR and Firebase deploy workflows run the Chromium suite
and the PR workflow retains its reports under `test-results/`.

The admin sign-in, dashboard, and new-entry routes load on demand. The initial
production bundle dropped from about 1.00 MB to 958 kB; the build now fails
if it exceeds 1 MB.
