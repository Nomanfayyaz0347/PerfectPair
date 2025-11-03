// Copy paste this code in browser console to clear shared count
// Browser console mein ye code paste karo shared count clear karne ke liye

// Method 1: Clear specific profile shared count
// Specific profile ka shared count clear karo
const profileId = '6908707fe0de6b4fa6d318d1'; // Replace with your profile ID
localStorage.removeItem(`shared_count_${profileId}`);
console.log('✅ Shared count cleared for profile:', profileId);

// Method 2: Clear all shared data (recommended)
// Saara shared data clear karo (recommended)
Object.keys(localStorage)
  .filter(key => key.startsWith('shared_') || key.startsWith('shared_count_'))
  .forEach(key => {
    localStorage.removeItem(key);
    console.log('🗑️ Removed:', key);
  });

console.log('✅ All shared data cleared!');
console.log('🔄 Refresh page to see updated count');

// Method 3: Check what's currently stored
// Check karo kya stored hai currently  
console.log('📊 Current shared data in localStorage:');
Object.keys(localStorage)
  .filter(key => key.startsWith('shared_'))
  .forEach(key => {
    console.log(`${key}: ${localStorage.getItem(key)}`);
  });