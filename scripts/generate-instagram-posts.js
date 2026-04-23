/**
 * Instagram Post Bulk Generator for AnantaSutra
 *
 * Uses OpenAI to generate batches of Instagram post content.
 * Saves output to docs/instagram/batch-*.json files.
 * Then run bulk-upload-instagram.js to push to Supabase.
 *
 * Usage:
 *   node scripts/generate-instagram-posts.js
 *   node scripts/generate-instagram-posts.js --count 50   # generate 50 posts
 *   node scripts/generate-instagram-posts.js --type reel  # only reels
 *   node scripts/generate-instagram-posts.js --category "AI Automation"
 *   node scripts/generate-instagram-posts.js --dry-run    # print 1 sample, no files
 */

const fs   = require('fs')
const path = require('path')

// ── Config ─────────────────────────────────────────────────────────────────
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OUT_DIR        = path.join(__dirname, '..', 'docs', 'instagram')
const POSTS_PER_FILE = 20   // posts per batch JSON file
const DELAY_MS       = 2000 // ms between OpenAI calls
const MODEL          = 'gpt-4o-mini'

// ── CLI args ───────────────────────────────────────────────────────────────
const args         = process.argv.slice(2)
const DRY_RUN      = args.includes('--dry-run')
const TOTAL_COUNT  = args.includes('--count')
  ? parseInt(args[args.indexOf('--count') + 1]) : 100
const TYPE_FILTER  = args.includes('--type')
  ? args[args.indexOf('--type') + 1] : null
const CAT_FILTER   = args.includes('--category')
  ? args[args.indexOf('--category') + 1] : null

