# Mellow Management website

A bilingual, one-page artist site. Danish is the default. Astro generates static pages; React handles the artist browser. Sanity is the editorial CMS. Cloudflare Pages hosts the site and its contact endpoint. Review the current build at [mellow-management-website.pages.dev](https://mellow-management-website.pages.dev/).

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

## Contact form

The Cloudflare Pages Function is in `functions/api/contact.ts`. It checks fields, verifies Cloudflare Turnstile server-side, and sends one enquiry email through the Cloudflare Email Service REST API. The mail recipient and sender are fixed server-side; visitor input is used only as the email reply-to address and message content.

The deployed Pages project needs these values, set in Cloudflare's environment variable/secret settings:

| Name | Purpose |
| --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public build-time widget key; configure for `*.pages.dev` first. |
| `TURNSTILE_SECRET_KEY` | Secret server-side Turnstile key. |
| `CONTACT_RECIPIENT` | Monitored Mellow inbox. |
| `CONTACT_SENDER` | Verified address on a Cloudflare Email Service sending domain. |
| `CF_EMAIL_ACCOUNT_ID` | Mellow Cloudflare account ID. |
| `CF_EMAIL_API_TOKEN` | Scoped Email Sending token; secret. |

Cloudflare Email Service requires a domain on Cloudflare DNS for sending. The `pages.dev` review address is not a sending domain. The form can be built and exercised locally first, but a real hosted enquiry must be received in the inbox before declaring delivery complete. A dedicated Mellow sending domain or a chosen alternate email service may be used before the website's final domain move.

For local-only form exercise, copy `.dev.vars.example` to `.dev.vars`, retain `CONTACT_DEV_MODE=1`, build, then run `npm run dev:pages`. In that mode, only localhost requests return a mock success; no email is sent. Never set `CONTACT_DEV_MODE` on hosted Pages.

Spotify players load only after a visitor clicks to listen. No analytics are installed.

## Cloudflare Pages and GitHub

The [public repository](https://github.com/M3G4W4TT5/mellow-management-website) is connected to the separate Mellow Cloudflare account. Pages builds `main` with `npm run build`, outputs `dist`, and uses Node 24 from `.node-version`. The `functions/` directory deploys with Pages. Review at the generated `*.pages.dev` address; do not attach `mellowmanagement.com` or change DNS until final delivery.

A restricted `main` deploy hook and Sanity `production` webhook are configured. Sanity changes become live only after the next successful build. Keep deploy hooks and API tokens out of Git and editor fields.

## Publication checklist

- Approved five images and logo are included; provenance and credits are in [ASSET_SOURCES.md](ASSET_SOURCES.md). Confirm the remaining spelling of Rasmus's photographer credit.
- English translations are implementation drafts. Review both languages and time-sensitive achievements before final delivery.
- The privacy pages are clearly marked draft and excluded from indexing. Confirm Mellow's current registered address, mail recipient, retention practice and provider setup with John before removing the draft note and publishing the final policy.
- Verify hosted contact delivery, Turnstile, all links, and the Sanity publish-to-rebuild flow before connecting `mellowmanagement.com`.
- The site remains blocked from indexing via `public/robots.txt` until launch. Remove that block and the page-level `noindex` when the final domain and content are approved.

The Mellow identity reference is [Michaela Hendrickson's case study](https://michaelahendrickson.com/work/mellow-management-scwpa). Mobile artist browsing follows the direction of [Petra Garmon's Talent page](https://petragarmon.com/en/talent/) using this site's own code and approved assets.
