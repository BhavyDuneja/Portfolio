'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Tag, ArrowLeft, Search, Filter, Video, Image as ImageIcon, Lock } from 'lucide-react'
import Link from 'next/link'
import { getAllPosts, searchPosts, filterPostsByCategory, getCategories, BlogPost } from '@/lib/storage'
import { getResponsiveImageUrls } from '@/lib/github-storage'

// Helper function to get image URL (prioritize imageUrl over thumbnailUrl)
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
  const [isClient, setIsClient] = useState(false)


  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load posts using the new storage system
  useEffect(() => {
    if (!isClient) return
    
    const posts = getAllPosts()
    
    // Only load default posts if there are NO posts at all (first time visit)
    // This preserves user-created posts
    if (posts.length === 0) {
      // Default posts if no saved posts
      const defaultPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Scalable .NET Applications with Domain-Driven Design',
      excerpt: 'Learn how to implement DDD principles in .NET applications to create maintainable and scalable software architectures.',
      content: 'Domain-Driven Design (DDD) is a software development approach that focuses on creating software that reflects a deep understanding of the business domain. In this comprehensive guide, we\'ll explore how to implement DDD principles in .NET applications...',
      author: 'Bhavya Duneja',
      date: '2024-12-15',
      readTime: '8 min read',
      category: 'Software Architecture',
      tags: ['DDD', '.NET', 'C#', 'Architecture', 'Clean Code'],
      featured: true,
      thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGFkZTgwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZWZhdWx0IEltYWdlPC90ZXh0Pjwvc3ZnPg==',
      fullImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGFkZTgwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZWZhdWx0IEltYWdlPC90ZXh0Pjwvc3ZnPg==',
      imageAlt: 'Default Architecture Image'
    },
    {
      id: '2',
      title: 'Mastering AWS Cloud Infrastructure for Modern Applications',
      excerpt: 'A deep dive into AWS services and best practices for building robust, scalable cloud infrastructure.',
      content: 'Amazon Web Services (AWS) provides a comprehensive suite of cloud computing services that enable businesses to build and scale applications with unprecedented flexibility. In this article, we\'ll explore the key AWS services...',
      author: 'Bhavya Duneja',
      date: '2024-12-10',
      readTime: '12 min read',
      category: 'Cloud Computing',
      tags: ['AWS', 'Cloud', 'Infrastructure', 'DevOps', 'Scalability'],
      featured: false
    },
    {
      id: '3',
      title: 'From Java to Go: A Developer\'s Journey in Microservices',
      excerpt: 'My experience transitioning from Java to Go and building microservices architecture in a Japanese tech company.',
      content: 'Transitioning from Java to Go was one of the most challenging yet rewarding experiences in my career. Working in a Japanese tech environment added cultural and linguistic dimensions to the technical learning curve...',
      author: 'Bhavya Duneja',
      date: '2024-12-05',
      readTime: '10 min read',
      category: 'Career',
      tags: ['Go', 'Java', 'Microservices', 'Career', 'Japan'],
      featured: true,
      thumbnailUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM3N2RjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5KQVZBIC0gR08gPC90ZXh0Pjwvc3ZnPg==',
      fullImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM3N2RjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5KQVZBIC0gR08gPC90ZXh0Pjwvc3ZnPg==',
      imageAlt: 'Java to Go Transition'
    },
    {
      id: '4',
      title: 'Building Full-Stack Applications with MERN Stack',
      excerpt: 'Complete guide to building modern web applications using MongoDB, Express.js, React, and Node.js.',
      content: 'The MERN stack has become one of the most popular choices for building full-stack JavaScript applications. In this tutorial, we\'ll walk through building a complete application from scratch...',
      author: 'Bhavya Duneja',
      date: '2024-11-28',
      readTime: '15 min read',
      category: 'Web Development',
      tags: ['MERN', 'React', 'Node.js', 'MongoDB', 'JavaScript'],
      // image: '/images/blog/mern-stack.jpg',
      featured: false
    },
    {
      id: '5',
      title: 'Working as a Software Engineer in Japan: Cultural Insights',
      excerpt: 'My experiences and learnings from working in the Japanese tech industry as an international developer.',
      content: 'Working as a software engineer in Japan has been an incredible journey of cultural adaptation and professional growth. The Japanese work culture, while different from what I was accustomed to, has taught me valuable lessons...',
      author: 'Bhavya Duneja',
      date: '2024-11-20',
      readTime: '7 min read',
      category: 'Career',
      tags: ['Japan', 'Culture', 'Career', 'International', 'Experience'],
      // image: '/images/blog/japan-experience.jpg',
      featured: false
    },
    {
      id: '6',
      title: 'System Design Principles for Large-Scale Applications',
      excerpt: 'Essential system design concepts and patterns for building applications that can handle millions of users.',
      content: 'System design is a crucial skill for software engineers working on large-scale applications. Understanding how to design systems that can handle massive traffic, maintain high availability, and scale efficiently is essential...',
      author: 'Bhavya Duneja',
      date: '2024-11-15',
      readTime: '20 min read',
      category: 'Software Architecture',
      tags: ['System Design', 'Scalability', 'Architecture', 'Performance', 'Distributed Systems'],
      // image: '/images/blog/system-design.jpg',
      featured: true
    },
    {
      id: '7',
      title: 'Building a Startup from Zero: Lessons from Fit-First',
      excerpt: 'My journey of founding and scaling an e-commerce startup to 4+ lakhs revenue with zero initial investment.',
      content: 'Starting a business from scratch is one of the most challenging yet rewarding experiences. When I founded Fit-First, an e-commerce startup specializing in women\'s footwear and apparel, I had no initial capital but plenty of determination...',
      author: 'Bhavya Duneja',
      date: '2024-11-10',
      readTime: '12 min read',
      category: 'Startup and Finance',
      tags: ['Startup', 'E-commerce', 'Entrepreneurship', 'Business', 'Finance'],
      // image: '/images/blog/startup-journey.jpg',
      featured: false
    },
    {
      id: '8',
      title: 'Personal Finance for Software Engineers: Building Wealth in Tech',
      excerpt: 'A practical guide to managing finances, investments, and building long-term wealth as a software engineer.',
      content: 'As software engineers, we often earn well but may not have the financial literacy to make the most of our income. This guide covers budgeting, investing, and building wealth while working in tech...',
      author: 'Bhavya Duneja',
      date: '2024-11-05',
      readTime: '15 min read',
      category: 'Startup and Finance',
      tags: ['Finance', 'Investing', 'Budgeting', 'Wealth Building', 'Tech Career'],
      // image: '/images/blog/personal-finance.jpg',
      featured: true
    },
    {
      id: '9',
      title: 'The Philosophy of Clean Code: Beyond Syntax and Semantics',
      excerpt: 'Exploring the deeper philosophical principles that guide good software design and maintainable code.',
      content: 'Clean code is not just about following syntax rules or design patterns. It\'s a philosophy that encompasses how we think about problems, how we communicate through code, and how we build systems that stand the test of time...',
      author: 'Bhavya Duneja',
      date: '2024-10-28',
      readTime: '10 min read',
      category: 'Philosophy',
      tags: ['Philosophy', 'Clean Code', 'Software Design', 'Ethics', 'Thinking'],
      // image: '/images/blog/clean-code-philosophy.jpg',
      featured: false
    },
    {
      id: '10',
      title: 'Cooking as a Developer: How Kitchen Logic Applies to Programming',
      excerpt: 'Drawing parallels between cooking and coding - from recipe following to improvisation and debugging.',
      content: 'Cooking and programming share more similarities than you might think. Both require following recipes (algorithms), improvising when things go wrong, and understanding the fundamental principles that make everything work...',
      author: 'Bhavya Duneja',
      date: '2024-10-20',
      readTime: '8 min read',
      category: 'Cooking',
      tags: ['Cooking', 'Programming', 'Analogy', 'Learning', 'Creativity'],
      // image: '/images/blog/cooking-coding.jpg',
      featured: false
    },
    {
      id: '11',
      title: 'Japanese Cuisine and the Art of Mindful Development',
      excerpt: 'How Japanese cooking principles of precision, patience, and respect can improve your software development practices.',
      content: 'Living in Japan has taught me that the principles of Japanese cuisine - precision, patience, respect for ingredients, and attention to detail - can be applied to software development...',
      author: 'Bhavya Duneja',
      date: '2024-10-15',
      readTime: '9 min read',
      category: 'Cooking',
      tags: ['Japanese Cuisine', 'Mindfulness', 'Development', 'Culture', 'Precision'],
      // image: '/images/blog/japanese-cooking.jpg',
      featured: true
    }
      ]
      setBlogPosts(defaultPosts)
      // Save the default posts to localStorage
      localStorage.setItem('blogPosts', JSON.stringify(defaultPosts))
    } else {
      setBlogPosts(posts)
    }
  }, [isClient])

  // Don't render until client-side data is loaded
  if (!isClient) {
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

  const categories = getCategories()

  // Get filtered posts using the blogPosts state
  const filteredPosts = (() => {
    let posts = blogPosts
    
    if (searchTerm) {
      const lowercaseQuery = searchTerm.toLowerCase()
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }
    
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.category === selectedCategory)
    }
    
    return posts
  })()

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">

      <div className="container mx-auto px-4 py-12">
        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-end"
        >
          <Link
            href="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm font-medium"
          >
            <Lock className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Posts */}
        {selectedCategory === 'All' && searchTerm === '' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <Tag className="w-6 h-6 mr-3 text-green-500" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  >
                  <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center relative">
                    {post.videoUrl ? (
                      <div className="h-48 w-full overflow-hidden rounded-t-2xl relative">
                        <div className="relative w-full h-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={post.videoUrl}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : getImageUrl(post) ? (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={getImageUrl(post)!}
                          alt={post.imageAlt || post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            const parent = (e.target as HTMLImageElement).parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="text-center w-full h-full flex items-center justify-center">
                                  <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p class="text-sm text-gray-600">Featured Article</p>
                                </div>
                              `
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Tag className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-600">Featured Article</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">Featured</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium text-center">
                      Read More
                    </div>
                  </div>
                </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {selectedCategory === 'All' && searchTerm === '' ? 'All Articles' : 'Search Results'}
          </h2>
          <div className="grid gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    {post.videoUrl ? (
                      <div className="h-48 lg:h-full rounded-xl overflow-hidden relative">
                        <div className="relative w-full h-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={post.videoUrl}
                            className="absolute top-0 left-0 w-full h-full rounded-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      </div>
                    ) : getImageUrl(post) ? (
                      <div className="h-48 lg:h-full rounded-xl overflow-hidden">
                        <img
                          src={getImageUrl(post)!}
                          alt={post.imageAlt || post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            const parent = (e.target as HTMLImageElement).parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="h-48 lg:h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                                  <div class="text-center">
                                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <p class="text-sm text-gray-600">Article Image</p>
                                  </div>
                                </div>
                              `
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 lg:h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Tag className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm text-gray-600">Article Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="lg:w-2/3">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-green-100 hover:text-green-700 transition-colors duration-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-block px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium"
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
