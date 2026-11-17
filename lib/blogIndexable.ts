/**
 * SEO index pruning.
 * July 2026: of ~700 published blog posts, 147 evergreen guides stayed indexable and the rest got noindex
 * (616 discovered-not-indexed / 115 crawled-not-indexed in Search Console).
 * November 2026: Google indexed only a handful of those guides, against most of the on-topic posts (hiring a
 * dedicated expert: cost, pricing, comparisons) published since. The rule now: legacy guides (published on or
 * before PRUNE_CUTOFF) that Google showed in the last 56 days, or reports as indexed in the newest
 * data/seo/index-<date>.json of the marketing repo, stay indexable; the rest are noindex and leave the sitemap,
 * which keeps Google's attention on the core pages and the on-topic posts. Posts published after PRUNE_CUTOFF
 * are indexable by default.
 * Add a slug to re-index it. Re-check from data/google monthly: in the marketing repo's
 * data/google/google-<date>.json files, take the gsc_pages rows with "/blog/" on either host over the last two
 * 28-day windows, add the legacy slugs Google showed and drop the ones it stopped showing, unless the newest
 * data/seo/index-<date>.json still reports them "Submitted and indexed" (noindexing an indexed URL is a one-way
 * door for months). The July list of 147 and the slugs pruned since are in git history (this file before Nov 2026).
 * Merged near-duplicates (October 2026) are listed in lib/blogRedirects.json, which next.config.js
 * turns into 308 redirects; those slugs are never indexable, whatever their date.
 */
import blogRedirects from './blogRedirects.json'

const redirectedSlugs = new Set<string>(Object.keys(blogRedirects))

// Legacy guides Google showed in the 28-day windows ending 1 Nov and 15 Nov 2026 (data/google/google-2026-11-03.json
// and google-2026-11-17.json, computed 17 Nov 2026). Each comment gives impressions and position in the 19 Oct–15 Nov
// window, both hosts added. Posts from data/logs/blog.log (published after PRUNE_CUTOFF) are not listed: they are
// indexable by date. Six slugs were not in the July list (pruned then, or published later by the old pipeline); Google
// shows them, so they stay. The slugs marked "indexed per data/seo/index-2026-11-16.json" had no impressions in either
// window, but that index check reports them Submitted and indexed (crawled 8–13 Nov, Google's canonical is ours), so
// they stay too. The "redirect target" slug is the kept half of a merged pair in lib/blogRedirects.json.
const indexableSlugs = new Set<string>([
  'ai-campus-recruitment-automate-hiring-indian-colleges', // 12 impressions, position 60.9
  'ai-powered-recruitment-pipeline-job-posting-to-offer', // 1 impression, position 67
  'build-brand-twitter-x-lessons-india-top-accounts', // 3 impressions, position 7.3
  'build-cold-email-outreach-system-qualified-leads', // 1 impression, position 1
  'cause-marketing-india-brands-align-social-causes-authentically', // 13 impressions, position 11.1 (10 on www at 12.4, 3 on the apex host at 6.7)
  'cold-email-deliverability-stay-out-of-spam-folders-india', // 2 impressions, position 20
  'cold-email-vs-cold-calling-indian-b2b-sales', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'color-psychology-marketing-choosing-right-palette-indian-brand', // 8 impressions, position 6.2
  'conversion-rate-optimization-data-driven-approach-indian-websites', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'copywriting-for-indian-brands-writing-converts-across-cultures-languages', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'cross-platform-retargeting-google-meta-linkedin-working-together', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'customer-loyalty-programs-india-points-tiers-cashback', // 42 impressions, 1 click, position 42.3
  'd2c-brands-india-build-trust-loyalty-crowded-market', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'ecommerce-website-design-indian-markets-upi-cod-vernacular-ux', // 1 impression, position 9
  'email-marketing-kpis-metrics-indian-businesses', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'evaluate-marketing-software-procurement-guide-indian-businesses', // 4 impressions, position 4.2
  'experiential-marketing-india-memorable-brand-experiences', // 7 impressions, position 39.9
  'future-martech-india-ai-consolidation-composable-stack', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'generative-ai-changing-indian-marketing-agency-business-model', // 4 impressions, position 5.5
  'gmail-filters-labels-ultimate-organization-system-professionals', // not shown 19 Oct–15 Nov; 2 impressions, position 8.5 in the 5 Oct–1 Nov window
  'how-to-set-up-google-analytics-4-indian-businesses-complete-guide', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'indian-b2b-companies-content-marketing-enterprise-leads', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'indian-marketing-agencies-drive-creative-excellence-clients', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'market-research-methods-indian-businesses-surveys-interviews-data', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'marketing-trends-2026-indian-marketers-need-to-know', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'mobile-first-web-design-80-percent-indian-users-browse-phones', // 9 impressions, position 65.6
  'ppc-indian-saas-global-customers-paid-search', // redirect target (lib/blogRedirects.json); the merged slug 308s here
  'programmatic-advertising-india-automated-ad-buying-works', // 72 impressions, position 60.2
  'rag-vs-chatbot-what-to-hire-for', // 1 impression, position 45
  'reduce-google-ads-cost-per-click-india-50-percent', // 2 impressions, position 9
  'regional-indian-brands-local-language-storytelling-win-hearts', // 2 impressions, position 3
  'regional-language-influencers-reshaping-marketing-tier-2-3-india', // indexed per data/seo/index-2026-11-16.json, 0 impressions
  'repurpose-video-content-youtube-instagram-linkedin-websites', // not shown in either window; kept from the 3 Nov index check
  'responsible-ai-practices-define-successful-indian-companies', // 2 impressions, position 9
  'social-commerce-india-brands-sell-directly-through-social-media', // 3 impressions, position 13
  'video-production-budget-guide-indian-smes-quality-within-budget', // 9 impressions, position 8.2
  'youtube-seo-rank-videos-page-1-india', // 4 impressions, position 20.2
])

/** Posts published after the prune date are indexable by default (daily SEO
 *  pipeline output); only the legacy thin content stays noindexed. */
const PRUNE_CUTOFF = '2026-07-24'

export function isIndexableBlogPost(slug: string, date?: string | null): boolean {
  if (!slug || redirectedSlugs.has(slug)) return false
  if (indexableSlugs.has(slug)) return true
  if (date && String(date).slice(0, 10) > PRUNE_CUTOFF) return true
  return false
}
