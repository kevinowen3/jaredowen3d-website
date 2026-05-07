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
├── learn-blender.html      Learn Blender — resource cards + "other YouTube channels" grid
├── support.html            Support — Patreon CTA, supporter list, PayPal + YouTube CTAs
├── assets/
│   ├── logo.png            Channel wordmark (teal "JaredOwen Animations") — used by all 4 pages
│   ├── youtube-logo.png    YouTube wordmark — used as nav button on all 4 pages
│   ├── jared-headshot.jpg  Used on about.html
│   ├── hero-loop.mp4       720p H.264, ~3.5 MB, 30s — homepage hero (two-pass, 950 kbps)
│   ├── hero-poster.jpg     Poster fallback for the hero video
│   ├── hero-captions.vtt   Empty WebVTT — satisfies a11y linter for muted decorative video
│   └── hero-descriptions.vtt   Empty WebVTT — same reason
├── stats.json              Live YouTube channel stats — written by the update-stats Action
├── videos.json             Latest 3 long-form videos — written by the update-videos Action
├── .github/
│   ├── workflows/
│   │   ├── update-stats.yml    Cron every 6h at :17 — refreshes stats.json
│   │   └── update-videos.yml   Cron daily at 04:23 UTC — refreshes videos.json
│   └── scripts/
│       ├── fetch-stats.mjs     YouTube Data API channels.list → stats.json
│       └── fetch-videos.mjs    channels → uploads playlist → videos.list (durations) → videos.json, filtering Shorts (≤180s) from a pool of 20
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
- Layout is a **3-column grid** (`1fr auto 1fr`) so the nav sits truly centered between the logo (left) and the YouTube button (right) — replicates the Wix homepage header
- Logo at `3.5rem` height (`2.6rem` on mobile), native colors (NOT filtered to white) — matches Wix
- YouTube button is a sibling of `<nav>`, not inside it — needed so it can occupy its own grid column. CSS selector is `.yt-btn`, not `.nav .yt-btn`
- Right-side YouTube button is the **YouTube wordmark image** in a transparent pill (hover gives a subtle white tint backdrop)
- Active page highlighted with `background: #1f3463;` via `.active` class
- Mobile (`max-width: 900px`): the desktop `.nav` link row is hidden and a hamburger button (`.menu-btn`) appears next to the YouTube button. Tapping it toggles `.is-open` on the topbar, which reveals `.mobile-nav` (a dropdown panel below the row, also rendered into the same `<header class="topbar">`) and animates the three bars into an X via CSS. A small inline script wires the click handler and Escape-to-close. There are now two `<nav>` landmarks per page (`.nav aria-label="Primary"`, `.mobile-nav aria-label="Site navigation"`) — keep both in sync when adding or renaming links

### Inner pages (about / learn-blender / support)

- Same topbar
- A **page-head band** with `--ink` bg, blue `--accent` 4px bottom border, an uppercase blue-tinted `.crumb` label, big bold `<h1>`, and a `.subhead` paragraph
- Content sections alternate `--paper` and `--surface` backgrounds for rhythm

## Conventions

- **Inline CSS/JS per page**, accepting some duplication, until/unless maintenance becomes painful — at which point we extract a shared `styles.css`. We're not there yet.
- **No emojis in markup, copy, or commit messages** unless the user explicitly asks.
- **Hero video must autoplay**: `autoplay muted playsinline loop preload="auto" tabindex="-1" aria-hidden="true"` — plus a small inline JS that calls `.play()` programmatically and falls back to the first user click if autoplay is blocked.
- **A11y warnings are addressed for real**, not suppressed: e.g. opaque dark hover bgs instead of translucent white tints; real `<track>` elements pointing at empty `.vtt` stub files for decorative video.
- **Homepage stats and latest-videos rail are live**, fetched at page load from `stats.json` and `videos.json`. Both files are committed by scheduled GitHub Actions (`update-stats.yml` every 6h, `update-videos.yml` daily). The hardcoded numbers in `index.html` are fallbacks shown only if the fetch fails — keep them roughly current as a reasonable degraded state. The Shorts filter in `fetch-videos.mjs` keys off a 180s duration cap; that's tied to YouTube's current Shorts limit and would need updating if YouTube changes it.

## Local development

The project is served as plain static files. Use **`npx serve .` from the project root** (not from a subfolder — relative paths break). Browse to `http://localhost:3000/`.

Avoid Python's `http.server` for video work — its HTTP Range request support is unreliable, and browsers refuse to stream MP4 without it.

## Hosting target

**GitHub Pages**, on the existing custom domain `jaredowen3d.com`.

Currently live (preview) at **https://kevinowen3.github.io/jaredowen3d-website/** — DNS still points at Wix, so the public `jaredowen3d.com` URL is unchanged. Repo: https://github.com/kevinowen3/jaredowen3d-website.

