# Jared Owen Animations Website

Static website for [Jared Owen Animations](https://www.youtube.com/@JaredOwen) — clean, modern HTML/CSS rebuild of the original Wix site, designed to be hosted for free on GitHub Pages.

## Pages

- `index.html` — homepage with full-bleed hero video, channel stats, and a featured-videos rail
- `about.html` — Jared's bio, headshot, and press mentions
- `learn-blender.html` — Blender learning resources and recommended starting paths
- `support.html` — Patreon membership, supporter list, and one-time PayPal donations
- `assets/` — logo, hero loop video and poster, headshot, social-icon PNGs

Each page is self-contained: HTML + inline `<style>` + inline `<script>`. No build step, no external dependencies beyond Google Fonts.

## GitHub Pages deployment

1. Create a GitHub repository for the site.
2. Commit these files into the repository root.
3. In **Settings → Pages**, enable GitHub Pages from the `main` branch, root folder.
4. To use `jaredowen3d.com`, add the custom domain under GitHub Pages settings and update the registrar's DNS to point at GitHub Pages.

## Possible next steps

- Auto-pull the latest YouTube videos into the homepage rail via a scheduled GitHub Action (no exposed API keys, fully static).
- Hook up a contact form via [Formspree](https://formspree.io/) for press / sponsor inquiries.
- Add a newsletter signup (Buttondown, ConvertKit) when there's an audience to send to.
- Re-encode `assets/hero-loop.mp4` (~13 MB → ~3 MB) to reduce bandwidth before launch.