// ── Topic Matrix ───────────────────────────────────────────────────────────
// Each entry = one post idea. Mix of post types per category.
const TOPICS = [
  // AI Automation
  { category: 'AI Automation', topic: 'AI Voice Agents for Indian businesses', type: 'carousel', focus: 'how it works in 5 slides' },
  { category: 'AI Automation', topic: 'Cost of AI calling vs human sales reps', type: 'carousel', focus: 'before/after comparison' },
  { category: 'AI Automation', topic: 'AI can call 1000 leads in a day', type: 'reel', focus: 'shocking stat hook, scroll stopper' },
  { category: 'AI Automation', topic: 'Recruiter AI — find candidates at ₹2/lead', type: 'carousel', focus: '5 reasons why this changes hiring' },
  { category: 'AI Automation', topic: 'Gmail automation saves 3 hours/day', type: 'reel', focus: 'morning routine, before/after' },
  { category: 'AI Automation', topic: 'Social media automation — set it and forget it', type: 'carousel', focus: 'step-by-step how we do it' },
  { category: 'AI Automation', topic: 'AI video generation — no camera needed', type: 'reel', focus: 'transformation, wow factor' },
  { category: 'AI Automation', topic: 'AI cold calling for real estate leads', type: 'carousel', focus: 'pain points + solution' },
  { category: 'AI Automation', topic: 'WhatsApp + AI automation for D2C brands', type: 'reel', focus: 'behind the scenes, conversational' },
  { category: 'AI Automation', topic: 'AI voice agent pricing explained ₹6/min', type: 'single', focus: 'myth-busting, is it really cheap?' },
  { category: 'AI Automation', topic: 'AI follow-up calls that never forget', type: 'reel', focus: 'relatable pain point for sales teams' },
  { category: 'AI Automation', topic: 'AI for appointment scheduling clinics/doctors', type: 'carousel', focus: 'before/after use case' },
  { category: 'AI Automation', topic: 'Indian language AI voice — Hindi, Tamil, Telugu', type: 'reel', focus: 'demo-style, wow moment' },
  { category: 'AI Automation', topic: 'Automate your entire sales funnel with AI', type: 'carousel', focus: 'end-to-end visual walkthrough' },
  { category: 'AI Automation', topic: '5 signs your business is ready for AI automation', type: 'carousel', focus: 'checklist style' },

  // Marketing & Creative
  { category: 'Marketing', topic: 'Why most Indian brands fail at Instagram', type: 'reel', focus: 'controversial hook, truth bomb' },
  { category: 'Marketing', topic: 'Performance marketing — every rupee tracked', type: 'carousel', focus: 'before/after ad spend' },
  { category: 'Marketing', topic: 'Google Ads vs Meta Ads for Indian businesses', type: 'carousel', focus: 'comparison, when to use which' },
  { category: 'Marketing', topic: 'Content calendar in one day with AI', type: 'reel', focus: 'tutorial style, quick tip' },
  { category: 'Marketing', topic: 'Brand identity — logo, colors, fonts explained', type: 'carousel', focus: 'education, swipe-worthy' },
  { category: 'Marketing', topic: 'Micro-influencer marketing India 2026', type: 'carousel', focus: 'data-driven, what works' },
  { category: 'Marketing', topic: 'How to write captions that stop the scroll', type: 'carousel', focus: 'copywriting tips with examples' },
  { category: 'Marketing', topic: 'Retargeting ads — show up where your leads go', type: 'reel', focus: 'relatable, slightly spooky hook' },
  { category: 'Marketing', topic: 'SEO vs AEO vs GEO — what is the difference?', type: 'carousel', focus: 'educational, trend-forward' },
  { category: 'Marketing', topic: 'Going viral on LinkedIn India — our framework', type: 'carousel', focus: 'step-by-step, actionable' },

  // Photography & Video Production
  { category: 'Creative', topic: 'Product photography tips for D2C brands', type: 'carousel', focus: 'before/after, DIY vs pro' },
  { category: 'Creative', topic: 'Drone footage — why it sells properties faster', type: 'reel', focus: 'visual, awe-inspiring' },
  { category: 'Creative', topic: 'AI video vs traditional video production cost', type: 'carousel', focus: 'shocking numbers, comparison' },
  { category: 'Creative', topic: 'Corporate video production — what you get with us', type: 'reel', focus: 'behind the scenes, BTS feel' },
  { category: 'Creative', topic: 'Real estate listing photos that get more clicks', type: 'carousel', focus: 'before/after transformation' },
  { category: 'Creative', topic: 'Reels for brands — the formula that works', type: 'carousel', focus: 'template, hook + body + CTA' },

  // Website & SEO
  { category: 'Web & SEO', topic: 'Is your website killing your business?', type: 'carousel', focus: '5 red flags, brutal truth' },
  { category: 'Web & SEO', topic: 'Next.js website vs WordPress — which is faster?', type: 'carousel', focus: 'technical made simple' },
  { category: 'Web & SEO', topic: 'How to rank on Google in 2026 — new rules', type: 'carousel', focus: 'education, current trends' },
  { category: 'Web & SEO', topic: 'AEO — making ChatGPT recommend your brand', type: 'reel', focus: 'future of search, mind-blowing' },
  { category: 'Web & SEO', topic: 'Core Web Vitals explained simply', type: 'carousel', focus: 'jargon-free, small business friendly' },

  // AnantaSutra Brand / Culture
  { category: 'Brand', topic: 'What AnantaSutra means — Infinite Wisdom', type: 'single', focus: 'brand story, emotional' },
  { category: 'Brand', topic: 'Why we chose Delhi for our AI agency', type: 'reel', focus: 'founder POV, behind the story' },
  { category: 'Brand', topic: 'How we serve clients co-founder-first', type: 'carousel', focus: 'USP, trust-building' },
  { category: 'Brand', topic: 'Free discovery call — what happens in 20 minutes', type: 'carousel', focus: 'demystify, reduce hesitation' },
  { category: 'Brand', topic: 'Our tech stack — what we use to build for clients', type: 'reel', focus: 'credibility, behind the scenes' },

  // Tips / Value Posts (saves & shares)
  { category: 'Tips', topic: '5 AI tools every Indian founder should know in 2026', type: 'carousel', focus: 'save-worthy, practical' },
  { category: 'Tips', topic: 'How to audit your digital marketing in 30 minutes', type: 'carousel', focus: 'checklist, actionable' },
  { category: 'Tips', topic: 'Email subject lines that get opened — 10 templates', type: 'carousel', focus: 'swipe file, high save rate' },
  { category: 'Tips', topic: 'Prompt engineering for business — beginner guide', type: 'carousel', focus: 'education, practical examples' },
  { category: 'Tips', topic: 'Cold DM strategy that actually works in 2026', type: 'carousel', focus: 'contrarian, real examples' },
]

// ── Helpers ────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function generateId(topic, index) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60) + `-${index}`
}

function getScheduledDate(index) {
  // Spread posts over 6 months, 1 post per day
  const base = new Date('2026-04-10T09:00:00Z')
  base.setDate(base.getDate() + index)
  // Skip no posts — Instagram can handle daily
  // Best posting times: 9am, 12pm, 6pm IST
  const hours = [9, 12, 18][index % 3]
  base.setHours(hours - 5, 30, 0, 0) // convert IST to UTC (IST = UTC+5:30)
  return base.toISOString()
}