Cutover plan when ready:
1. ~~Push this repo to GitHub (public).~~ Done.
2. ~~Settings → Pages → deploy from `main`, root folder.~~ Done (enabled via API on 2026-05-04).
3. Add `jaredowen3d.com` as the custom domain in Pages settings.
4. Update DNS at the registrar (currently pointing at Wix) to GitHub Pages' IPs / CNAME.

DNS propagation takes up to 24 hours.

## Open todos

In rough priority order — none of these are blocking the current state of the site.

- [ ] **Contact form** via [Formspree](https://formspree.io/) — useful for press/sponsor inquiries. Free tier: 50 submissions/month.
- [ ] **Get a white-text version of the channel logo** from Jared. The current `logo.png` has a dark "Animations" subtitle that reads poorly on the navy banner.
- [ ] **Newsletter signup** (deferred — Buttondown or ConvertKit when there's an audience to send to).
- [ ] ~~**Social links footer**? The original Wix site had a "Find Jared online" social row.~~ Done 2026-05-06 — see decisions log.

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
- **2026-05-04** — **GitHub Pages enabled** for preview at `kevinowen3.github.io/jaredowen3d-website/`. No DNS change — custom domain field intentionally left blank so Wix keeps serving `jaredowen3d.com` until cutover.
- **2026-05-04** — **Topbar redesigned** to match the Wix homepage header: switched from flex `space-between` to a `1fr auto 1fr` grid so the nav is truly centered, bumped the logo from 2.4rem to 3.5rem, pulled the YouTube button out of `<nav>` so it can live in its own grid column.
- **2026-05-04** — **Learn Blender refresh**: removed the numbered "Recommended starting paths" section (was just restating the four resource cards). Added an "Other YouTube channels I really like" section replicated from Wix — six creators (Blender, Grant Abbitt, Josh Gambrell, Erindale, Curtis Holt, Polyfjord) presented as cards reusing the `.resource-card` pattern with a monospace `@handle` in place of the platform logo. Affiliate disclaimer moved to sit under the resource grid.
- **2026-05-04** — **Homepage stats and latest videos went live** via the YouTube Data API. Two scheduled GitHub Actions (`update-stats.yml` every 6h, `update-videos.yml` daily) fetch from the API, write `stats.json` / `videos.json`, and commit if changed. `index.html` fetches both at load with a cache-busting query string and keeps its hardcoded markup as a fallback if the JSON file is missing or `fetch` fails. The `fetch-videos.mjs` script pulls 20 candidates and filters out anything ≤180s (Shorts) before taking the top 3, since the rail is meant for long-form animations only. API key lives in the repo `YT_API_KEY` secret.
- **2026-05-06** — **Site footer rebuilt** as a navy "Find Jared online" social bar above a copyright line. Replicates the original Wix site's social row. Six platforms — YouTube, Facebook, Instagram, Patreon, X (Twitter), TikTok — each rendered as an inline SVG icon (Simple Icons paths, public domain) inside an `<a>` with an `aria-label`. Icons inherit `fill: currentColor` so the rest/hover color comes from CSS (white on navy → navy on white pill on hover). Per CLAUDE.md guidance, SVGs are inlined rather than added as PNG assets so there are no new image files. Each `<nav>`/`<footer>` block is duplicated across the four pages in keeping with the "inline CSS/JS per page" convention. Linter caveat: do *not* set a rest-state `background: rgba(255,255,255,0.08)` on `.social-links a` — the contrast checker can't model alpha-stacking against the navy footer and will flag it as white-on-white. Hover bg (white) is fine because the link gets `color: var(--ink)` then.
- **2026-05-06** — **PayPal mark in the donate button**: first attempt was an inline SVG of the PayPal "PP" monogram. The simple-icons single-path version rendered as a flat blob; splitting into two paths with the back P at lower opacity helped, but still didn't read as the brand. Final approach: dropped the SVG and replaced the button's plain "Donate with PayPal" text with an italic, weight-800 two-tone wordmark — `Pay` in white, `Pal` in `#66c5f0` (PayPal sky cyan, contrast 6.4:1 against the navy `--paypal` button bg). Reads instantly as the PayPal logo lockup, no asset needed. Markup uses two nested spans so the styling is purely a CSS concern.
- **2026-05-06** — **Mobile navigation** added across all four pages. Previously the desktop nav was just hidden at ≤900px, which left mobile users with no way to reach other pages. Now a hamburger button sits next to the YouTube button on mobile and toggles a dropdown menu (`.mobile-nav`) with all four links. The dropdown is a sibling of the row inside `<header class="topbar">`, so it inherits the sticky positioning naturally. Bars animate to an X via CSS; toggle JS is duplicated inline on each page (about/learn-blender/support gained their first `<script>` block). Also added `aria-label="Primary"` to the desktop navs to satisfy the "two `<nav>` landmarks need distinct labels" a11y rule.
