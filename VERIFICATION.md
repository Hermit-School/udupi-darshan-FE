# Frontend verification — November 2, 2026

Branch: `release-v1`. Changes are local and uncommitted; no frontend source was pushed and no Firebase deployment was performed.

## Results

- Clean `npm ci` succeeds using Node 24.22.2 and the committed-format lockfile.
- `npm run verify` succeeds: **65 tests pass** (including 25 authentication tests), full npm audit reports **zero findings**, and the optimized production build succeeds.
- Latest JWT verification: returned tokens require HS256, the expected issuer/audience/subject and a valid expiry; the backend confirms current admin access before the frontend opens a session. Regression tests cover delayed responses after logout, delayed failures from older sessions, and revocation-header preservation.
- Tests cover the password/OTP/token contract, admin guard, expiry/logout, restricted bearer headers, UI authentication failures, real backend content URLs, destination deep links and error handling, story rendering, literal search, delayed search-index loading, mobile menu lifecycle and prevention of false submission success.
- Safari checks against an isolated local backend passed: public destination cards/details, story list/details, populated search and result navigation, unauthenticated dashboard redirection, incorrect password rejection, successful captured-OTP sign-in, dashboard access and logout. The unavailable submission notice also rendered and closed correctly.
- Fresh Safari JWT checks against the current backend Docker image and disposable PostgreSQL/local SMTP passed: unauthenticated dashboard redirection, wrong-password and invalid-OTP errors, correct-OTP dashboard access, and logout. Logout persisted a revocation in the disposable database. Production builds contain the deployed HTTPS backend URL and no fixture credentials.
- No production account or content was created, and no external email was sent. Production admin sign-in remains unverified because no admin account was provisioned.
- Workflow YAML parses, and Firebase's configured public directory contains the generated `index.html` and bundled assets. The production bundle contains the deployed HTTPS backend URL and excludes local preview credentials, fixture code and backend credential names.
- See `verification/frontend-build.json` for artifact checksums and `verification/npm-audit.json` for the point-in-time full dependency report.

## Changes

Updated Angular/UI/Firebase dependencies, Node and TypeScript; migrated the legacy webpack/Karma toolchain to Angular's current application builder and Vitest. Removed unused server-side packages and Angular runtime libraries. Patched transitive gRPC, glob and minimatch dependencies through explicit overrides. All install/build/test/audit commands were verified with those overrides.

Fixed incorrect content-service URLs, story-response assignment, fragile destination fetching, nullable travel directions, search-index loading and literal highlighting. Mobile navigation now has an opener and uses Bootstrap's own close/focus/backdrop lifecycle. Resize callbacks are detached correctly. Analytics loads asynchronously and does not prevent startup in unsupported browsers.

CI uses `.nvmrc`, `npm ci` and the same verification command on release-v1 pushes and PRs. Main merges deploy to Firebase using pinned CLI 15.34.2 and a permission-restricted temporary credential file. No secret JSON is interpolated into shell code. PR verification retains the JUnit report and built site for seven days.

## Limits and release steps

- Public browsing and protected admin authentication are the release scope. Content editing and story submission remain unavailable and are labelled accordingly; those interfaces are not a completed CMS.
- Existing stylesheet budget warnings remain. The initial bundle is about 1.00 MB (roughly 198 KB estimated transfer), slightly above the 1 MB warning threshold and below the configured error limit. Budgets were not raised to hide warnings.
- A zero-match npm audit is a point-in-time dependency check, not a guarantee against every vulnerability.
- Push all frontend changes on `release-v1`, create the PR to `main`, and require CI to pass before merging. Firebase deployment and hosted browser/CORS checks remain after the merge; local results do not certify an undeployed frontend.

Compatibility references: [Angular versions](https://angular.dev/reference/versions), [ng-bootstrap compatibility](https://github.com/ng-bootstrap/ng-bootstrap).
