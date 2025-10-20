# Netlify Deployment Guide for Subdirectory

This guide will help you deploy your portfolio to `anantasutra.com/co-founder` using Netlify.

## Prerequisites
- Netlify account
- Your portfolio code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Build Settings in Netlify
When setting up your site in Netlify, use these settings:

- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Base directory**: Leave empty (or set to root if needed)

### 2. Redirects Configuration
The `public/_redirects` file is already configured to handle the subdirectory routing. This file will be automatically copied to the build output and Netlify will use it for routing.

### 3. Environment Variables (if needed)
If you plan to use GitHub API for image storage, add these environment variables in Netlify:
- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_REPO`: Your repository name (e.g., `username/portfolio-images`)
- `GITHUB_OWNER`: Your GitHub username

### 4. Custom Domain Setup
1. In Netlify dashboard, go to **Domain settings**
2. Add your custom domain: `anantasutra.com`
3. Configure DNS records as instructed by Netlify
4. The portfolio will be accessible at `anantasutra.com/co-founder`

### 5. Build Process
The configuration files ensure:
- ✅ Static export with `output: 'export'`
- ✅ Trailing slashes for consistency
- ✅ `_redirects` file for subdirectory routing
- ✅ Proper asset handling

### 6. Testing Locally
To test the subdirectory setup locally:

```bash
# Build the project
npm run build

# Serve the built files (you can use any static server)
npx serve out
```

Then visit `http://localhost:3000/co-founder` to test.

### 6. Routes That Will Work
- `anantasutra.com/co-founder/` - Main portfolio
- `anantasutra.com/co-founder/blog` - Blog page
- `anantasutra.com/co-founder/admin` - Admin panel

## Troubleshooting

### If images don't load:
- Check that `assetPrefix: '/co-founder'` is set in `next.config.js`
- Verify that image paths are relative

### If routing doesn't work:
- Ensure `netlify.toml` redirects are properly configured
- Check that `trailingSlash: true` is set

### If build fails:
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`

## File Structure After Build
```
out/
├── co-founder/
│   ├── index.html
│   ├── blog/
│   │   └── index.html
│   ├── admin/
│   │   └── index.html
│   └── _next/
│       └── static/
└── netlify.toml
```

## Next Steps
1. Push your code to your Git repository
2. Connect the repository to Netlify
3. Configure the build settings as mentioned above
4. Deploy and test at `anantasutra.com/co-founder`
