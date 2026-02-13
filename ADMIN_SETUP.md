# Admin Panel Setup Guide

## Overview
The admin panel allows you to create and manage blog posts with support for:
- **Images**: Google Drive links
- **Videos**: YouTube links

## Default Login
- **Default Password**: `admin123`
- **Location**: `/admin`

## Setting a Custom Password

### Option 1: Environment Variable (Recommended for Production)
Add to your `.env.local` file:
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

### Option 2: Programmatic (Development)
The password can be set programmatically using the `setAdminPassword` function in `lib/auth.ts`.

## Features

### Image Links (Google Drive)
1. Upload your image to Google Drive
2. Right-click the file → "Get link"
3. Make sure sharing is set to "Anyone with the link can view"
4. Copy the link and paste it in the "Image Link" field
5. The system will automatically convert it to a direct image URL

### Video Links (YouTube)
1. Copy any YouTube video URL (e.g., `https://www.youtube.com/watch?v=...`)
2. Paste it in the "Video Link" field
3. The system will automatically convert it to an embed URL
4. Supports standard YouTube URL formats

## Security Notes
- The default password is for development only
- **Always change the password in production** using environment variables
- Sessions expire after 24 hours
- Logout clears the session immediately

## Usage
1. Navigate to `/admin` or click "Admin Panel" on the blog page
2. Enter your password
3. Click "Add New Post" to create a blog post
4. Fill in the form:
   - Title, excerpt, content (required)
   - Category, tags, read time
   - Image link (Google Drive) - optional
   - Video link (YouTube) - optional
   - Featured checkbox
5. Click "Add Post" to save

## Blog Display
- Posts with videos will show an embedded YouTube player
- Posts with images will display the image from Google Drive
- Posts can have both image and video (image takes priority in list view)
