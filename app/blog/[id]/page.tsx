'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Video, Share2, Twitter, Linkedin, Eye } from 'lucide-react'
import Link from 'next/link'
import { getPostById, incrementViewCount, getRelatedPosts, BlogPost } from '@/lib/storage'

const getImageUrl = (post: BlogPost): string | null => {
  if (post.imageUrl) return post.imageUrl
  if (post.fullImageUrl) return post.fullImageUrl
  if (post.thumbnailUrl) return post.thumbnailUrl
  return null
}

const BlogPostPage = () => {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const viewTracked = useRef(false)

  useEffect(() => {
    if (!params.id) return

    let cancelled = false
    const idOrSlug = params.id as string

    const loadPost = async () => {
      setIsLoading(true)
      try {
        const foundPost = await getPostById(idOrSlug)
        if (cancelled) return

        if (foundPost) {
          setPost(foundPost)

          // Increment view count once per page load
          if (!viewTracked.current) {
            viewTracked.current = true
            await incrementViewCount(idOrSlug)
          }

          // Load related posts
          const related = await getRelatedPosts(idOrSlug, 3)
          if (!cancelled) {
            setRelatedPosts(related)
          }
        }
      } catch (err) {
        console.error('Failed to load blog post:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadPost()
    return () => { cancelled = true }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="btn-primary inline-flex">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(post)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-saffron-500 hover:text-saffron-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          {/* Header Image/Video */}
          {post.videoUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe src={post.videoUrl} className="absolute top-0 left-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <div className="absolute top-4 right-4 bg-red-500/80 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                <Video className="w-4 h-4" /> Video
              </div>
            </div>
          ) : imageUrl ? (
            <div className="w-full h-80 md:h-96 overflow-hidden">
              <img src={imageUrl} alt={post.imageAlt || post.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          ) : null}

          <div className="p-8 md:p-12">
            {/* Category */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">{post.category}</span>
              {post.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">Featured</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight font-display">{post.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{post.readTime}</span></div>
              {(post.viewCount || 0) > 0 && (
                <div className="flex items-center gap-2"><Eye className="w-4 h-4" /><span>{post.viewCount} views</span></div>
              )}
            </div>

            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-lg text-gray-300 leading-relaxed italic border-l-2 border-saffron-500 pl-6">{post.excerpt}</p>
            </div>

            {/* Content */}
            <div className="blog-content mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
            <style jsx global>{`
              .blog-content { font-size: 17px; line-height: 1.9; color: #9ca3af; }
              .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 { font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #e8e6f0; }
              .blog-content h1 { font-size: 2.2rem; } .blog-content h2 { font-size: 1.8rem; } .blog-content h3 { font-size: 1.5rem; }
              .blog-content p { margin-bottom: 1.5rem; }
              .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 2rem; }
              .blog-content li { margin-bottom: 0.5rem; }
              .blog-content a { color: #E8A317; text-decoration: underline; }
              .blog-content a:hover { color: #FFB800; }
              .blog-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 2rem 0; }
              .blog-content blockquote { border-left: 3px solid #E8A317; padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #6b7280; }
              .blog-content code { background-color: rgba(255,255,255,0.05); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; color: #E8A317; }
              .blog-content pre { background-color: #0A0A1E; color: #e8e6f0; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 2rem 0; border: 1px solid rgba(255,255,255,0.05); }
              .blog-content pre code { background-color: transparent; color: inherit; padding: 0; }
            `}</style>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 pt-8 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-white/5 text-gray-400 text-sm rounded-full hover:bg-saffron-500/10 hover:text-saffron-400 transition-colors">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share this article
              </h3>
              <div className="flex gap-3">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-saffron-500 to-violet-500 rounded-full" />
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related, i) => (
                <Link key={related.id} href={`/blog/${related.id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full hover:border-saffron-500/20 hover:shadow-lg hover:shadow-saffron-500/5 transition-all duration-500"
                  >
                    <div className="h-36 bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center overflow-hidden">
                      {getImageUrl(related) ? (
                        <img
                          src={getImageUrl(related)!}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <Tag className="w-8 h-8 text-gray-600 group-hover:text-saffron-500/50 transition-colors duration-300" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">{related.category}</span>
                      </div>
                      <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-saffron-400 transition-colors duration-300 text-sm">{related.title}</h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{related.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{related.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BlogPostPage
