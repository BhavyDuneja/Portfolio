import BlogList from './BlogList'
import { getIndexablePostSummaries, type BlogPostSummary } from '@/lib/storage'

// Rendered on the server (and cached), so the heading and the article links are in the HTML that
// search engines read. New posts show up within 10 minutes.
export const revalidate = 600
export const dynamic = 'force-static'

/** Every indexable post as a plain link, grouped by category. The interactive list shows six posts at a
 *  time, so without this most posts had no link from the hub. Plain <a>, not Link: 150+ links in view
 *  would each trigger a prefetch. */
function ArticleIndex({ posts }: { posts: BlogPostSummary[] }) {
  const groups = new Map<string, BlogPostSummary[]>()
  posts.forEach((post) => {
    const category = post.category || 'More articles'
    const group = groups.get(category)
    if (group) group.push(post)
    else groups.set(category, [post])
  })
  const categories = Array.from(groups.keys()).sort((a, b) => a.localeCompare(b))

  return (
    <nav aria-labelledby="all-articles" className="mt-20 glass-card rounded-2xl p-6 md:p-8">
      <h2 id="all-articles" className="text-xl font-semibold text-white mb-6">
        Browse all articles
        <span className="text-gray-600 text-sm font-normal ml-3">({posts.length} posts)</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h3 className="text-saffron-400 text-sm font-medium uppercase tracking-wider mb-3">{category}</h3>
            <ul className="space-y-2">
              {(groups.get(category) ?? []).map((post) => (
                <li key={post.slug}>
                  <a href={`/blog/${post.slug}`} className="text-gray-400 text-sm leading-snug hover:text-saffron-400 transition-colors">
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  )
}

export default async function BlogPage() {
  const posts = await getIndexablePostSummaries()

  return (
    <BlogList posts={posts}>
      {posts.length > 0 && <ArticleIndex posts={posts} />}
    </BlogList>
  )
}
