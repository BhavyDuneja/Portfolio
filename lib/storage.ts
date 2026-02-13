// Storage utility for blog posts with image and video support
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
  thumbnailUrl?: string
  fullImageUrl?: string
  imageAlt?: string
  imageUrl?: string // Google Drive link
  videoUrl?: string // YouTube link
}

// In-memory storage for development
let blogPosts: BlogPost[] = []

// Load posts from localStorage (fallback)
export const loadPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const saved = localStorage.getItem('blogPosts')
    if (saved) {
      blogPosts = JSON.parse(saved)
    }
    return blogPosts
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

// Save posts to localStorage
export const savePosts = (posts: BlogPost[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    blogPosts = posts
    localStorage.setItem('blogPosts', JSON.stringify(posts))
  } catch (error) {
    console.error('Error saving posts:', error)
  }
}

// Get all posts
export const getAllPosts = (): BlogPost[] => {
  return loadPosts()
}

// Get post by ID
export const getPostById = (id: string): BlogPost | undefined => {
  const posts = loadPosts()
  return posts.find(post => post.id === id)
}

// Add new post
export const addPost = (post: Omit<BlogPost, 'id'>): BlogPost => {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString()
  }
  
  const posts = loadPosts()
  posts.unshift(newPost) // Add to beginning
  savePosts(posts)
  
  return newPost
}

// Update post
export const updatePost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const posts = loadPosts()
  const index = posts.findIndex(post => post.id === id)
  
  if (index === -1) return null
  
  posts[index] = { ...posts[index], ...updates }
  savePosts(posts)
  
  return posts[index]
}

// Delete post
export const deletePost = (id: string): boolean => {
  const posts = loadPosts()
  const filteredPosts = posts.filter(post => post.id !== id)
  
  if (filteredPosts.length === posts.length) return false
  
  savePosts(filteredPosts)
  return true
}

// Search posts
export const searchPosts = (query: string): BlogPost[] => {
  const posts = loadPosts()
  const lowercaseQuery = query.toLowerCase()
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Filter by category
export const filterPostsByCategory = (category: string): BlogPost[] => {
  const posts = loadPosts()
  
  if (category === 'All') return posts
  
  return posts.filter(post => post.category === category)
}

// Get featured posts
export const getFeaturedPosts = (): BlogPost[] => {
  const posts = loadPosts()
  return posts.filter(post => post.featured)
}

// Get categories
export const getCategories = (): string[] => {
  const posts = loadPosts()
  const categories = Array.from(new Set(posts.map(post => post.category)))
  return ['All', ...categories.sort()]
}