// ── OpenAI caller ──────────────────────────────────────────────────────────
async function generatePost(topic, index) {
  const postTypeInstructions = {
    carousel: `Write a CAROUSEL post (6-8 slides). Format:
SLIDE 1 (Hook): One punchy headline that stops the scroll. Under 8 words.
SLIDE 2-6: Each slide = one key point. Title (bold) + 2-3 sentence explanation.
SLIDE 7 (CTA): Clear call to action slide.
Include a CAPTION (2-3 short paragraphs with line breaks + emojis, under 200 words).`,

    reel: `Write a REEL script. Format:
HOOK (0-3 sec): The very first line spoken or shown on screen. Must be scroll-stopping.
SCRIPT (15-30 sec): Natural spoken script, conversational. Break into short sentences.
ON-SCREEN TEXT: Key phrases to display as text overlays.
CAPTION (1-2 short paragraphs with emojis, under 100 words).`,

    single: `Write a SINGLE IMAGE post. Format:
IMAGE TEXT: The main text on the image itself (bold, punchy, under 12 words).
CAPTION: 3-4 short paragraphs with emojis and line breaks (under 150 words).`,
  }

  const instruction = postTypeInstructions[topic.type] || postTypeInstructions.carousel

  const systemPrompt = `You are a top-tier social media content strategist for AnantaSutra, a Delhi-based AI + marketing agency.
Write high-converting Instagram content that is:
- Written for Indian business owners, founders, and marketers
- Conversational, confident, not corporate
- Heavy on value — each post should teach something or shift perspective
- Uses Indian context (₹, Indian industries, city names) naturally
- Ends with a soft CTA for a free consultation or to follow for more

AnantaSutra services: AI Voice Agents (₹6/min), Recruiter AI (₹2/lead), Social Media Automation, Gmail Automation, AI Video Generation, AI Marketing, Professional Photography/Video, Brand Strategy, Website Development (Next.js), SEO/AEO/GEO.
Contact: contact@anantasutra.com | anantasutra.com`

  const userPrompt = `Create Instagram content for this topic:
Topic: "${topic.topic}"
Category: ${topic.category}
Post Type: ${topic.type.toUpperCase()}
Creative Focus: ${topic.focus}

${instruction}

Also provide:
HASHTAGS: 25-30 relevant hashtags (mix of niche + broad). Include #AnantaSutra #AIAutomation and relevant Indian business hashtags.
VISUAL PROMPT: A short description (2-3 sentences) of the ideal visual/image/thumbnail for this post that a designer or AI image generator can use.

Format your response as valid JSON:
{
  "caption": "...",
  "slides": [...] or "script": {...},
  "hashtags": ["#tag1", "#tag2", ...],
  "visualPrompt": "...",
  "hook": "First line of caption or hook text"
}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = JSON.parse(data.choices[0].message.content)

  return {
    id: generateId(topic.topic, index),
    category: topic.category,
    topic: topic.topic,
    postType: topic.type,
    hook: content.hook || '',
    caption: content.caption || '',
    slides: content.slides || null,
    script: content.script || null,
    hashtags: content.hashtags || [],
    visualPrompt: content.visualPrompt || '',
    status: 'draft',
    scheduledAt: getScheduledDate(index),
    platform: 'instagram',
    createdAt: new Date().toISOString(),
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║   AnantaSutra Instagram Post Generator                  ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable not set.')
    console.error('  export OPENAI_API_KEY=sk-...')
    process.exit(1)
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  // Filter topics by type/category if specified
  let topics = [...TOPICS]
  if (TYPE_FILTER) topics = topics.filter(t => t.type === TYPE_FILTER)
  if (CAT_FILTER)  topics = topics.filter(t => t.category.toLowerCase().includes(CAT_FILTER.toLowerCase()))

  // Expand topics to reach TOTAL_COUNT by cycling through the list
  const expanded = []
  for (let i = 0; i < TOTAL_COUNT; i++) {
    expanded.push({ ...topics[i % topics.length], _index: i })
  }

  console.log(`Generating ${expanded.length} Instagram posts...`)
  console.log(`Model: ${MODEL} | Output: ${OUT_DIR}\n`)

  if (DRY_RUN) {
    console.log('DRY RUN — generating 1 sample only\n')
    const sample = await generatePost(expanded[0], 0)
    console.log(JSON.stringify(sample, null, 2))
    return
  }

  const allPosts = []
  let success = 0
  let failed = 0

  for (let i = 0; i < expanded.length; i++) {
    const topic = expanded[i]
    process.stdout.write(`  [${i + 1}/${expanded.length}] ${topic.topic.substring(0, 50)}... `)

    try {
      const post = await generatePost(topic, i)
      allPosts.push(post)
      success++
      console.log('OK')
    } catch (err) {
      failed++
      console.log(`FAILED: ${err.message}`)
    }

    // Save every POSTS_PER_FILE posts (or at the end)
    if (allPosts.length > 0 && (allPosts.length % POSTS_PER_FILE === 0 || i === expanded.length - 1)) {
      const batchNum = Math.ceil(allPosts.length / POSTS_PER_FILE)
      const fileName = `batch-${String(batchNum).padStart(3, '0')}.json`
      const start = (batchNum - 1) * POSTS_PER_FILE
      const batchPosts = allPosts.slice(start)

      if (batchPosts.length > 0) {
        const filePath = path.join(OUT_DIR, fileName)
        fs.writeFileSync(filePath, JSON.stringify(batchPosts, null, 2))
        console.log(`  -> Saved ${filePath} (${batchPosts.length} posts)`)
      }
    }

    // Rate limit delay between API calls
    if (i < expanded.length - 1) await sleep(DELAY_MS)
  }

  console.log('\n════════════════════════════════════════')
  console.log(`Generated: ${success} posts`)
  console.log(`Failed:    ${failed} posts`)
  console.log(`Files:     ${OUT_DIR}/batch-*.json`)
  console.log('\nNext step: node scripts/bulk-upload-instagram.js')
  console.log('════════════════════════════════════════\n')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
