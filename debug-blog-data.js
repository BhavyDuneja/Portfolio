// Debug script to check blog data in localStorage
// Run this in browser console

console.log('=== Blog Data Debug ===');
const blogPosts = localStorage.getItem('blogPosts');
if (blogPosts) {
  const posts = JSON.parse(blogPosts);
  console.log('Total posts:', posts.length);
  posts.forEach((post, index) => {
    console.log(`Post ${index + 1}:`, {
      id: post.id,
      title: post.title,
      hasThumbnail: !!post.thumbnailUrl,
      hasFullImage: !!post.fullImageUrl,
      thumbnailUrl: post.thumbnailUrl ? post.thumbnailUrl.substring(0, 50) + '...' : 'No thumbnail',
      fullImageUrl: post.fullImageUrl ? post.fullImageUrl.substring(0, 50) + '...' : 'No full image',
      imageAlt: post.imageAlt
    });
  });
} else {
  console.log('No blog posts found in localStorage');
}

// Check if there are any broken image URLs
const posts = blogPosts ? JSON.parse(blogPosts) : [];
posts.forEach((post, index) => {
  if (post.thumbnailUrl && post.thumbnailUrl.includes('blob:')) {
    console.log(`Post ${index + 1} has blob URL (may be expired):`, post.thumbnailUrl);
  }
});
