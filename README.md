# Jared Owen Animations Website

Static website for [Jared Owen Animations](https://www.youtube.com/@JaredOwen) — clean, modern HTML/CSS rebuild of the original Wix site.

## Pages

- `index.html` — homepage with full-bleed hero video, channel stats, and a featured-videos rail
- `about.html` — Jared's bio, headshot, and press mentions
- `learn-blender.html` — Blender learning resources and recommended YouTube channels
- `support.html` — Patreon membership, supporter list, and one-time PayPal donations
- `assets/` — logo, hero loop video and poster, headshot

Each page is self-contained: HTML + inline `<style>` + inline `<script>`. No build step, no external dependencies beyond Google Fonts.

## Hosting and deployment

The site deploys automatically from this repository — push to `main` and both hosts update:

- **Cloudflare** (production): serves **jaredowen3d.com** and **jaredowenanimations.com** from the same Worker. Connected to this repo; every push to `main` deploys in under a minute. No build step — framework preset "None", output directory `/`.
- **GitHub Pages** (preview): serves [kevinowen3.github.io/jaredowen3d-website](https://kevinowen3.github.io/jaredowen3d-website/) from the `main` branch, root folder.

The move off Wix is complete — **jaredowen3d.com is this site**, with the Zoho email records carried over intact.

Search indexing is on. The `X-Robots-Tag: noindex` header used during staging was removed on 2026-09-09, so the site is now open to Google.

### Making an update

1. Edit files locally; preview with `npx serve .` from the project root → http://localhost:3000
2. `git add` / `git commit` / `git push`
3. Watch the deployment in Cloudflare (Workers & Pages → project → Deployments), then refresh jaredowen3d.com

Channel stats (`stats.json`) and latest videos (`videos.json`) are refreshed by scheduled GitHub Actions, which commit to `main` and therefore also redeploy the site automatically.

## Possible next steps

- Hook up a contact form via [Formspree](https://formspree.io/) for press / sponsor inquiries.
- Add a newsletter signup (Buttondown, ConvertKit) when there's an audience to send to.
- Redirect `jaredowenanimations.com` to `jaredowen3d.com` with a 301, so there is only one real site.
- Decide what to do with the GitHub Pages preview, which serves a third copy of the same pages.
- Check whether any old Wix URLs now 404, and add redirects for them.
