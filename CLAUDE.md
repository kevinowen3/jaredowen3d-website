# Jared Owen Animations Website

Rebuild of [jaredowen3d.com](https://www.jaredowen3d.com/) — moved off Wix to a static site so Jared has more control and flexibility. **Cutover is done: this repo is what serves jaredowen3d.com.** Wix is out of the picture.

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
│   ├── favicon.jpg         JO book/rocket logo, 192px — favicon + apple-touch-icon on all 4 pages (from Wix CDN)
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
- The nav carries five links: Welcome, About, Learn Blender, Support, and **Store**. Store is the only *external* one — it points straight at `https://store.jaredowen3d.com/` (Fourthwall), so it never gets `.active` and it doesn't depend on any host-level redirect
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

## Hosting

Two hosts deploy automatically from `main` (repo: https://github.com/kevinowen3/jaredowen3d-website):

- **Cloudflare** — serves **jaredowen3d.com** (production) *and* **jaredowenanimations.com**, both attached as custom domains on the same `jaredowen3d-website` Worker. No build step: framework preset "None", output directory `/`. Verified 2026-09-09: jaredowen3d.com is on Cloudflare nameservers (`terin`/`millie.ns.cloudflare.com`), resolves to Cloudflare, and returns this repo's markup.
- **GitHub Pages** — preview at **https://kevinowen3.github.io/jaredowen3d-website/** (deploy from `main`, root).

**Finding things in the Cloudflare dashboard.** The login has *two* accounts — `Jared@jaredowen3d.com's Account` and `Kevin@jaredowen3d.com's Account`. Everything lives in **Kevin's**: both zones and the `jaredowen3d-website` Worker. The Worker is a static-assets Worker (no `wrangler.toml` in this repo — it's dashboard-configured, git-connected to `kevinowen3/jaredowen3d-website`, deploy command `npx wrangler deploy`). Two bits of UI that have moved and cost time to find:
- Custom domains are under the Worker's own **Domains** tab, *not* Settings.
- Redirect Rules are under a zone's **Rules → Overview** (as templates plus a Create button), *not* a "Redirect Rules" sidebar entry. Don't use **Page Rules** — legacy, deprecated, capped at 3 on the free plan.

**Cutover off Wix is complete.** jaredowen3d.com's zone moved to Cloudflare with the Zoho mail records intact — MX still `mx`/`mx2`/`mx3.zoho.com` (verified 2026-09-09), so business email is unaffected. Any future change to this zone must keep those MX/SPF/DKIM records or email breaks. jaredowenanimations.com carries no email (verified 2026-08-01: no MX records).

**The site is indexable.** The `_headers` file that sent `X-Robots-Tag: noindex` throughout staging was deleted on 2026-09-09 — there is no longer a `_headers` file, so don't go looking for one. If indexing ever needs suppressing again, recreate it with `/*` + `X-Robots-Tag: noindex` (Cloudflare only; GitHub Pages ignores `_headers` entirely, which is why the kevinowen3.github.io preview was always indexable).

**jaredowen3d.com is the canonical site.** As of 2026-09-09 **jaredowenanimations.com no longer serves the site** — it is a pure 301 onto jaredowen3d.com, preserving path and query string in a single hop. Don't re-add it as a Worker custom domain; that would silently take precedence over the redirect and resurrect the duplicate.

`www.jaredowen3d.com` likewise 301s to the apex (2026-09-09) — the apex is the canonical form, so use bare `jaredowen3d.com` in any link, sitemap or canonical tag. "Always Use HTTPS" is on for the zone, and every entry point (either hostname, either scheme, either domain) reaches the canonical HTTPS apex URL in exactly **one hop** with the query string intact. That single-hop property is worth re-checking after any future redirect change; chains creep in easily.

Two copies of the site are still live and indexable and are *not* covered by either redirect: the GitHub Pages preview and the Worker's own `.workers.dev` URL. See todos.

## Open todos

In rough priority order — none of these are blocking the current state of the site.

- [ ] **Deal with the two remaining duplicate copies of the site.** Neither is covered by the jaredowenanimations.com redirect, and both are publicly indexable:
  - `kevinowen3.github.io/jaredowen3d-website` — GitHub Pages ignores `_headers`, so the staging `noindex` never applied to it either. Switch Pages off now that Cloudflare is production, or add `rel="canonical"` tags.
  - `jaredowen3d-website.kevin-29d.workers.dev` — the Worker's own URL, enabled and marked "Anyone with this URL can visit" (Worker → Domains tab, top of page). Almost certainly safe to toggle off since the custom domains carry all real traffic, but verify before flipping it.
- ✅ ~~**Point jaredowenanimations.com at production with a 301.**~~ Done 2026-09-09 — see decisions log.
- ✅ ~~**Redirect www to the apex.**~~ Done 2026-09-09 — see decisions log.
- ✅ ~~**Turn on "Always Use HTTPS" for the jaredowen3d.com zone.**~~ Done 2026-09-09. **HSTS was deliberately left off** — it instructs browsers to refuse plain HTTP for months and is cached client-side, so a certificate problem can't be undone by flipping the switch back. Revisit only once the zone has a long, uneventful track record.
- [ ] **Audit old Wix URLs.** Any path the Wix site had that this site doesn't will 404 for previously-indexed links and old inbound links. Worth listing them and adding Cloudflare redirects.
- ✅ ~~**Remove the `noindex` header.**~~ Done 2026-09-09 — see decisions log.
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
- **2026-08-01** — **Cloudflare Pages staging decided**: the new site will stage at `jaredowenanimations.com` (previously a Zoho-served 301 redirect to jaredowen3d.com) via Cloudflare Pages connected to the GitHub repo, while Wix keeps serving `jaredowen3d.com`. Domain registration stays at Zoho; only its nameservers move to Cloudflare. Verified the domain has no MX records, so the move can't affect email (which lives on jaredowen3d.com's zone). Added `_headers` with `X-Robots-Tag: noindex` to keep the staging copy out of search engines — Cloudflare-only, remove at launch. GitHub Pages preview stays active in parallel.
- **2026-08-03** — **Staging went live at jaredowenanimations.com.** The Cloudflare zone activated after the nameserver switch, and both `jaredowenanimations.com` and `www.jaredowenanimations.com` were attached as custom domains on the `jaredowen3d-website` Worker (Workers & Pages → Domains tab). Verified: HTTPS 200 on both hostnames, live stats.json, hero video, and the `x-robots-tag: noindex` header. Note: the Worker serves clean URLs — `/about.html` 307-redirects to `/about`. Same day: internal links normalized to clean URLs (`about`, `./`), favicon added (`assets/favicon.jpg`, JO logo from the Wix CDN, linked on all 4 pages), and "Always Use HTTPS" enabled on the zone so `http://` 301s to `https://`. Ops note: Cloudflare's git-connected builds can lag 10–40 min behind a push with no failure shown; check the Deployments tab's "Active deployment" before debugging. GitHub Pages deploys the same commit independently (its checks are named build/deploy — easy to mistake for Cloudflare's).
- **2026-09-09** — **Store tab added** as a fifth nav item on all four pages (desktop `.nav` and `.mobile-nav`), linking directly to `https://store.jaredowen3d.com/` rather than to a local `/store` path. Direct-link was chosen over a `/store` redirect so the tab works identically on every host (jaredowen3d.com, jaredowenanimations.com, and the GitHub Pages preview) with no dashboard configuration. Verified by headless screenshot that five links still fit the centered grid down to 940px — no CSS change was needed.
- **2026-09-09** — **The store is [Fourthwall](https://fourthwall.com/)**, not Shopify (an earlier note in this file guessed Shopify from the Rails-ish response headers — wrong). It is in Fourthwall's pre-launch state: `store.jaredowen3d.com/` 302s to `/password`, which renders a public **"Coming soon" page with a mailing-list signup**. That is what *every* visitor sees, signed in or not — so the new Store tab currently leads to that holding page until Jared publishes the store in Fourthwall.
- **2026-09-09** — **`jaredowen3d.com/store` decided against as a proxy.** A 301 redirect (`/store` → the subdomain) is easy via a Cloudflare Redirect Rule and remains available if wanted; today the path is a plain 404. *Serving* the storefront under a subpath via reverse proxy was rejected — hosted storefronts like Fourthwall emit absolute URLs against their own hostname, scope cart/session cookies to it, and hand checkout off to their own domain, so a proxy looks right until someone tries to buy something.
- **2026-09-09** — **`noindex` removed; the site is now open to search engines.** Deleted `_headers` entirely (its only contents were `/*` + `X-Robots-Tag: noindex`), which had been added for the staging period and outlived it — it was still suppressing indexing of the live jaredowen3d.com. Known side effects, both accepted at the time: jaredowenanimations.com and the GitHub Pages preview serve the same markup and are now equally indexable (no `rel="canonical"` yet), and any URL the old Wix site had that this one lacks now 404s for already-indexed links. Both are tracked in the todos above.
- **2026-09-09** — **jaredowenanimations.com reduced to a 301 onto jaredowen3d.com**, ending the duplicate-site problem for that hostname. A redirect beats `rel="canonical"` here because canonical is only a hint to search engines, whereas a redirect means there genuinely is one site and old links land in the right place. The recipe, in order — the ordering matters:
  1. Worker → **Domains** tab → remove `jaredowenanimations.com` and `www.`. Removing them also deletes the zone's DNS records, so the domain goes dark until step 3. **This step turned out to be unnecessary** — see the www rule below, which proves a zone Redirect Rule fires even while the hostname is still an attached Worker custom domain. It was done here on the assumption that the Worker would win, and it does no harm (the zone is now cleanly redirect-only), but a future redirect of this kind can skip straight to the rule and avoid the downtime.
  2. jaredowenanimations.com zone → DNS → add `AAAA @ → 100::` and `AAAA www → 100::`, both **Proxied**. `100::` is the IPv6 discard prefix; nothing connects to it. The orange cloud is the load-bearing part — grey-clouded, Cloudflare hands the visitor the black-hole address and the redirect never runs. Cloudflare's proxy answers on IPv4 too (an A record is synthesised), so AAAA-only records don't strand IPv4 clients.
  3. Rules → Overview → the **"Redirect to a different domain"** template → match **All incoming requests** (not the template's hostname filter, which would miss `www`), Dynamic, `concat("https://jaredowen3d.com", http.request.uri.path)`, 301, preserve query string.
  Verified end to end: apex, `www`, deep paths, query strings, and plain `http://` all 301 in a **single hop** to the matching path on production, and production itself still answers 200 with zero redirects.
- **2026-09-09** — **`www.jaredowen3d.com` 301s to the apex.** Both had been serving 200 independently, so every page had two live URLs — and the URLs Google carried over from the Wix era are the `www` ones, making this the duplicate that actually mattered. One Redirect Rule on the jaredowen3d.com zone, filter `http.host eq "www.jaredowen3d.com"`, dynamic target `concat("https://jaredowen3d.com", http.request.uri.path)`, 301, preserve query string on. Verified: `www` over HTTPS *and* plain HTTP both reach the matching apex path in a single hop, query strings intact, and the apex itself still answers 200 with zero redirects. `www.jaredowen3d.com` remains attached as a Worker custom domain and the rule fires anyway.

  Two traps, both hit live during setup:
  - **Cloudflare's "Redirect from WWW to root" template self-redirects on plain HTTP.** Its expression is `wildcard_replace(http.request.full_uri, "https://www.*", "https://${1}")`, which only matches `https://`. On an `http://` request `wildcard_replace` returns the input **unchanged**, so the rule redirects the URL to itself — an infinite loop, which is exactly what `http://www.jaredowen3d.com/...` did until the expression was swapped for the `concat` form above. Prefer `concat` + the *Preserve query string* checkbox over anything scheme-dependent.
  - **The template also ships matching "All incoming requests."** On a zone that serves the real site that is dangerous for the same reason: an `http://` apex request would have self-redirected and taken production down. Always scope a www→apex rule with an explicit `http.host` filter.

  Note the *Preserve query string* checkbox is not a free win — it appends the query, so it must be **off** with a `full_uri`-based expression (which already carries it) and **on** with a `uri.path`-based one. Ticking it in the wrong pairing yields `?a=1?a=1`.
- **2026-09-09** — **Verified the Wix cutover is complete** (it had happened in an earlier session and was never written down; exact date unknown). jaredowen3d.com now runs on Cloudflare nameservers and serves this repo. Zoho MX records survived the zone move. The `noindex` header did *not* get removed as part of it — see Hosting.
- **2026-05-06** — **Mobile navigation** added across all four pages. Previously the desktop nav was just hidden at ≤900px, which left mobile users with no way to reach other pages. Now a hamburger button sits next to the YouTube button on mobile and toggles a dropdown menu (`.mobile-nav`) with all four links. The dropdown is a sibling of the row inside `<header class="topbar">`, so it inherits the sticky positioning naturally. Bars animate to an X via CSS; toggle JS is duplicated inline on each page (about/learn-blender/support gained their first `<script>` block). Also added `aria-label="Primary"` to the desktop navs to satisfy the "two `<nav>` landmarks need distinct labels" a11y rule.
