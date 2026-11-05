# Editing records, Events and loading states

The dashboard keeps its existing Add cards and adds a matching **Edit existing records** section. Each edit card opens a searchable, paginated list, then the existing form with saved values filled in. Saving uses PUT to the existing record ID. Loading failures block saving an empty form. Original images, related places, legacy section labels and story publication state are retained unless edited. Story contact emails are loaded through the protected admin endpoint and remain absent from public responses.

The story editor manages published records; visitor submissions still use the existing review workspace. No delete action is added to the dashboard.

## Public Events

Visitors can open Events from desktop/mobile navigation or the footer, browse upcoming and past events, and open details with dates, location, photos, description and visitor information. Dates are grouped using Udupi's calendar date. Undated announcements remain in the upcoming group. Empty and failed requests have clear messages and retry controls. Event reads time out after 20 seconds so loading can recover from a stalled request.

Admins use Add Events / Edit Events cards to maintain content. Events reuse the existing V5 schema, which was preserved during the rollback; no previously applied migration is modified. Up to five photos can be supplied as URLs or uploaded JPEG/PNG files. Uploaded files are limited to 5 MiB and 20 megapixels, decoded and re-encoded on the server. The 26 MiB multipart request budget accommodates five maximum-size files. Upload keys and a row lock protect retries and the five-photo limit. If photo upload fails after the Event is saved, retry uses the same record and upload key.

## Loading experience

The branded indicator covers the initial empty page, then uses a compact card once page content is available. It has no pointer interception. It appears after 180 ms to avoid flashing on fast requests and disappears as soon as all foreground requests/lazy route downloads finish. No artificial minimum wait is added. Background search-index requests retain their existing behavior. OS reduced-motion preferences disable the loading animations. Concurrent requests, errors, remounts and short requests have lifecycle regression tests.

## Backend endpoints

- Existing Nature/Culture/Food update endpoints are reused.
- `GET /v1/blogs/admin/content/{id}` supplies protected story edit data, including private contact email.
- `GET /v1/ads/{id}` reads a public ad; `PUT /v1/ads/{id}` updates it with admin authorization.
- Events use `GET/POST /v1/events`, `GET/PUT /v1/events/{id}`, and admin multipart `POST /v1/events/{id}/photos` with `uploadKey` and repeated `files`.

Deploy the backend before merging/deploying the frontend. These changes are limited to editing, Events and loading; the homepage, analytics, sponsored placements and ad-size controls are unchanged. PR merging remains with the user unless explicitly authorized for this work.
