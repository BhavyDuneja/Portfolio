'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Lock, LogOut, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { getAllPosts, addPost, updatePost, deletePost, savePosts, BlogPost } from '@/lib/storage'
import { isAuthenticated, login, logout } from '@/lib/auth'
import RichTextEditor from '@/components/RichTextEditor'

interface FormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string
  readTime: string
  featured: boolean
  imageUrl: string // Google Drive link
  videoUrl: string // YouTube link
  imageAlt: string
}

const AdminPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Software Architecture',
    tags: '',
    readTime: '',
    featured: false,
    imageUrl: '',
    videoUrl: '',
    imageAlt: ''
  })

  const categories = [
    'Software Architecture',
    'Cloud Computing', 
    'Career',
    'Web Development',
    'Startup and Finance',
    'Philosophy',
    'Cooking'
  ]

  // Ensure we're on the client side and check authentication
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setAuthenticated(isAuthenticated())
    }
  }, [])

  // Load posts using the new storage system
  useEffect(() => {
    if (!isClient || !authenticated) return
    
    const allPosts = getAllPosts()
    setPosts(allPosts)
  }, [isClient, authenticated])

  // Reload posts after create/update/delete operations
  const reloadPosts = () => {
    const allPosts = getAllPosts()
    setPosts(allPosts)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (login(loginPassword)) {
      setAuthenticated(true)
      setLoginPassword('')
    } else {
      setLoginError('Incorrect password. Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    setShowForm(false)
    setEditingPost(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return ''
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }
    
    return url // Return as-is if no pattern matches
  }

  // Helper function to convert Google Drive link to direct image link
  const getGoogleDriveImageUrl = (url: string): string => {
    if (!url) return ''
    
    // If it's already a direct image link, return as-is
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    
    // If it's already in the correct format, return as-is
    if (url.includes('drive.google.com/uc?export=view&id=')) {
      return url
    }
    
    return url // Return as-is if no pattern matches
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const postData: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: 'Bhavya Duneja',
      date: new Date().toISOString().split('T')[0],
      readTime: formData.readTime,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      featured: formData.featured,
      imageUrl: formData.imageUrl ? getGoogleDriveImageUrl(formData.imageUrl) : undefined,
      videoUrl: formData.videoUrl ? getYouTubeEmbedUrl(formData.videoUrl) : undefined,
      imageAlt: formData.imageAlt
    }

    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = updatePost(editingPost.id, postData)
        if (updatedPost) {
          reloadPosts()
        }
      } else {
        // Create new post
        const newPost = addPost(postData)
        reloadPosts()
      }

      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Software Architecture',
        tags: '',
        readTime: '',
        featured: false,
        imageUrl: '',
        videoUrl: '',
        imageAlt: ''
      })
      setShowForm(false)
      setEditingPost(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      readTime: post.readTime,
      featured: post.featured,
      imageUrl: post.imageUrl || '',
      videoUrl: post.videoUrl || '',
      imageAlt: post.imageAlt || ''
    })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const success = deletePost(postId)
      if (success) {
        reloadPosts()
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPost(null)
    setIsEditing(false)
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Software Architecture',
      tags: '',
      readTime: '',
      featured: false,
      imageUrl: '',
      videoUrl: '',
      imageAlt: ''
    })
  }

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

  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">Enter your password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium flex items-center justify-center space-x-2"
            >
              <Lock className="w-5 h-5" />
              <span>Login</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/blog"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-300"
            >
              ← Back to Blog
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-300"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Back to Blog</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowForm(true)
                  setIsEditing(false)
                  setFormData({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'Software Architecture',
                    tags: '',
                    readTime: '',
                    featured: false,
                    imageUrl: '',
                    videoUrl: '',
                    imageAlt: ''
                  })
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Post</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit Post' : 'Add New Post'}</h2>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your blog post content here..."
                />
              </div>

              {/* Image Link Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-5 h-5 text-green-500" />
                  <span>Image Link (Google Drive)</span>
                </label>
                
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="https://drive.google.com/file/d/..."
                />
                
                <p className="text-xs text-gray-500">
                  Paste your Google Drive image link here. Make sure the file is set to "Anyone with the link can view".
                </p>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h4>
                    <img
                      src={getGoogleDriveImageUrl(formData.imageUrl)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Image Alt Text */}
                {formData.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>
                )}
              </div>

              {/* Video Link Section */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-5 h-5 text-green-500" />
                  <span>Video Link (YouTube)</span>
                </label>
                
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                
                <p className="text-xs text-gray-500">
                  Paste your YouTube video link here. Supports standard YouTube URLs.
                </p>

                {/* Video Preview */}
                {formData.videoUrl && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h4>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={getYouTubeEmbedUrl(formData.videoUrl)}
                        className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="DDD, .NET, Architecture"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="8 min read"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured Post
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 font-medium"
                >
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? 'Update Post' : 'Add Post'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid gap-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">{post.category}</span>
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
