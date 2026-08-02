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

- **Cloudflare Pages** (staging domain): serves **jaredowenanimations.com**. Connected to this repo; every push to `main` deploys in under a minute. No build step — framework preset "None", output directory `/`. The `_headers` file sends `X-Robots-Tag: noindex` so the staging site stays out of search engines until launch (Cloudflare-only; GitHub Pages ignores it).
- **GitHub Pages** (preview): serves [kevinowen3.github.io/jaredowen3d-website](https://kevinowen3.github.io/jaredowen3d-website/) from the `main` branch, root folder.

The old Wix site remains live at **jaredowen3d.com** (with Zoho email on that domain) until final cutover.

### Making an update

1. Edit files locally; preview with `npx serve .` from the project root → http://localhost:3000
2. `git add` / `git commit` / `git push`
3. Watch the deployment in Cloudflare (Workers & Pages → project → Deployments), then refresh jaredowenanimations.com

Channel stats (`stats.json`) and latest videos (`videos.json`) are refreshed by scheduled GitHub Actions, which commit to `main` and therefore also redeploy the site automatically.

## Possible next steps

- Hook up a contact form via [Formspree](https://formspree.io/) for press / sponsor inquiries.
- Add a newsletter signup (Buttondown, ConvertKit) when there's an audience to send to.
- Final cutover: move `jaredowen3d.com` off Wix (carefully preserving Zoho MX/SPF/DKIM records) and remove the `noindex` header.
