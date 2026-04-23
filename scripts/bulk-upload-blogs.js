/**
 * Bulk Blog Upload Script for AnantaSutra
 *
 * Reads all batch-*.json files from docs/blogs/ and inserts them into Supabase
 * in controlled batches with delays to avoid rate limits.
 *
 * Usage:
 *   node scripts/bulk-upload-blogs.js
 *   node scripts/bulk-upload-blogs.js --dry-run     # Preview without inserting
 *   node scripts/bulk-upload-blogs.js --batch 5     # Upload only batch-005.json
 *   node scripts/bulk-upload-blogs.js --status draft # Override status for all posts
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// ── Configuration ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_SERVICE_ROLE_KEY // prefer service role for bulk ops

const BLOGS_DIR = path.join(__dirname, '..', 'docs', 'blogs')
const BATCH_SIZE = 25  // rows per Supabase insert call
const DELAY_MS = 1500  // ms between batches to respect rate limits
const TABLE = 'blog_posts'

// ── CLI Args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const STATUS_OVERRIDE = args.includes('--status') ? args[args.indexOf('--status') + 1] : null
const SINGLE_BATCH = args.includes('--batch') ? args[args.indexOf('--batch') + 1] : null

// ── Helpers ────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const generateSlug = (title) =>
  title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)

const estimateReadTime = (content) => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 250))
  return `${minutes} min read`
}

const generateExcerpt = (content, maxLen = 160) => {
  const text = content.replace(/<[^>]*>/g, '').trim()
  return text.length > maxLen ? text.substring(0, maxLen - 3) + '...' : text
}

// Map camelCase blog object to snake_case DB row
const toDbRow = (blog, index) => {
  const now = new Date().toISOString()
  const slug = blog.slug || generateSlug(blog.title)

  // Stagger dates so blogs don't all have the same date
  const blogDate = blog.date || new Date(
    Date.now() - (index * 4 * 60 * 60 * 1000) // 4 hours apart
  ).toISOString()

  return {
    id: blog.id || slug,
    title: blog.title,
    slug: slug,
    excerpt: blog.excerpt || generateExcerpt(blog.content),
    content: blog.content,
    author_id: blog.authorId || blog.author_id || null,
    author_name: blog.author || blog.authorName || blog.author_name || 'AnantaSutra Team',
    date: blogDate,
    read_time: blog.readTime || blog.read_time || estimateReadTime(blog.content),
    category: blog.category,
    tags: blog.tags || [],
    featured: blog.featured || false,
    status: STATUS_OVERRIDE || blog.status || 'published',
    scheduled_date: blog.scheduledDate || blog.scheduled_date || null,
    view_count: 0,
    meta_title: blog.metaTitle || blog.meta_title || blog.title,
    meta_description: blog.metaDescription || blog.meta_description || blog.excerpt || generateExcerpt(blog.content),
    image_url: blog.imageUrl || blog.image_url || null,
    image_alt: blog.imageAlt || blog.image_alt || blog.title,
    video_url: blog.videoUrl || blog.video_url || null,
    created_at: now,
    updated_at: now,
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║   AnantaSutra Blog Bulk Upload Script                   ║')
  console.log('║   700 Blogs → Supabase                                  ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: Missing Supabase credentials.')
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
    console.error('\nTip: Create a .env.local file or export them in your shell:')
    console.error('  export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
    console.error('  export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE — no data will be inserted\n')
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // ── Discover batch files ─────────────────────────────────────────────
  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`ERROR: Blogs directory not found: ${BLOGS_DIR}`)
    process.exit(1)
  }

  let files = fs.readdirSync(BLOGS_DIR)
    .filter(f => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()

  if (SINGLE_BATCH) {
    const target = `batch-${SINGLE_BATCH.padStart(3, '0')}.json`
    files = files.filter(f => f === target)
    if (files.length === 0) {
      console.error(`ERROR: Batch file not found: ${target}`)
      process.exit(1)
    }
  }

  console.log(`Found ${files.length} batch file(s) in ${BLOGS_DIR}\n`)

  // ── Load all blogs ───────────────────────────────────────────────────
  const allBlogs = []
  const errors = []

  for (const file of files) {
    try {
      const filePath = path.join(BLOGS_DIR, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const blogs = JSON.parse(raw)

      if (!Array.isArray(blogs)) {
        errors.push(`${file}: Expected array, got ${typeof blogs}`)
        continue
      }

      // Validate each blog
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i]
        if (!blog.title || !blog.content || !blog.category) {
          errors.push(`${file}[${i}]: Missing required fields (title, content, or category)`)
          continue
        }
        allBlogs.push({ ...blog, _source: file })
      }

      console.log(`  ✓ ${file}: ${blogs.length} blogs loaded`)
    } catch (err) {
      errors.push(`${file}: ${err.message}`)
    }
  }

  console.log(`\n────────────────────────────────────────`)
  console.log(`Total blogs loaded: ${allBlogs.length}`)
  console.log(`Validation errors:  ${errors.length}`)

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach(e => console.log(`  ✗ ${e}`))
  }

  if (allBlogs.length === 0) {
    console.error('\nNo valid blogs to upload. Exiting.')
    process.exit(1)
  }

  // ── Deduplicate by slug ──────────────────────────────────────────────
  const slugMap = new Map()
  const deduped = []
  let dupes = 0

  for (let i = 0; i < allBlogs.length; i++) {
    const slug = allBlogs[i].slug || generateSlug(allBlogs[i].title)
    if (slugMap.has(slug)) {
      dupes++
      // Append index to make unique
      allBlogs[i].slug = `${slug}-${i}`
    }
    slugMap.set(allBlogs[i].slug || slug, true)
    deduped.push(allBlogs[i])
  }

  if (dupes > 0) {
    console.log(`Deduplicated: ${dupes} slug collisions resolved`)
  }

  // ── Convert to DB rows ───────────────────────────────────────────────
  const rows = deduped.map((blog, i) => toDbRow(blog, i))

  // ── Category summary ─────────────────────────────────────────────────
  const catCounts = {}
  rows.forEach(r => { catCounts[r.category] = (catCounts[r.category] || 0) + 1 })
  console.log('\nCategory Distribution:')
  Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} posts`)
  })

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete. Use without --dry-run to upload.\n')
    // Print first blog as sample
    console.log('Sample row (first blog):')
    const sample = { ...rows[0] }
    sample.content = sample.content.substring(0, 200) + '...'
    console.log(JSON.stringify(sample, null, 2))
    process.exit(0)
  }

  // ── Upload in batches ────────────────────────────────────────────────
  console.log(`\n🚀 Starting upload: ${rows.length} blogs in batches of ${BATCH_SIZE}`)
  console.log(`   Delay between batches: ${DELAY_MS}ms\n`)

  let uploaded = 0
  let failed = 0
  const failedRows = []

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE)

    process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length} rows)... `)

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })
        .select('id')

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
      failedRows.push(...batch.map(r => ({ id: r.id, error: err.message })))
    }

    // Rate limit delay
    if (i + BATCH_SIZE < rows.length) {
      await sleep(DELAY_MS)
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════')
  console.log('Upload Complete!')
  console.log(`  ✅ Uploaded: ${uploaded}`)
  console.log(`  ❌ Failed:   ${failed}`)
  console.log(`  📊 Total:    ${rows.length}`)
  console.log('════════════════════════════════════════\n')

  if (failedRows.length > 0) {
    const failLog = path.join(BLOGS_DIR, 'upload-failures.json')
    fs.writeFileSync(failLog, JSON.stringify(failedRows, null, 2))
    console.log(`Failed rows saved to: ${failLog}`)
  }

  // Write upload report
  const report = {
    timestamp: new Date().toISOString(),
    totalBlogs: rows.length,
    uploaded,
    failed,
    categories: catCounts,
    statusOverride: STATUS_OVERRIDE,
    batchFiles: files,
  }
  const reportPath = path.join(BLOGS_DIR, 'upload-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`Upload report saved to: ${reportPath}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
