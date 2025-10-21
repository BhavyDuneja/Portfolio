# Development Guide

## Testing the Portfolio Locally

### Option 1: Test Portfolio Directly (Recommended)
```bash
npm run dev
```
Then visit: `http://localhost:3000`

This shows your portfolio directly, which is what will be served at `anantasutra.com/co-founder` in production.

### Option 2: Test with Subdirectory Simulation
```bash
npm run dev
```
Then visit: `http://localhost:3000/co-founder`

This will redirect to the main portfolio (this is handled by the redirect page we created).

## Production Deployment

In production (Netlify), the routing works as follows:

- **`anantasutra.com/`** → Shows main Anantasutra website
- **`anantasutra.com/services`** → Shows services page
- **`anantasutra.com/testimonials`** → Shows projects & testimonials page
- **`anantasutra.com/co-founder`** → Shows portfolio
- **`anantasutra.com/contact`** → Shows contact page

## File Structure

```
out/ (after build)
├── index.html          # Main Anantasutra website (root)
├── services/
│   └── index.html      # Services page
├── testimonials/
│   └── index.html      # Projects & testimonials page
├── co-founder/
│   └── index.html      # Portfolio page
├── contact/
│   └── index.html      # Contact page
├── _redirects          # Netlify redirects
└── _next/              # Static assets
```

## Why This Setup?

1. **Root (`/`)** shows main Anantasutra website
2. **Portfolio (`/co-founder`)** shows your portfolio
3. **Development** - you can test the website directly at `localhost:3000`
4. **Production** - Netlify redirects handle the subdirectory routing

## Testing the Build

```bash
npm run build
```

This will:
1. Build the Next.js app
2. Serve main Anantasutra website at root
3. Create proper `_redirects` file

The result is ready for Netlify deployment!

