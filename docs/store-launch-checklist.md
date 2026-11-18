# Store launch checklist

Go-live plan for the Fourthwall store at `store.jaredowen3d.com`. Written 2026-10-12; launch planned for 2026-10-13 with Jared and a teammate.

Tick items with ✅ as they are done. Everything here lives in the Fourthwall dashboard. Nothing in this repo needs to change: the Store tab on jaredowen3d.com already points at `https://store.jaredowen3d.com/`.

## Already done

- ✅ Payments. Payouts go to the business bank account via Stripe Connect (single-member LLC). Stripe's review page confirmed 2026-10-12 with nothing pending. Customer payment methods (cards, Apple Pay, Google Pay, PayPal) are on by default and need no setup.
- ✅ Custom domain. `store.jaredowen3d.com` answers over HTTPS with a valid certificate (checked 2026-10-12). It currently 302s to the Coming soon page, which is Fourthwall's normal pre-launch state.
- ✅ Mailing-list form removed from the Coming soon page (2026-09-12).
- ✅ Initial products created (2026-10-01).

## Before pressing Live

- [ ] **Walk the real storefront, not the Coming soon page.** In Site design, preview the home page, a product page, and the cart. Look for placeholder text, sample images, or default Fourthwall copy. Fourthwall's reviewers look at exactly this before releasing the first payout.
- [ ] **Newsletter form on the live layout.** The September change only turned off the form on the Coming soon page. The live pages have their own setting. If there is still no plan to email people, turn it off there too.
- ✅ **Shipping settings** (Settings, Shipping). Checked 2026-10-13: all products are Fourthwall-fulfilled, so customers pay true cost by weight and nothing needed configuring. Country restriction left off (ships worldwide).
- [ ] **Final product pass with the team.** Titles, main images, and prices are what the YouTube merch shelf shows, and changing them after Google's review can trigger another review. Descriptions can keep changing after launch.
- [ ] **Unpublish anything not ready.** Every visible product at launch goes to the merch shelf and to Google's review.
- [ ] **About section** filled in (Settings). Speeds up Fourthwall's first-payout review.
- [ ] **Connect the YouTube channel** under Settings. Also speeds up the review, and is a prerequisite for the merch shelf.
- [ ] **Dashboard timezone set to UTC** (Settings, General). Payouts are calculated in UTC, so this keeps the reports matching the transactions.

## Going live

- ✅ **Set the site to Live** (Home tab or Site design tab, Site status). Confirmed Live on 2026-11-18.
- [ ] **Place one real test order** on a cheap item before announcing. This proves checkout, the confirmation email, and the order flow end to end. Cancel or refund it from the dashboard afterward. Fourthwall recommends this soft-launch step. (Moot by now: a real customer order came in on 2026-11-16, from Canada.)
- ✅ **Tell Claude the store is live** so it can verify from the repo side. Verified 2026-11-18: `store.jaredowen3d.com` returns the real storefront (200, no redirect), HTTPS is clean, the Store tab on every page links to it, and `jaredowen3d.com/store` 302s to it.

## Right after going live

- ✅ **Connect YouTube Shopping.** Connected; status as of 2026-11-18 is in "Open issues after launch" below. Fourthwall dashboard, Apps, YouTube, Connect, authorize with the Google account that owns the channel, then follow the steps that turn on the shelf. Requirements: 500+ subscribers, YouTube Partner Program with monetization on, at least one published product, and a channel not set to "made for kids". Google reviews the products after linking, typically 24 to 48 hours, so the shelf will not appear under videos immediately.
- [ ] **Announce with shipping expectations.** Print-on-demand means roughly one to two weeks to the door. Saying so up front avoids "where is my order" messages. Fourthwall handles customer support and sales tax as merchant of record, so those are not on you.

## Not blocking, but costs money

