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

The Cloudflare Pages Function is in `functions/api/contact.ts`. It checks fields, verifies Cloudflare Turnstile server-side, and sends accepted enquiries through Resend's Email API. The preview form is enabled (`PUBLIC_CONTACT_FORM_READY=1`). A hosted enquiry was delivered to `mellow-temp@memoryone.eu` on 28 September 2026. The public email link also remains available.

The deployed Pages project needs these values, set in Cloudflare's environment variable/secret settings:

| Name | Purpose |
| --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public build-time widget key; the current widget allows the Pages preview hostname. |
| `PUBLIC_CONTACT_FORM_READY` | Public build-time switch. Currently `1` on the Pages preview after hosted delivery was confirmed. |
| `TURNSTILE_SECRET_KEY` | Secret server-side Turnstile key. |
| `CONTACT_RECIPIENT` | Monitored Mellow inbox. |
| `CONTACT_SENDER` | Currently `Mellow Management <onboarding@resend.dev>` for preview delivery to the Resend account owner's address only. Replace with a verified Mellow sender before routing to John's mailbox. |
| `RESEND_API_KEY` | Resend sending API key; encrypted Cloudflare Pages secret. |

Resend Free currently allows 3,000 emails per month and 100 per day. The temporary Resend test sender can deliver to its account owner, `mellow-temp@memoryone.eu`; it cannot serve as the final sender to an arbitrary mailbox. The `pages.dev` address is only the website preview hostname. On 28 September 2026, the hosted form showed success, Resend marked the matching message Delivered, and the user confirmed receipt in the temporary inbox. The temporary recipient and sending-only API key are encrypted Cloudflare Pages secrets, outside Git. At handoff, verify a Mellow-owned sending domain, change `CONTACT_SENDER` and `CONTACT_RECIPIENT` for John's confirmed mailbox, then test delivery and reply-to again. Arrange his Resend access/ownership without sharing credentials.

For local-only form exercise, copy `.dev.vars.example` to `.dev.vars`, retain `CONTACT_DEV_MODE=1`, build, then run `npm run dev:pages`. In that mode, only localhost requests return a mock success; no email is sent. Never set `CONTACT_DEV_MODE` on hosted Pages.

The selected artist's Spotify player loads automatically on all screen sizes. No analytics are installed.

## Cloudflare Pages and GitHub

The [public repository](https://github.com/M3G4W4TT5/mellow-management-website) is connected to the separate Mellow Cloudflare account. Pages builds `main` with `npm run build`, outputs `dist`, and uses Node 24 from `.node-version`. The `functions/` directory deploys with Pages. Review at the generated `*.pages.dev` address; do not attach `mellowmanagement.com` or change DNS until final delivery.

A restricted `main` deploy hook and Sanity `production` webhook are configured. Sanity changes become live only after the next successful build. Keep deploy hooks and API tokens out of Git and editor fields.

## Publication checklist

- Approved five images and logo are included; provenance and credits are in [ASSET_SOURCES.md](ASSET_SOURCES.md). Confirm the remaining spelling of Rasmus's photographer credit.
- English translations are implementation drafts. Review both languages and time-sensitive achievements before final delivery.
- The Danish and English privacy pages carry the final policy text. They remain excluded from indexing with the rest of the prelaunch preview.
- Before connecting `mellowmanagement.com`, verify the final Resend sending domain and John's recipient mailbox, and retest delivery and reply-to. Check all links and the Sanity publish-to-rebuild flow.
- The site remains blocked from indexing via `public/robots.txt` until launch. Remove that block and the page-level `noindex` when the final domain and content are approved.

The Mellow identity reference is [Michaela Hendrickson's case study](https://michaelahendrickson.com/work/mellow-management-scwpa). Mobile artist browsing follows the direction of [Petra Garmon's Talent page](https://petragarmon.com/en/talent/) using this site's own code and approved assets.
