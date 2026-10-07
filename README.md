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

The seed only creates missing documents and uploads their images; it never replaces an existing artist or site settings document. Publish changes in Studio. The public build reads published Sanity content. A private Sanity publish webhook now triggers a new Cloudflare Pages build, so edits become visible after the build completes. John can add an artist, hide one, reorder them, and change both language fields, achievements, images, social links and Spotify profile from Studio. The website does not need a code change for those actions.

## Contact and artist links

Contact uses direct email and telephone links. Edit the public email and phone in Sanity's site settings. There is no contact form or server-side email integration.

Hero artist cards flip to show Spotify, Instagram and Facebook icons for the configured profiles. Clicking a side card centres it before flipping. Read more closes the card and opens that artist's details. Add social URLs in the artist's existing links field in Sanity; the icon is selected from the URL's hostname.

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
