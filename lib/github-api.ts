// GitHub API integration for image uploads
// This file contains the actual GitHub API implementation

export interface GitHubFileUpload {
  message: string
  content: string // base64 encoded content
  branch: string
}

export interface GitHubApiResponse {
  content: {
    download_url: string
    html_url: string
  }
}

// GitHub API configuration
const GITHUB_API_CONFIG = {
  baseUrl: 'https://api.github.com',
  owner: 'bhavyaduneja', // Your GitHub username
  repo: 'portfolio-images', // Repository for storing images
  branch: 'main',
  token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE' // You'll need to set this
}

// Convert blob to base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // Remove data:image/jpeg;base64, prefix
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Upload file to GitHub using API
export const uploadFileToGitHub = async (
  content: string, // base64 encoded content
  filename: string,
  path: string = 'images'
): Promise<{ url: string; success: boolean; error?: string }> => {
  try {
    if (!GITHUB_API_CONFIG.token) {
      throw new Error('GitHub token not configured. Please set NEXT_PUBLIC_GITHUB_TOKEN environment variable.')
    }

    const uploadData: GitHubFileUpload = {
      message: `Add image: ${filename}`,
      content,
      branch: GITHUB_API_CONFIG.branch
    }

    const response = await fetch(
      `${GITHUB_API_CONFIG.baseUrl}/repos/${GITHUB_API_CONFIG.owner}/${GITHUB_API_CONFIG.repo}/contents/${path}/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_API_CONFIG.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(uploadData)
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`GitHub API error: ${errorData.message || 'Upload failed'}`)
    }

    const result: GitHubApiResponse = await response.json()
    
    return {
      url: result.content.download_url,
      success: true
    }
  } catch (error) {
    console.error('GitHub upload error:', error)
    return {
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Upload both thumbnail and full image to GitHub
export const uploadDualImagesToGitHub = async (
  thumbnailBlob: Blob,
  fullImageBlob: Blob,
  filename: string
): Promise<{ thumbnailUrl: string; fullImageUrl: string; success: boolean; error?: string }> => {
  try {
    // Convert blobs to base64
    const thumbnailBase64 = await blobToBase64(thumbnailBlob)
    const fullImageBase64 = await blobToBase64(fullImageBlob)
    
    // Generate filenames
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const baseFilename = filename.split('.')[0]
    const extension = filename.split('.').pop() || 'jpg'
    
    const thumbnailFilename = `${baseFilename}-thumb-${timestamp}-${randomString}.${extension}`
    const fullImageFilename = `${baseFilename}-full-${timestamp}-${randomString}.${extension}`
    
    // Upload thumbnail
    const thumbnailResult = await uploadFileToGitHub(thumbnailBase64, thumbnailFilename, 'thumbnails')
    if (!thumbnailResult.success) {
      throw new Error(thumbnailResult.error || 'Thumbnail upload failed')
    }
    
    // Upload full image
    const fullImageResult = await uploadFileToGitHub(fullImageBase64, fullImageFilename, 'full-images')
    if (!fullImageResult.success) {
      throw new Error(fullImageResult.error || 'Full image upload failed')
    }
    
    return {
      thumbnailUrl: thumbnailResult.url,
      fullImageUrl: fullImageResult.url,
      success: true
    }
  } catch (error) {
    console.error('Dual GitHub upload error:', error)
    return {
      thumbnailUrl: '',
      fullImageUrl: '',
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Check if GitHub token is configured
export const isGitHubConfigured = (): boolean => {
  return !!GITHUB_API_CONFIG.token
}

// Get GitHub repository URL for manual setup
export const getGitHubRepoUrl = (): string => {
  return `https://github.com/${GITHUB_API_CONFIG.owner}/${GITHUB_API_CONFIG.repo}`
}
