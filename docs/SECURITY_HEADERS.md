# Frontend security headers

Firebase Hosting applies the catch-all `firebase.json` header rule to every path. Existing HTML revalidation and fingerprinted-asset cache rules remain in place. Firebase already supplies HSTS on its default domains; the application does not override it.

The enforced Content-Security-Policy blocks inline scripts, inline event handlers, eval, plugins, workers, frames, and embedding by other pages. Scripts may come only from the site and the existing Google Analytics loader at www.googletagmanager.com. Connections are limited to the site, the production backend, Firebase app configuration and installations, and the existing Google Analytics endpoints. HTTPS images plus data/blob image previews are retained for managed content. Fonts are local. Forms and the base URL are restricted to the site.

Angular inserts runtime styles and the application uses dynamic style bindings, so `style-src` retains `unsafe-inline`. This allowance does not apply to scripts. Production critical-CSS inlining is disabled to avoid its generated inline onload handler; minification and optimized scripts remain enabled. There is no static/shared CSP nonce.

Additional headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, and Permissions-Policy disabling camera, microphone, geolocation, payment, and USB. Map links, image uploads, and email recovery do not require those browser permissions. HSTS remains managed by Firebase.

## Verification and rollout

`npm run verify` checks dependencies, unit tests, and the production build. `npm run test:e2e` serves the built site with the exact catch-all Firebase headers. Existing browser flows assert no CSP violations; dedicated tests check headers across assets, block inline/eval/external script injection and unapproved connections, and reject framing of the admin portal. Tests use existing mocked API fixtures rather than production writes.

Merge the frontend PR to deploy through the existing Firebase workflow; no backend change or credentials are needed. After deployment, inspect headers on `/`, `/index.html`, a current JS asset and an image, and check public browsing and the admin/help forms. Source CI cannot certify live Firebase headers before that deployment.

References: [Firebase Hosting headers](https://firebase.google.com/docs/hosting/full-config#headers), [Angular CSP guidance](https://angular.dev/best-practices/security#content-security-policy), [Google Analytics CSP](https://developers.google.com/tag-platform/security/guides/csp).
