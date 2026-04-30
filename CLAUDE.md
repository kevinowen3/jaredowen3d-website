# Jared Owen Animations Website

Rebuild of [jaredowen3d.com](https://www.jaredowen3d.com/) — moving from Wix to a static site so Jared has more control and flexibility. The live Wix site is still authoritative until cutover.

The folder lives in a shared Dropbox so Jared can see and contribute as the site evolves. Treat changes as visible to a second collaborator (Jared), not just to Kevin.

## Tech stack

Plain static site. **No build step**, no framework, no package manager.

- Vanilla HTML5 + inline `<style>` + inline `<script>` per page
- Google Fonts: **Inter Tight** (400–900) — loaded via `<link>` in each `<head>`
- That's it — no Tailwind, React, Vue, etc. The site works with the file system as the source of truth.

## File layout

```
.
├── index.html              Welcome — full-bleed hero video, stats, latest videos rail
├── about.html              About — bio, headshot, press mentions
├── learn-blender.html      Learn Blender — resource cards + numbered starting paths
├── support.html            Support — Patreon CTA, supporter list, PayPal + YouTube CTAs
├── assets/
│   ├── logo.png            Channel wordmark (teal "JaredOwen Animations") — used by all 4 pages
│   ├── youtube-logo.png    YouTube wordmark — used as nav button on all 4 pages
│   ├── jared-headshot.jpg  Used on about.html
│   ├── hero-loop.mp4       720p H.264, ~3.5 MB, 30s — homepage hero (two-pass, 950 kbps)
│   ├── hero-poster.jpg     Poster fallback for the hero video
│   ├── hero-captions.vtt   Empty WebVTT — satisfies a11y linter for muted decorative video
│   └── hero-descriptions.vtt   Empty WebVTT — same reason
├── README.md               User-facing project description + deploy steps
└── CLAUDE.md               This file
```

Each HTML page is self-contained: it includes its own `<style>` block and (where needed) its own `<script>` block. There is no shared `styles.css` or `scripts.js` — those existed in the original prototype and were removed during the cleanup pass.

## Design system

The chosen direction (after evaluating four mockups: A Light, B Dark, B2 Light Blue, C Editorial) is **B2 — Light Blue**: full-bleed cinematic hero video, deep navy banner, blue/white throughout.

CSS custom properties (consistent across all four pages):

```css
--paper:        #ffffff;   /* page bg */
--surface:      #f7fbff;   /* alt section bg */
--ink:          #0e1e3f;   /* deep navy — also banner bg */
--ink-soft:     #4b587a;   /* secondary text */
--line:         #e6ebf2;   /* hairline borders */
--accent:       #2758c4;   /* brand blue (links, primary buttons, etc.) */
--accent-hover: #1d4aa8;
--accent-soft:  #eaf0fc;   /* tinted backgrounds */
```

Brand-specific accent colors (only on support.html):
- `--patreon: #ff424d`
- `--paypal:  #003087`

### Hero treatment (homepage only)

- Video plays at **100% opacity** — never fade the video itself.
- Subtle bottom-vignette gradient `linear-gradient(180deg, transparent 35%, rgba(10, 22, 50, 0.55))` darkens *only the lower band* so white headline text stays readable. This was a deliberate concession to readability while honoring "no opacity on the background video."
- Headline is white text overlaid directly on the video (no card). The accent in the headline is a lighter sky blue (`#8fb6ff`), not the brand `--accent`, because the deeper blue disappears against bright video frames.
- Eyebrow chip has a translucent dark pill backdrop for the same reason.

### Topbar (all four pages)

- Navy `--ink` background, white text, sticky
- Logo at `2.4rem` height, native colors (NOT filtered to white) — matches Wix
- Right-side YouTube button is the **YouTube wordmark image** in a transparent pill (hover gives a subtle white tint backdrop)
- Active page highlighted with `background: #1f3463;` via `.active` class
- Mobile (`max-width: 900px`): nav links hide; only the YouTube button remains

### Inner pages (about / learn-blender / support)

- Same topbar
- A **page-head band** with `--ink` bg, blue `--accent` 4px bottom border, an uppercase blue-tinted `.crumb` label, big bold `<h1>`, and a `.subhead` paragraph
- Content sections alternate `--paper` and `--surface` backgrounds for rhythm

## Conventions

- **Inline CSS/JS per page**, accepting some duplication, until/unless maintenance becomes painful — at which point we extract a shared `styles.css`. We're not there yet.
- **No emojis in markup, copy, or commit messages** unless the user explicitly asks.
- **Hero video must autoplay**: `autoplay muted playsinline loop preload="auto" tabindex="-1" aria-hidden="true"` — plus a small inline JS that calls `.play()` programmatically and falls back to the first user click if autoplay is blocked.
- **A11y warnings are addressed for real**, not suppressed: e.g. opaque dark hover bgs instead of translucent white tints; real `<track>` elements pointing at empty `.vtt` stub files for decorative video.
- **Stats in homepage are placeholders** (1.4M subs / 200M views / 80+ animations / 8 yrs). Replace with real numbers before launch.

## Local development

The project is served as plain static files. Use **`npx serve .` from the project root** (not from a subfolder — relative paths break). Browse to `http://localhost:3000/`.

Avoid Python's `http.server` for video work — its HTTP Range request support is unreliable, and browsers refuse to stream MP4 without it.

## Hosting target

**GitHub Pages**, on the existing custom domain `jaredowen3d.com`.

Cutover plan when ready:
1. Push this repo to GitHub (public).
2. Settings → Pages → deploy from `main`, root folder.
3. Add `jaredowen3d.com` as the custom domain in Pages settings.
4. Update DNS at the registrar (currently pointing at Wix) to GitHub Pages' IPs / CNAME.

DNS propagation takes up to 24 hours.

## Open todos

In rough priority order — none of these are blocking the current state of the site.

- [ ] **Contact form** via [Formspree](https://formspree.io/) — useful for press/sponsor inquiries. Free tier: 50 submissions/month.
- [ ] **Get a white-text version of the channel logo** from Jared. The current `logo.png` has a dark "Animations" subtitle that reads poorly on the navy banner.
- [ ] **Newsletter signup** (deferred — Buttondown or ConvertKit when there's an audience to send to).
- [ ] **Social links footer**? The original Wix site had a "Find Jared online" social row. Icons were removed during cleanup but are recoverable from initial commit `6587809`. Inline SVG icons would be a better long-term choice than PNGs.

## Brief log of decisions

- **2026-04-27** — Starting point: an HTML/CSS prototype scaffolded by a previous session, with assets already downloaded from the Wix site.
- **Hosting** picked: GitHub Pages.
- **Visual direction** picked: Mockup B2 (cinematic hero video + blue/white theme + navy banner).
- **Headline copy** finalized: "I create / 3D Animations / that explain how things work" with "3D Animations" as the blue accent.
- **Lede copy** finalized: "Bridges, buildings, engines, telescopes, spacecraft and more — Jared turns complex objects into clear, beautiful 3D video animations using Blender."
- **Logo treatment** decided: native colors on navy banner (not white-filtered), matching the Wix site's approach.
- **Promoted from `mockups/` to root** as the real `index.html`/`about.html` once direction was firm; original prototype `learn-blender.html` and `support.html` rebuilt in the same B2 style.
- **Cleanup pass**: removed `mockups/`, `styles.css`, `scripts.js`, 6 social-icon PNGs, 2 PayPal logos. All recoverable from initial commit `6587809` if needed.
- **2026-04-29** — **Hero video re-encoded**: 1080p / 13.7 MB → 720p / 3.6 MB (74% smaller). Two-pass H.264 at 950 kbps target, lanczos downscale, faststart. Original recoverable from git history.
