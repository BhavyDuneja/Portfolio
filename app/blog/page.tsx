import BlogList from './BlogList'
import { getPublishedPostSummaries } from '@/lib/storage'

// Rendered on the server (and cached), so the heading and the article links are in the HTML that
// search engines read. New posts show up within 10 minutes.
export const revalidate = 600
export const dynamic = 'force-static'

export default async function BlogPage() {
  const posts = await getPublishedPostSummaries()
  const featured = posts.filter((post) => post.featured)
  const categories = ['All', ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))]

  return <BlogList posts={posts} featured={featured} categories={categories} />
}
