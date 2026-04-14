'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, Search, Video, Lock, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getPublishedPosts, getFeaturedPosts, getCategories, BlogPost } from '@/lib/storage'

const POSTS_PER_PAGE = 6

const getImageUrl = (post: BlogPost): string | null => {
  if (post.imageUrl) return post.imageUrl
  if (post.thumbnailUrl) return post.thumbnailUrl
  if (post.fullImageUrl) return post.fullImageUrl
  return null
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [featured, setFeatured] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setIsLoading(true)
      try {
        const [posts, featuredPosts, cats] = await Promise.all([
          getPublishedPosts(),
          getFeaturedPosts(),
          getCategories(),
        ])
        if (!cancelled) {
          setBlogPosts(posts)
          setFeatured(featuredPosts)
          setCategories(cats)
        }
      } catch (err) {
        console.error('Failed to load blog data:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const filteredPosts = useMemo(() => {
    let posts = blogPosts
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (selectedCategory !== 'All') {
      posts = posts.filter(p => p.category === selectedCategory)
    }
    return posts
  }, [blogPosts, searchTerm, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4">Blog</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Thoughts & <span className="gradient-text-saffron">Insights</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI automation, ancient wisdom, marketing strategies, product stories, and the entrepreneurial journey.
          </p>
        </motion.div>

        {/* Admin Link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex justify-end">
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-saffron-500 hover:border-saffron-500/30 transition-all text-sm">
            <Lock className="w-4 h-4" />
            Admin
          </Link>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {/* Search — full width */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-500 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all text-base"
              />
            </div>
            {/* Categories — own row, wraps naturally */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-saffron-500 text-dark-950'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured */}
        {selectedCategory === 'All' && searchTerm === '' && currentPage === 1 && featured.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-saffron-500" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full hover:border-saffron-500/20 hover:shadow-lg hover:shadow-saffron-500/5 transition-all duration-500"
                  >
                    <div className="h-44 bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center relative overflow-hidden">
                      {post.videoUrl ? (
                        <div className="absolute inset-0">
                          <div className="absolute top-2 right-2 z-10 bg-red-500/80 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video
                          </div>
                        </div>
                      ) : getImageUrl(post) ? (
                        <img src={getImageUrl(post)!} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-saffron-500/20 transition-colors">
                            <Tag className="w-6 h-6 text-saffron-500" />
                          </div>
                          <p className="text-gray-600 text-xs">Featured</p>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">{post.category}</span>
                        {(post.viewCount || 0) > 0 && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Eye className="w-3 h-3" />{post.viewCount}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-saffron-400 transition-colors duration-300">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-semibold text-white mb-6">
            {selectedCategory === 'All' && searchTerm === '' ? 'All Articles' : 'Results'}
            <span className="text-gray-600 text-sm font-normal ml-3">({filteredPosts.length} posts)</span>
          </h2>
          <div className="space-y-4">
            {paginatedPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass-card rounded-xl p-6 group cursor-pointer mb-4 hover:border-saffron-500/20 hover:shadow-lg hover:shadow-saffron-500/5 transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row gap-5">
                    <div className="lg:w-1/4">
                      <div className="h-40 lg:h-full rounded-xl bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center overflow-hidden min-h-[120px]">
                        {getImageUrl(post) ? (
                          <img src={getImageUrl(post)!} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        ) : (
                          <Tag className="w-8 h-8 text-gray-600 group-hover:text-saffron-500/50 transition-colors duration-300" />
                        )}
                      </div>
                    </div>
                    <div className="lg:w-3/4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">{post.category}</span>
                        {post.featured && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">Featured</span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-saffron-400 transition-colors duration-300">{post.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-400 group-hover:bg-saffron-500/5 group-hover:text-gray-300 transition-all duration-300">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        {(post.viewCount || 0) > 0 && (
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount} views</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {(() => {
              const pages: (number | string)[] = []
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else {
                pages.push(1)
                if (currentPage > 3) pages.push('...')
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                  pages.push(i)
                }
                if (currentPage < totalPages - 2) pages.push('...')
                pages.push(totalPages)
              }
              return pages.map((page, idx) =>
                typeof page === 'string' ? (
                  <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-600 text-sm">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-saffron-500 text-dark-950'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              )
            })()}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or browse different categories.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Blog
