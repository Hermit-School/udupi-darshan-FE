# Editing records, Events and loading states

The dashboard keeps its existing Add cards and adds a matching **Edit existing records** section. Each edit card opens a searchable, paginated list, then the existing form with saved values filled in. Saving updates the existing record ID with one multipart request. Loading failures block saving an empty form. Original images, related places, legacy section labels and story publication state are retained unless edited. Story contact emails are loaded through the protected admin endpoint and remain absent from public responses.

The story editor manages published records; visitor submissions still use the existing review workspace. Nature, Culture, Food and Stories now offer Delete in both the record list and loaded edit form. A named confirmation dialog explains that deletion is permanent; cancel performs no request. Failed/uncertain requests keep the dialog open for retry, and successful deletion updates the list or returns the editor to it. The backend removes legacy uploaded story-photo rows in the same transaction as the story.

## Public Events

Visitors can open Events from desktop/mobile navigation or the footer, browse upcoming and past events, and open details with dates, location, photos, description and visitor information. Dates are grouped using Udupi's calendar date. Undated announcements remain in the upcoming group. Empty and failed requests have clear messages and retry controls. Event reads time out after 20 seconds so loading can recover from a stalled request.

Admins use Add Events / Edit Events cards to maintain content. Events reuse the existing V5 schema, which was preserved during the rollback; no previously applied migration is modified. Up to five photos can be uploaded as JPEG/PNG files. Uploaded files are limited to 5 MiB and 20 megapixels, decoded and re-encoded on the server. The 26 MiB multipart request budget accommodates five maximum-size files. Metadata, uploads and removals commit together. A save key and transaction lock make retries safe without creating duplicate records. An uncertain response keeps the selection fixed until the same save is retried.

Admins can mark an Event as trending. Its existing `featured` field controls a labelled fire badge on the public card and detail page; completed events never show the badge. This is an editorial selection rather than an analytics calculation. Official event posters are contained within cards so titles and dates are not cropped.

## Loading experience

The branded indicator covers the initial empty page, then uses a compact card once page content is available. It has no pointer interception. It appears after 180 ms to avoid flashing on fast requests and disappears as soon as all foreground requests/lazy route downloads finish. No artificial minimum wait is added. Background search-index requests retain their existing behavior. OS reduced-motion preferences disable the loading animations. Concurrent requests, errors, remounts and short requests have lifecycle regression tests.

## Backend endpoints

- Add/Edit forms use admin multipart `POST /v1/admin/content/{kind}` and `POST /v1/admin/content/{kind}/{id}`. Kinds are `nature`, `culture`, `food`, `story`, `ads`, `events`. Fields: `data` (JSON), `requestKey` (UUID), and `file_<UUID>` for each new image referenced by `upload:<UUID>` in the JSON. Existing image URLs can only be retained from the record being edited.
- `GET /v1/blogs/admin/content/{id}` supplies protected story edit data, including private contact email.
- `GET /v1/ads/{id}` reads a public ad; `PUT /v1/ads/{id}` updates it with admin authorization.
- Events use `GET/POST /v1/events`, `GET/PUT /v1/events/{id}`, and admin multipart `POST /v1/events/{id}/photos` with `uploadKey` and repeated `files`.

## Image management

All Add/Edit forms show previews with upload and remove controls; gallery records also support choosing the main photo. Related-place images use the same picker. Ads require one image, Events allow five, and other galleries allow twenty. Each save accepts up to five new files across the whole form. Removals apply only when Save succeeds; leaving without saving retains the stored record. External/static images are detached from the record, while unused managed image bytes are deleted. Story publication state is preserved.

The backend adds V7 tables for managed media, retry receipts and a transaction guard. `GET /v1/media/{id}` serves sanitized JPEG bytes only while a public record references them. Images on unpublished stories remain private. Existing JSON and Event upload endpoints remain compatible with older clients.

Deploy the backend before merging/deploying the frontend. These changes are limited to editing, Events and loading; the homepage, analytics, sponsored placements and ad-size controls are unchanged. PR merging remains with the user unless explicitly authorized for this work.
