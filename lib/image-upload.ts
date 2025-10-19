// Image upload utility using Vercel Blob
import { put } from '@vercel/blob'

export interface ImageUploadResult {
  url: string
  success: boolean
  error?: string
}

// Upload image to Vercel Blob
export const uploadImage = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate file
    if (!file) {
      return { url: '', success: false, error: 'No file provided' }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { url: '', success: false, error: 'File too large. Maximum size is 5MB.' }
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { url: '', success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `blog-${timestamp}-${randomString}.${extension}`

    // Upload via API route
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: file
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()

    return {
      url: result.url,
      success: true
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Optimize image for web display
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url) return ''
  
  // Vercel Blob provides automatic optimization
  // You can add query parameters for specific sizes
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  
  // Add quality parameter for better compression
  params.set('q', '80')
  
  const queryString = params.toString()
  return queryString ? `${url}?${queryString}` : url
}

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (url: string) => {
  return {
    thumbnail: getOptimizedImageUrl(url, 300, 200), // For cards
    medium: getOptimizedImageUrl(url, 600, 400),    // For blog post header
    large: getOptimizedImageUrl(url, 1200, 800),   // For full-width display
    original: url
  }
}

// Validate image before upload
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' }
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
  }

  return { valid: true }
}
