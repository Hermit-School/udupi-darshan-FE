# Frontend authentication

Public browsing remains open. `/#/admindashboard` and `/#/new-entry` require a verified admin session. Backend authorization protects content changes independently of the route guard.

## Sign-in contract

1. POST username/password to `/v1/login`; the returned account must have admin permission.
2. POST the same credentials to `/v1/generateOTP`. The password is cleared from the form. OTP delivery uses the email on the backend account.
3. POST `{username, otp}` to `/v1/verifyOTP`. Check that the returned JWT uses HS256, issuer `udupi-darshan`, audience `udupi-darshan-api`, the pending username and a future expiry. Confirm current admin access with a bearer-authenticated GET to `/actuator/info` before storing the session or navigating. The backend performs signature, revocation, active-account and role checks; browser decoding is only a response sanity check.
4. Keep the token in memory. Attach it only to protected requests on the configured API. Public GETs (including health), assets and other hosts never receive it. Refreshing the page requires signing in again.
5. Logout clears local state immediately and requests `/v1/jwt/revoke`. A protected API 401 for the current token clears the session; expiry redirects protected pages to sign-in. Late OTP/access responses cannot restore a signed-out session, and a delayed 401 for an older token cannot clear a newer session. Explicit revocation headers retain the token being revoked.

Wrong passwords, invalid/expired OTPs, rate limits, insufficient permissions, mail failure and network errors never report a successful sign-in. The forgot-password page provides guidance; no password-reset or public account-creation endpoint exists.

## Production and test accounts

The secured backend is deployed. Render allows the frontend origin `https://udupi-darshan.web.app`. Production has no admin account provisioned by this work. Provision one privately with the backend's documented command only when admin access is needed; never send its password in chat or put credentials in Angular environment files.

Safari sign-in verification used an isolated local Spring Boot backend, disposable H2 data and a captured mail sender. It verified wrong-password rejection, OTP entry, protected-dashboard access and logout. The fixture and its disposable credentials are outside this repository and are excluded from production bundles. No production user was created and no external email was sent by these frontend tests.

## Current feature boundary

Admin editors and the public story submission form were unconnected prototypes. Their unavailable status is now explicit, saving controls are disabled, and the public form cannot claim that an unsent story was delivered. Authentication and corrected content-service API routes are implemented; a complete content-management interface is separate work.

## Verification

Use Node 24.22.2 and `npm ci`, then `npm run verify`. Tests use Angular's Vitest/jsdom runner; Chrome and the old Karma entry points are no longer required. `npm run test:auth` runs the focused authentication suite.
