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
- [ ] **Shipping settings** (Settings, Shipping). Confirm which countries you ship to and what the customer pays. International is where surprises happen.
- [ ] **Final product pass with the team.** Titles, main images, and prices are what the YouTube merch shelf shows, and changing them after Google's review can trigger another review. Descriptions can keep changing after launch.
- [ ] **Unpublish anything not ready.** Every visible product at launch goes to the merch shelf and to Google's review.
- [ ] **About section** filled in (Settings). Speeds up Fourthwall's first-payout review.
- [ ] **Connect the YouTube channel** under Settings. Also speeds up the review, and is a prerequisite for the merch shelf.
- [ ] **Dashboard timezone set to UTC** (Settings, General). Payouts are calculated in UTC, so this keeps the reports matching the transactions.

## Going live

- [ ] **Set the site to Live** (Home tab or Site design tab, Site status). "Schedule as Live" is also available if you want a set time.
- [ ] **Place one real test order** on a cheap item before announcing. This proves checkout, the confirmation email, and the order flow end to end. Cancel or refund it from the dashboard afterward. Fourthwall recommends this soft-launch step.
- [ ] **Tell Claude the store is live** so it can verify from the repo side that `store.jaredowen3d.com` returns the real storefront with no redirect, HTTPS is clean, and the Store tab lands on it.

## Right after going live

- [ ] **Connect YouTube Shopping.** Fourthwall dashboard, Apps, YouTube, Connect, authorize with the Google account that owns the channel, then follow the steps that turn on the shelf. Requirements: 500+ subscribers, YouTube Partner Program with monetization on, at least one published product, and a channel not set to "made for kids". Google reviews the products after linking, typically 24 to 48 hours, so the shelf will not appear under videos immediately.
- [ ] **Announce with shipping expectations.** Print-on-demand means roughly one to two weeks to the door. Saying so up front avoids "where is my order" messages. Fourthwall handles customer support and sales tax as merchant of record, so those are not on you.

## Not blocking, but costs money

- [ ] **Close the Shopify trial** (`jaredowen3d.myshopify.com`). It bills once the trial ends. The Printify store connected to it is unused. The original Printify Pop-Up Store (`jared-owen-animations.printify.me`) is separate; decide whether to keep it.

## What to expect after launch

- **First payout is held** until Fourthwall's one-time manual shop review. Selling works during the review. There is no status indicator; once cleared the shop shows as Verified or Trusted. If the first scheduled payout date passes with nothing, email support@fourthwall.com with the shop URL.
- **Payouts are monthly**, based on the prior month's sales in UTC, with a $25 minimum balance. US bank deposits land 1 to 3 business days after leaving Stripe. Failed payouts do not retry on their own: fix the details in Stripe, then email support to re-trigger.
- **Creator-side charges** (promo codes, giveaways, below-cost products) go to the Visa on file, capped at $100 per month.

## Sources

- [Your first week on Fourthwall](https://help.fourthwall.com/getting-started/general-information/your-first-week-on-fourthwall)
- [Site verification before first payout](https://help.fourthwall.com/frequently-asked-questions/payments-and-pricing/site-verification-before-first-payout)
- [Common payout issues](https://help.fourthwall.com/frequently-asked-questions/payments-and-pricing/common-payout-issues)
- [Change site status](https://help.fourthwall.com/manage-my-shop/shop-settings/change-site-status)