- ✅ **Close the Shopify trial** (`jaredowen3d.myshopify.com`). Canceled 2026-10-13 after a single $1 charge. The Printify store connected to it is unused. The original Printify Pop-Up Store (`jared-owen-animations.printify.me`) is separate; decide whether to keep it.

## What to expect after launch

- **First payout is held** until Fourthwall's one-time manual shop review. Selling works during the review. There is no status indicator; once cleared the shop shows as Verified or Trusted. If the first scheduled payout date passes with nothing, email support@fourthwall.com with the shop URL.
- **Payouts are monthly**, based on the prior month's sales in UTC, with a $25 minimum balance. US bank deposits land 1 to 3 business days after leaving Stripe. Failed payouts do not retry on their own: fix the details in Stripe, then email support to re-trigger.
- **Creator-side charges** (promo codes, giveaways, below-cost products) go to the Visa on file, capped at $100 per month.

## Open issues after launch (found 2026-11-18)

- [ ] **The whole shop is hidden from search engines, and the cause is on Fourthwall's side.** Every page carries `<meta name="robots" content="noindex">`, `robots.txt` is `User-agent: Storebot-Google / Allow: /` plus `User-Agent: * / Disallow: /`, and `sitemap.xml` is empty. The same is true on `jared-owen-shop.fourthwall.com`. Six other Fourthwall shops have no noindex tag and a robots.txt that only blocks spam bots, so this is not Fourthwall's default. Fourthwall's SEO article says shops are indexable by default and there is no setting for it. **Not this repo or Cloudflare:** the `store` DNS record points straight at Fourthwall (Google Cloud, `34.117.223.165`, not proxied, responses say `Via: 1.1 google`), and the old staging `noindex` header only ever applied to the Worker. **Jared emailed support@fourthwall.com on 2026-11-18**; waiting for a reply. Suspected cause, unconfirmed: a leftover pre-launch flag, or the one-time shop review still pending (the About section and channel-connection items above are still unticked). After Fourthwall's fix, check that `curl -s https://store.jaredowen3d.com/robots.txt` no longer has `Disallow: /` under `*`.
- [ ] **4 products are rejected from the YouTube merch shelf:** the adult Titanic Deck by Deck, Titanic at Sea, Adventure and Titanic Cutout T-shirts, about 105 variants in all, which is why YouTube Studio says "40+ products not approved". Every variant gives the same reason: "Unable to check product pages. Google cannot crawl your product landing page". The other 15 products are approved, including the kids' versions of the same designs. The pages load fine now, so the support email also asks Fourthwall to request a new Google review. The status is in the Fourthwall dashboard under Apps → YouTube product shelf, which shows the Merchant Center account Fourthwall runs for the shop (Merchant ID 5902845062). **Don't create a separate Merchant Center account**, because it would conflict with that one, and don't click Disconnect on the store in YouTube Studio.
- [ ] **Store tab on the YouTube channel is cluttered** because every color is its own tile. Tidy it under YouTube Studio → Earn → Shopping → Channel store.
- [ ] **Shop description** (Settings → General) still reads like Fourthwall's generic default ("The official website and shop of Jared Owen…"). Once the shop can be indexed, Google will show this text under the shop in search results, so write something specific.
- ✅ **Google Analytics** was already tracking the shop: property "Jared Owen Animations LLC", stream "Jared Owen Store". Alan was added as Analyst on 2026-11-18. The follow-up checklist for this lives in the JaredSocialMediaApp project (`docs/plans/fourthwall-google-analytics.md`) in Dropbox.

## Sources

- [Your first week on Fourthwall](https://help.fourthwall.com/getting-started/general-information/your-first-week-on-fourthwall)
- [Site verification before first payout](https://help.fourthwall.com/frequently-asked-questions/payments-and-pricing/site-verification-before-first-payout)
- [Common payout issues](https://help.fourthwall.com/frequently-asked-questions/payments-and-pricing/common-payout-issues)
- [Change site status](https://help.fourthwall.com/manage-my-shop/shop-settings/change-site-status)
