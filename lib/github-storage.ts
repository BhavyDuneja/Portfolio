// GitHub-based image storage system
export interface GitHubImageResult {
  thumbnailUrl: string
  fullImageUrl: string
  success: boolean
  error?: string
}

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
}

// GitHub repository configuration
const GITHUB_CONFIG = {
  owner: 'bhavyaduneja', // Your GitHub username
  repo: 'portfolio-images', // Repository for storing images
  branch: 'main',
  baseUrl: 'https://raw.githubusercontent.com/bhavyaduneja/portfolio-images/main'
}

// Compress image for thumbnail (500KB-1MB target)
export const compressImageForThumbnail = (file: File, quality: number = 0.7): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate dimensions for thumbnail (max 800px width)
      const maxWidth = 800
      const maxHeight = 600
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
        resolve(blob || new Blob())
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Compress image for full display (5-10MB target)
export const compressImageForFull = (file: File, quality: number = 0.9): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Keep original dimensions but compress
      canvas.width = img.width
      canvas.height = img.height
      
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        resolve(blob || new Blob())
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Upload image to GitHub (simulated - you'll need GitHub API token)
export const uploadImageToGitHub = async (
  thumbnailBlob: Blob, 
  fullImageBlob: Blob, 
  filename: string
): Promise<GitHubImageResult> => {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const baseFilename = filename.split('.')[0]
    const extension = filename.split('.').pop() || 'jpg'
    
    const thumbnailFilename = `${baseFilename}-thumb-${timestamp}-${randomString}.${extension}`
    const fullImageFilename = `${baseFilename}-full-${timestamp}-${randomString}.${extension}`
    
    // For now, return mock URLs - you'll implement actual GitHub API calls
    const thumbnailUrl = `${GITHUB_CONFIG.baseUrl}/thumbnails/${thumbnailFilename}`
    const fullImageUrl = `${GITHUB_CONFIG.baseUrl}/full-images/${fullImageFilename}`
    
    // TODO: Implement actual GitHub API upload
    // This would involve:
    // 1. Convert blobs to base64
    // 2. Use GitHub API to create files
    // 3. Handle authentication with GitHub token
    
    return {
      thumbnailUrl,
      fullImageUrl,
      success: true
    }
  } catch (error) {
    console.error('GitHub upload error:', error)
    return {
      thumbnailUrl: '',
      fullImageUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Main upload function that handles both compressions
export const uploadDualImages = async (file: File): Promise<GitHubImageResult> => {
  try {
    // Validate file
    if (!file) {
      return { thumbnailUrl: '', fullImageUrl: '', success: false, error: 'No file provided' }
    }

    // Check file size (max 20MB for original)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return { thumbnailUrl: '', fullImageUrl: '', success: false, error: 'File too large. Maximum size is 20MB.' }
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { thumbnailUrl: '', fullImageUrl: '', success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
    }

    // Compress for thumbnail (500KB-1MB target)
    const thumbnailBlob = await compressImageForThumbnail(file, 0.7)
    
    // Compress for full image (5-10MB target)
    const fullImageBlob = await compressImageForFull(file, 0.9)
    
    // Upload both versions to GitHub
    const result = await uploadImageToGitHub(thumbnailBlob, fullImageBlob, file.name)
    
    return result
  } catch (error) {
    console.error('Dual image upload error:', error)
    return {
      thumbnailUrl: '',
      fullImageUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Get optimized image URLs for different use cases
export const getOptimizedImageUrl = (url: string, type: 'thumbnail' | 'full' = 'thumbnail'): string => {
  if (!url) return ''
  
  // For GitHub raw URLs, we can add query parameters for optimization
  if (type === 'thumbnail') {
    return `${url}?w=800&h=600&q=80` // GitHub doesn't support this, but good for future CDN
  }
  
  return url
}

// Generate responsive image URLs
export const getResponsiveImageUrls = (thumbnailUrl: string, fullImageUrl: string) => {
  return {
    thumbnail: getOptimizedImageUrl(thumbnailUrl, 'thumbnail'),
    full: getOptimizedImageUrl(fullImageUrl, 'full'),
    original: fullImageUrl
  }
}
