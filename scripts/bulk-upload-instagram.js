/**
 * Instagram Post Bulk Upload Script for AnantaSutra
 *
 * Reads all batch-*.json files from docs/instagram/ and inserts
 * them into the Supabase `instagram_posts` table.
 *
 * Usage:
 *   node scripts/bulk-upload-instagram.js
 *   node scripts/bulk-upload-instagram.js --dry-run      # preview only
 *   node scripts/bulk-upload-instagram.js --batch 3      # upload only batch-003.json
 *   node scripts/bulk-upload-instagram.js --status ready # override status
 */

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

// ── Config ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const POSTS_DIR  = path.join(__dirname, '..', 'docs', 'instagram')
const BATCH_SIZE = 25
const DELAY_MS   = 1500
const TABLE      = 'instagram_posts'

// ── CLI args ───────────────────────────────────────────────────────────────
const args            = process.argv.slice(2)
const DRY_RUN         = args.includes('--dry-run')
const STATUS_OVERRIDE = args.includes('--status')
  ? args[args.indexOf('--status') + 1] : null
const SINGLE_BATCH    = args.includes('--batch')
  ? args[args.indexOf('--batch') + 1] : null

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Map JSON post to DB row
function toDbRow(post, index) {
  const now = new Date().toISOString()
  return {
    id:           post.id || `post-${index}`,
    category:     post.category || 'General',
    topic:        post.topic || '',
    post_type:    post.postType || post.post_type || 'carousel',
    hook:         post.hook || '',
    caption:      post.caption || '',
    slides:       post.slides || null,
    script:       post.script || null,
    hashtags:     post.hashtags || [],
    visual_prompt: post.visualPrompt || post.visual_prompt || '',
    platform:     post.platform || 'instagram',
    status:       STATUS_OVERRIDE || post.status || 'draft',
    scheduled_at: post.scheduledAt || post.scheduled_at || null,
    published_at: post.publishedAt || post.published_at || null,
    image_url:    post.imageUrl || post.image_url || null,
    post_url:     post.postUrl || post.post_url || null,
    likes:        post.likes || 0,
    comments:     post.comments || 0,
    reach:        post.reach || 0,
    saves:        post.saves || 0,
    created_at:   now,
    updated_at:   now,
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║   AnantaSutra Instagram Post Bulk Upload                ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: Missing Supabase credentials.')
    console.error('  export NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co')
    console.error('  export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
    process.exit(1)
  }

  if (DRY_RUN) console.log('DRY RUN MODE — nothing will be inserted\n')

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`ERROR: Directory not found: ${POSTS_DIR}`)
    console.error('Run generate-instagram-posts.js first.')
    process.exit(1)
  }

  let files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()

  if (SINGLE_BATCH) {
    const target = `batch-${SINGLE_BATCH.padStart(3, '0')}.json`
    files = files.filter(f => f === target)
    if (!files.length) {
      console.error(`ERROR: ${target} not found in ${POSTS_DIR}`)
      process.exit(1)
    }
  }

  console.log(`Found ${files.length} batch file(s)\n`)

  const allPosts = []
  const errors   = []

  for (const file of files) {
    try {
      const raw   = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const posts = JSON.parse(raw)
      if (!Array.isArray(posts)) {
        errors.push(`${file}: expected array`)
        continue
      }
      posts.forEach((p, i) => {
        if (!p.caption) {
          errors.push(`${file}[${i}]: missing caption`)
        } else {
          allPosts.push({ ...p, _source: file })
        }
      })
      console.log(`  ✓ ${file}: ${posts.length} posts`)
    } catch (err) {
      errors.push(`${file}: ${err.message}`)
    }
  }

  console.log(`\nTotal: ${allPosts.length} posts | Errors: ${errors.length}`)
  if (errors.length) errors.forEach(e => console.log(`  ✗ ${e}`))
  if (!allPosts.length) { console.error('\nNothing to upload.'); process.exit(1) }

  // Category summary
  const cats = {}
  allPosts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1 })
  console.log('\nCategory Distribution:')
  Object.entries(cats).sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => console.log(`  ${c}: ${n}`))

  const rows = allPosts.map((p, i) => toDbRow(p, i))

  if (DRY_RUN) {
    console.log('\nSample row:')
    const s = { ...rows[0] }
    s.caption = s.caption.substring(0, 100) + '...'
    console.log(JSON.stringify(s, null, 2))
    console.log('\nDry run complete. Remove --dry-run to upload.')
    return
  }

  console.log(`\nUploading ${rows.length} posts in batches of ${BATCH_SIZE}...\n`)

  let uploaded = 0
  let failed   = 0
  const failedRows = []

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch    = rows.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const total    = Math.ceil(rows.length / BATCH_SIZE)

    process.stdout.write(`  Batch ${batchNum}/${total} (${batch.length} rows)... `)

    try {
      const { error } = await supabase
        .from(TABLE)
        .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })

      if (error) {
        console.log(`FAILED: ${error.message}`)
        failed += batch.length
        failedRows.push(...batch.map(r => ({ id: r.id, error: error.message })))
      } else {
        uploaded += batch.length
        console.log(`OK (${uploaded}/${rows.length})`)
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`)
      failed += batch.length
    }

    if (i + BATCH_SIZE < rows.length) await sleep(DELAY_MS)
  }

  console.log('\n════════════════════════════════════════')
  console.log(`Uploaded: ${uploaded}`)
  console.log(`Failed:   ${failed}`)
  console.log('════════════════════════════════════════\n')

  if (failedRows.length) {
    const log = path.join(POSTS_DIR, 'upload-failures.json')
    fs.writeFileSync(log, JSON.stringify(failedRows, null, 2))
    console.log(`Failed rows → ${log}`)
  }

  fs.writeFileSync(
    path.join(POSTS_DIR, 'upload-report.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), uploaded, failed, categories: cats }, null, 2)
  )
  console.log(`Report → ${path.join(POSTS_DIR, 'upload-report.json')}`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
