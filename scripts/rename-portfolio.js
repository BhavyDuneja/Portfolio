const fs = require('fs');
const path = require('path');

// This script renames the Next.js built index.html to portfolio.html
// and copies the construction page to the root

const outDir = path.join(__dirname, '..', 'out');
const publicDir = path.join(__dirname, '..', 'public');
const portfolioIndexPath = path.join(outDir, 'index.html');
const newPortfolioPath = path.join(outDir, 'portfolio.html');
const constructionPagePath = path.join(publicDir, 'index.html');
const rootIndexPath = path.join(outDir, 'index.html');

console.log('🔄 Setting up deployment structure...');

// Rename portfolio index.html to portfolio.html
if (fs.existsSync(portfolioIndexPath)) {
  fs.renameSync(portfolioIndexPath, newPortfolioPath);
  console.log('✅ Portfolio index.html renamed to portfolio.html');
} else {
  console.log('❌ Portfolio index.html not found');
}

// Copy construction page to root
if (fs.existsSync(constructionPagePath)) {
  fs.copyFileSync(constructionPagePath, rootIndexPath);
  console.log('✅ Construction page copied to root');
} else {
  console.log('❌ Construction page not found in public/index.html');
}

console.log('📂 Final structure:');
console.log('   / (root) -> Construction page (index.html)');
console.log('   /co-founder -> Portfolio (portfolio.html)');
console.log('   /co-founder/blog -> Portfolio blog');
console.log('   /co-founder/admin -> Portfolio admin');
