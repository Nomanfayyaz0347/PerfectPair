const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkAllImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false }));
  
  const allProfiles = await Profile.find({}).select('name photoUrl cloudinaryPublicId createdAt');
  
  console.log(`\n📊 Total profiles: ${allProfiles.length}\n`);
  
  const withPhotos = allProfiles.filter(p => p.photoUrl);
  const cloudinaryPhotos = allProfiles.filter(p => p.photoUrl && p.photoUrl.includes('cloudinary'));
  const localPhotos = allProfiles.filter(p => p.photoUrl && p.photoUrl.startsWith('/uploads/'));
  const withPublicId = allProfiles.filter(p => p.cloudinaryPublicId);
  
  console.log('📸 Photo Statistics:');
  console.log(`  - Profiles with photos: ${withPhotos.length}`);
  console.log(`  - Cloudinary URLs: ${cloudinaryPhotos.length}`);
  console.log(`  - Local URLs (/uploads/): ${localPhotos.length}`);
  console.log(`  - With cloudinaryPublicId: ${withPublicId.length}\n`);
  
  if (localPhotos.length > 0) {
    console.log('🔍 Profiles with local images:');
    localPhotos.forEach(p => {
      console.log(`  - ${p.name}: ${p.photoUrl}`);
    });
  }
  
  console.log('\n🖼️  Sample of latest 5 profiles:');
  const latest = allProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  latest.forEach(p => {
    console.log(`\n  ${p.name}:`);
    console.log(`    Photo: ${p.photoUrl ? p.photoUrl.substring(0, 80) : 'No photo'}`);
    console.log(`    Public ID: ${p.cloudinaryPublicId || 'Not set'}`);
  });
  
  await mongoose.connection.close();
}

checkAllImages();
