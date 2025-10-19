// Debug script to reset blog data
// Run this in browser console to clear localStorage and reload

console.log('Clearing blog data from localStorage...');
localStorage.removeItem('blogPosts');
console.log('localStorage cleared. Reloading page...');
window.location.reload();
