'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Video, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { getPostById, BlogPost } from '@/lib/storage'

// Helper function to get image URL
const getImageUrl = (post: BlogPost): string | null => {
  if (post.imageUrl) return post.imageUrl
  if (post.fullImageUrl) return post.fullImageUrl
  if (post.thumbnailUrl) return post.thumbnailUrl
  return null
}

const BlogPostPage = () => {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !params.id) return

    const foundPost = getPostById(params.id as string)
    if (foundPost) {
      setPost(foundPost)
    }
    setIsLoading(false)
  }, [isClient, params.id])

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(post)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden"
        >
          {/* Header Image/Video */}
          {post.videoUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={post.videoUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>Video</span>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={imageUrl}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ) : null}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category and Featured Badge */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-6">
                {post.excerpt}
              </p>
            </div>

            {/* Content */}
            <div 
              className="blog-content mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <style jsx global>{`
              .blog-content {
                font-size: 18px;
                line-height: 1.8;
                color: #374151;
              }
              .blog-content h1,
              .blog-content h2,
              .blog-content h3,
              .blog-content h4,
              .blog-content h5,
              .blog-content h6 {
                font-weight: 700;
                margin-top: 2rem;
                margin-bottom: 1rem;
                color: #111827;
              }
              .blog-content h1 { font-size: 2.5rem; }
              .blog-content h2 { font-size: 2rem; }
              .blog-content h3 { font-size: 1.75rem; }
              .blog-content h4 { font-size: 1.5rem; }
              .blog-content p {
                margin-bottom: 1.5rem;
              }
              .blog-content ul,
              .blog-content ol {
                margin-bottom: 1.5rem;
                padding-left: 2rem;
              }
              .blog-content li {
                margin-bottom: 0.5rem;
              }
              .blog-content a {
                color: #10b981;
                text-decoration: underline;
              }
              .blog-content a:hover {
                color: #059669;
              }
              .blog-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 2rem 0;
              }
              .blog-content blockquote {
                border-left: 4px solid #10b981;
                padding-left: 1.5rem;
                margin: 2rem 0;
                font-style: italic;
                color: #6b7280;
              }
              .blog-content code {
                background-color: #f3f4f6;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-size: 0.9em;
                color: #dc2626;
              }
              .blog-content pre {
                background-color: #1f2937;
                color: #f9fafb;
                padding: 1.5rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 2rem 0;
              }
              .blog-content pre code {
                background-color: transparent;
                color: inherit;
                padding: 0;
              }
            `}</style>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Tags</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-green-100 hover:text-green-700 transition-colors duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share this article</span>
              </h3>
              <div className="flex space-x-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-300"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}

export default BlogPostPage
