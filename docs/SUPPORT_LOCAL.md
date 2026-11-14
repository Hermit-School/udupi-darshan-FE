# Support local advertisements

The public listing, business detail and enquiry dialog follow the supplied Support local prototype. The user's explicit desktop rules replace the prototype's original column proportions:

| Main image width | Desktop share | Cards across |
| --- | --- | --- |
| Above 1600 px | 6/12 | 2 |
| 1200–1600 px | 4/12 | 3 |
| 800–1199 px | 3/12 | 4 |
| Below 800 px | 2/12 | 6 |

`src/app/content/ad-tiers.ts` is the shared tier configuration. Original upload dimensions determine the tier even after backend resizing. Legacy images without metadata are measured on load. Images are contained, not cropped; small images are not deliberately enlarged. Tablet/phone layouts reflow to readable columns. Desktop Showcase cards use half the viewport height with a 320px readability minimum; phone Showcase cards follow the prototype's 520px height.

The Website field takes priority. Without a valid website, cards link to `/advertisements/<slug>` using the site's existing hash routing. Internal business pages work on reload and include the saved gallery, About text, offerings and contact fields. Missing fields are omitted. About markup uses Angular sanitization. Invalid paths are not turned into arbitrary routes.

Admins can edit a tagline, category, phone, address, hours, map URL, backdrop and offerings, plus up to five photos. The first photo drives sizing. Existing upload validation, retries and content permissions remain in place. Prices are enquiry-only; no fictional businesses or rates are published. Homepage sponsor cards keep their existing curated format.

Inter is self-hosted in assets/fonts with its SIL Open Font License. No CSP relaxation or runtime third-party font request is required. Deploy backend V16 before merging/deploying this frontend.


## Manual layout replaces image-width classification

The current layout uses administrator choices: Large = 12/12, Medium = 6/12, Small = 4/12, Extra-small = 3/12. Image width/height only describe the media. Existing/new advertisements default to Small. Use Dashboard → Edit advertisement layout (`/admindashboard/advertisements`) to drag into order, change sizes and Save layout. Move up/down buttons support keyboard and touch. The public grid preserves the saved order, uses two columns on tablets and stacks on phones. Save publishes immediately; reload detects concurrent edits via a revision. Failed saves keep local work. V17 backend must deploy first. This section supersedes the original width-based sizing description above.
