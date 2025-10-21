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

- **`anantasutra.com/`** → Shows construction page
- **`anantasutra.com/co-founder`** → Shows portfolio (via `_redirects` file)
- **`anantasutra.com/co-founder/blog`** → Shows blog
- **`anantasutra.com/co-founder/admin`** → Shows admin

## File Structure

```
out/ (after build)
├── index.html          # Construction page (root)
├── portfolio.html      # Portfolio (served at /co-founder)
├── blog/
│   └── index.html      # Blog page
├── admin/
│   └── index.html      # Admin page
├── _redirects          # Netlify redirects
└── _next/              # Static assets
```

## Why This Setup?

1. **Root (`/`)** shows construction page - not the portfolio
2. **Portfolio (`/co-founder`)** shows your portfolio
3. **Development** - you can test the portfolio directly at `localhost:3000`
4. **Production** - Netlify redirects handle the subdirectory routing

## Testing the Build

```bash
npm run build
```

This will:
1. Build the Next.js app
2. Rename `index.html` to `portfolio.html` 
3. Copy construction page to `index.html`
4. Create proper `_redirects` file

The result is ready for Netlify deployment!

