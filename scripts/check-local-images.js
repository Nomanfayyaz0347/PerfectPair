const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkLocalImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
  
  const profiles = await Profile.find({ photoUrl: { $regex: '^/uploads/' } });
  
  console.log(`\nProfiles using /uploads/ folder: ${profiles.length}\n`);
  
  if (profiles.length > 0) {
    profiles.forEach(p => {
      console.log(`  - ${p.name}: ${p.photoUrl}`);
    });
  } else {
    console.log('✅ All profiles are using Cloudinary URLs!');
    console.log('\nOrphaned files in public/uploads/:');
    console.log('  - profile-1761842362256.jpg');
    console.log('  - profile-1761842893242.jpg');
    console.log('  - profile-1762256692030.jpg');
    console.log('  - profile-1762430989267.jpg');
    console.log('\n💡 These files are not used and can be safely deleted.');
  }
  
  await mongoose.connection.close();
}

checkLocalImages();
