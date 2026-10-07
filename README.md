# Mellow Management website

A bilingual, one-page artist site. Danish is the default. Astro generates static pages; React handles the artist browser. Sanity is the editorial CMS. Cloudflare Pages hosts the static site. Review the current build at [mellow-management-website.pages.dev](https://mellow-management-website.pages.dev/).

## Local development

This Fedora workstation uses mise. The project pins Node 24 in `.mise.toml` (npm 11 is currently available). Docker is not needed.

```bash
cd "/home/megawatts/Projects/Mellow Management Website"
mise install
npm install
npm run dev
```

Copy `.env.example` to `.env` and `studio/.env.example` to `studio/.env` for the live Mellow Sanity project. Open `http://localhost:4321`. Without local Sanity configuration the site shows the five approved artists from local seed content. `npm run build` creates `dist/`; `npm run check` checks Astro and TypeScript. The site has no unit-test suite.

## Sanity setup

The [Mellow Management Website project](https://www.sanity.io/manage/project/1yijqk34) uses the public `production` dataset. Its [hosted Studio](https://mellow-management-website.sanity.studio/) lets invited editors publish changes. To edit locally, copy the public project settings:

```bash
cp .env.example .env
cp studio/.env.example studio/.env
```

Do not add credentials to either example file. To run Studio locally:

```bash
npm run studio:dev
```

The five artists and site settings have already been seeded. On a fresh project only, authenticate with `npx sanity login` and run:

```bash
cd studio
npx sanity exec seed.ts --with-user-token
```

The seed only creates missing documents and uploads their images; it never replaces an existing artist or site settings document. Publish changes in Studio. The public build reads published Sanity content. A private Sanity publish webhook now triggers a new Cloudflare Pages build, so edits become visible after the build completes. John can add, hide and reorder artists; edit both languages, achievements, photos, image crops, credits, public profiles and Spotify; and control card-back titles, short text, Read more labels and link visibility. Site settings also manage shared labels/headings, contact details, hero title, logo assets, footer/company information and search/sharing metadata. Privacy content has its own document. These editorial changes need no code changes.

## Contact and artist links

Contact uses direct email and telephone links. Edit the public email and phone in Sanity's site settings. There is no contact form or server-side email integration.

Hero artist cards flip to show Spotify, Instagram and Facebook icons for the configured profiles. Clicking a side card centres it before flipping. Read more closes the card and opens that artist's details. Use **Public social & website profiles** on an artist to manage Instagram, Facebook and other HTTPS links, drag their order, and set visibility on the card and in artist details. Spotify's URL supplies both the icon and the player; **Hero card back** controls its icon visibility. Legacy links are read-only references after migration. Empty optional card titles use the artist name; empty Read more overrides use the shared label.

The artist names list and details panel share the square image height. Both scroll internally when their content exceeds that height, and scrolling at their edges continues through the page. Selecting a name aligns the details panel with the sticky image on desktop. The panels stack on mobile.

The selected artist's Spotify player loads automatically on all screen sizes. No analytics are installed.

## Cloudflare Pages and GitHub

The [public repository](https://github.com/M3G4W4TT5/mellow-management-website) is connected to the separate Mellow Cloudflare account. Pages builds `main` with `npm run build`, outputs `dist`, and uses Node 24 from `.node-version`. Review at the generated `*.pages.dev` address; do not attach `mellowmanagement.com` or change DNS until final delivery.

A restricted `main` deploy hook and Sanity `production` webhook are configured. Sanity changes become live only after the next successful build. Keep deploy hooks and API tokens out of Git and editor fields.

## Publication checklist

- Approved five images and logo are included; provenance and credits are in [ASSET_SOURCES.md](ASSET_SOURCES.md). Confirm the remaining spelling of Rasmus's photographer credit.
- English translations are implementation drafts. Review both languages and time-sensitive achievements before final delivery.
- The Danish and English privacy pages carry the final policy text. They remain excluded from indexing with the rest of the prelaunch preview.
- Before connecting `mellowmanagement.com`, check all contact and artist links and the Sanity publish-to-rebuild flow.
- The site remains blocked from indexing via `public/robots.txt` until launch. Remove that block and the page-level `noindex` when the final domain and content are approved.

The Mellow identity reference is [Michaela Hendrickson's case study](https://michaelahendrickson.com/work/mellow-management-scwpa). Mobile artist browsing follows the direction of [Petra Garmon's Talent page](https://petragarmon.com/en/talent/) using this site's own code and approved assets.

## CMS preview and migrations

Open the **Preview** tab alongside an artist, Site text & contact, or Privacy page. Choose Danish/English and Home/Privacy in the preview toolbar. The Studio fetches drafts with the signed-in editor's own Sanity session and sends normalized content only to the configured website origin. The `/preview/` route starts empty, accepts messages only from the hosted Mellow Studio or local Studio on port 3333, and never receives an API token. Public pages remain static and use only the published perspective. Unpublished changes do not trigger website builds.

Preview defaults to the Pages review site. For local work set `SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:4321` in `studio/.env`. No token belongs in this public environment variable.

Artist photos use Sanity crop/hotspot settings for square browser images and thumbnails, and portrait hero images. An optional separate hero photo can override the shared image. Transparent brand assets preserve their original geometry and transparency. The design-credit image uses Sanity’s image delivery so its pink CSS mask can load across origins. The footer/company fields also feed the privacy controller section, and privacy email annotations use the current contact address.

The content migration has been applied to published documents and existing drafts. It retains old fields, existing editorial edits, and artist visibility. To review or rerun it:

```bash
cd studio
npx sanity exec migrate-content.ts --with-user-token
# After reviewing the dry run:
MELLOW_APPLY_MIGRATION=1 npx sanity exec migrate-content.ts --with-user-token
```

Apply mode makes a private backup under `/tmp/mellow-content-before-<timestamp>.json`, checks revisions, and fills only missing fields. Run the migration after `seed.ts` when bootstrapping this Mellow project. Retired contact text and legacy links remain stored for reference.

Validation: `npm test`, `npm run check`, `npm run studio:check`, `npm run build` and `npm run studio:build`. `npm run sanity:typegen` regenerates the schema and query types; the same generation runs during Studio builds. Publishing, updating or deleting production documents triggers the existing Pages webhook; drafts and release versions are excluded.

Sanity CORS allows the hosted Studio and local Studio to use editor credentials. The Pages review site and local website origins are allowed without credentials for public asset loading. Add the final website origin without credentials when the domain is launched.
