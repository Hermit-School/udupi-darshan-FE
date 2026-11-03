# Frontend authentication

Public browsing remains open. `/#/admindashboard` and `/#/new-entry` require a verified admin session. Backend authorization protects content changes independently of the route guard.

## Sign-in contract

1. POST username/password to `/v1/admin/sign-in`. The backend checks the password and administrator role, then returns a JWT. No email code is required.
2. Check the returned JWT format, issuer, audience, subject and expiration. Confirm current admin access with a bearer-authenticated GET to `/actuator/info` before opening the dashboard.
3. Keep the token in memory and attach it only to protected requests on the configured API. Refreshing requires signing in again.
4. Sign-out clears local state and revokes the token. Expired sessions and current-token authorization failures return the user to sign-in.

Deploy the backend endpoint before this frontend. New admin passwords may use 4–15 ASCII letters, digits or symbols without spaces; existing passwords remain valid. The help page directs users to the site administrator for forgotten passwords. Browser tests use fixtures and never send email.

## Current feature boundary

Admin editors and the public story submission form were unconnected prototypes. Their unavailable status is now explicit, saving controls are disabled, and the public form cannot claim that an unsent story was delivered. Authentication and corrected content-service API routes are implemented; a complete content-management interface is separate work.

## Verification

Use Node 24.22.2 and `npm ci`, then `npm run verify`. Tests use Angular's Vitest/jsdom runner; Chrome and the old Karma entry points are no longer required. `npm run test:auth` runs the focused authentication suite.
