'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Eye, Calendar, Tag, User, Clock, ArrowLeft, Upload, Image } from 'lucide-react'
import Link from 'next/link'
import { getAllPosts, addPost, updatePost, deletePost, savePosts, BlogPost } from '@/lib/storage'
import { uploadDualImages } from '@/lib/github-storage'
import { isGitHubConfigured } from '@/lib/github-api'

interface FormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string
  readTime: string
  featured: boolean
  thumbnailUrl: string
  fullImageUrl: string
  imageAlt: string
}

const AdminPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Software Architecture',
    tags: '',
    readTime: '',
    featured: false,
    thumbnailUrl: '',
    fullImageUrl: '',
    imageAlt: ''
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [githubConfigured, setGitHubConfigured] = useState(false)

  const categories = [
    'Software Architecture',
    'Cloud Computing', 
    'Career',
    'Web Development',
    'Startup and Finance',
    'Philosophy',
    'Cooking'
  ]

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load posts using the new storage system
  useEffect(() => {
    if (!isClient) return
    
    const allPosts = getAllPosts()
    setGitHubConfigured(isGitHubConfigured())
    if (allPosts.length === 0) {
      // Initialize with default posts
      const defaultPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Building Scalable .NET Applications with Domain-Driven Design',
          excerpt: 'Learn how to implement DDD principles in .NET applications to create maintainable and scalable software architectures.',
          content: 'Domain-Driven Design (DDD) is a software development approach that focuses on creating software that reflects a deep understanding of the business domain...',
          author: 'Bhavya Duneja',
          date: '2024-12-15',
          readTime: '8 min read',
          category: 'Software Architecture',
          tags: ['DDD', '.NET', 'C#', 'Architecture', 'Clean Code'],
          featured: true
        }
      ]
      setPosts(defaultPosts)
      savePosts(defaultPosts)
    } else {
      setPosts(allPosts)
    }
  }, [isClient])

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('blogPosts', JSON.stringify(posts))
    }
  }, [posts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
      thumbnailUrl: formData.thumbnailUrl,
      fullImageUrl: formData.fullImageUrl,
      imageAlt: formData.imageAlt
    }

    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = updatePost(editingPost.id, postData)
        if (updatedPost) {
          const allPosts = getAllPosts()
          setPosts(allPosts)
        }
      } else {
        // Create new post
        const newPost = addPost(postData)
        const allPosts = getAllPosts()
        setPosts(allPosts)
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
        thumbnailUrl: '',
        fullImageUrl: '',
        imageAlt: ''
      })
      setSelectedImage(null)
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
      thumbnailUrl: post.thumbnailUrl || '',
      fullImageUrl: post.fullImageUrl || '',
      imageAlt: post.imageAlt || ''
    })
    setShowForm(true)
    setIsEditing(true)
  }

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const success = deletePost(postId)
      if (success) {
        const allPosts = getAllPosts()
        setPosts(allPosts)
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
      thumbnailUrl: '',
      fullImageUrl: '',
      imageAlt: ''
    })
    setSelectedImage(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 20MB.')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    setUploading(true)
    setSelectedImage(file)

    try {
      console.log('Starting image upload process...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })

      // Convert image to base64 for persistent storage
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            console.log('Base64 conversion successful')
            resolve(reader.result as string)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      // Create thumbnail (compressed) and full image
      const createThumbnail = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new window.Image()
          
          img.onload = () => {
            try {
              console.log('Image loaded for thumbnail creation:', {
                originalWidth: img.width,
                originalHeight: img.height
              })

              // Set thumbnail size (max 400px width)
              const maxWidth = 400
              const maxHeight = 300
              let { width, height } = img
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
              
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }
              
              canvas.width = width
              canvas.height = height
              
              // Draw and compress
              ctx?.drawImage(img, 0, 0, width, height)
              canvas.toBlob((blob) => {
                if (blob) {
                  const reader = new FileReader()
                  reader.onload = () => resolve(reader.result as string)
                  reader.readAsDataURL(blob)
                } else {
                  reject(new Error('Canvas toBlob failed'))
                }
              }, 'image/jpeg', 0.7)
            } catch (error) {
              console.error('Error creating thumbnail:', error)
              reject(error)
            }
          }
          img.onerror = (error) => {
            console.error('Error loading image:', error)
            reject(error)
          }
          const reader = new FileReader()
          reader.onload = () => {
            img.src = reader.result as string
          }
          reader.readAsDataURL(file)
        })
      }

      const [thumbnailUrl, fullImageUrl] = await Promise.all([
        createThumbnail(file),
        convertToBase64(file)
      ])
      
      console.log('Image processing completed successfully')
      
      setFormData(prev => ({
        ...prev,
        thumbnailUrl: thumbnailUrl,
        fullImageUrl: fullImageUrl,
        imageAlt: file.name.split('.')[0] // Use filename as default alt text
      }))

      console.log('Image uploaded successfully:', {
        thumbnailUrl: thumbnailUrl.substring(0, 50) + '...',
        fullImageUrl: fullImageUrl.substring(0, 50) + '...',
        imageAlt: file.name.split('.')[0]
      })

      // Try GitHub upload if configured, but don't block on it
      if (githubConfigured) {
        try {
          const result = await uploadDualImages(file)
          
          if (result.success) {
            setFormData(prev => ({
              ...prev,
              thumbnailUrl: result.thumbnailUrl || prev.thumbnailUrl,
              fullImageUrl: result.fullImageUrl || prev.fullImageUrl,
            }))
          }
        } catch (error) {
          console.log('GitHub upload failed, using local preview:', error)
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
      {/* Debug Panel - Remove in production */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Admin Debug Info</h3>
            <p className="text-xs text-yellow-600">
              Posts: {posts.length} | GitHub: {githubConfigured ? 'Configured' : 'Not configured'} | 
              Thumbnail: {formData.thumbnailUrl ? 'Yes' : 'No'} | Full: {formData.fullImageUrl ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => console.log('Form Data:', formData)}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Debug Form
            </button>
            <button
              onClick={() => {
                // Test with a simple image
                const canvas = document.createElement('canvas')
                canvas.width = 100
                canvas.height = 100
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  ctx.fillStyle = '#4ade80'
                  ctx.fillRect(0, 0, 100, 100)
                }
                canvas.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], 'test.png', { type: 'image/png' })
                    console.log('Test file created:', file)
                    // Simulate file input
                    const input = document.createElement('input')
                    input.type = 'file'
                    // Create a FileList-like object
                    const fileList = {
                      0: file,
                      length: 1,
                      item: (index: number) => index === 0 ? file : null,
                      [Symbol.iterator]: function* () {
                        yield file
                      }
                    } as FileList
                    input.files = fileList
                    handleImageUpload({ target: { files: fileList } } as React.ChangeEvent<HTMLInputElement>)
                  }
                })
              }}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
            >
              Test Upload
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/blog" 
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Blog</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
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
                  thumbnailUrl: '',
                  fullImageUrl: '',
                  imageAlt: ''
                })
                setSelectedImage(null)
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Post</span>
            </button>
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
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Full post content"
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                
                {/* Image Preview */}
                {(formData.thumbnailUrl || formData.fullImageUrl) && (
                  <div className="space-y-4">
                    {/* Thumbnail Preview */}
                    {formData.thumbnailUrl && (
                      <div className="relative">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thumbnail Preview (Blog List)</h4>
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    
                    {/* Full Image Preview */}
                    {formData.fullImageUrl && (
                      <div className="relative">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Full Image Preview (Blog Detail)</h4>
                        <img
                          src={formData.fullImageUrl}
                          alt="Full Image Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            thumbnailUrl: '', 
                            fullImageUrl: '', 
                            imageAlt: '' 
                          }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center space-y-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload image or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG, WebP up to 20MB</span>
                  </label>
                </div>

                {/* Image Alt Text */}
                {(formData.thumbnailUrl || formData.fullImageUrl) && (
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
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
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