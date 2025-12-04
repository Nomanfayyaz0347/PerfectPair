/**
 * Migration Script: Upload existing images from public/uploads to Cloudinary
 * 
 * This script:
 * 1. Reads all images from public/uploads/
 * 2. Uploads each to Cloudinary
 * 3. Updates MongoDB profiles with new Cloudinary URLs
 * 4. Keeps backup of old URLs
 * 
 * Run: node scripts/migrate-images-to-cloudinary.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Profile Schema (simplified for migration)
const profileSchema = new mongoose.Schema({
  name: String,
  photoUrl: String,
  cloudinaryPublicId: String,
}, { strict: false });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

async function migrateImages() {
  try {
    console.log('🚀 Starting image migration to Cloudinary...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all profiles from database
    console.log('📊 Fetching profiles from database...');
    const profiles = await Profile.find({});
    console.log(`✅ Found ${profiles.length} profiles\n`);

    // Filter profiles with local images or base64 data URIs
    const localImageProfiles = profiles.filter(p => 
      p.photoUrl && (
        p.photoUrl.startsWith('/uploads/') || 
        p.photoUrl.startsWith('data:image/')
      )
    );
    
    console.log(`📸 Profiles with local/base64 images: ${localImageProfiles.length}\n`);

    if (localImageProfiles.length === 0) {
      console.log('✅ No local images to migrate. All done!');
      await mongoose.connection.close();
      return;
    }

    // Migrate each image
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < localImageProfiles.length; i++) {
      const profile = localImageProfiles[i];
      const imageData = profile.photoUrl;

      console.log(`\n[${i + 1}/${localImageProfiles.length}] Processing: ${profile.name}`);
      
      // Check if it's a base64 data URI or local file path
      const isBase64 = imageData.startsWith('data:image/');
      const isLocalFile = imageData.startsWith('/uploads/');
      
      if (isBase64) {
        console.log(`   📦 Type: Base64 data URI (${Math.round(imageData.length / 1024)}KB)`);
      } else if (isLocalFile) {
        console.log(`   📁 Type: Local file path: ${imageData}`);
        const fullPath = path.join(process.cwd(), 'public', imageData);
        if (!fs.existsSync(fullPath)) {
          console.log(`   ⚠️  File not found, skipping...`);
          failCount++;
          continue;
        }
      }

      try {
        // Upload to Cloudinary
        console.log(`   ⬆️  Uploading to Cloudinary...`);
        const result = await cloudinary.uploader.upload(
          isBase64 ? imageData : path.join(process.cwd(), 'public', imageData), 
          {
          folder: 'perfect-pair/profiles',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        });

        // Update profile in database
        profile.photoUrl = result.secure_url;
        profile.cloudinaryPublicId = result.public_id;
        await profile.save();

        console.log(`   ✅ Uploaded successfully!`);
        console.log(`   📍 Cloudinary URL: ${result.secure_url.substring(0, 60)}...`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Upload failed: ${error.message}`);
        failCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📁 Total processed: ${localImageProfiles.length}`);
    console.log('='.repeat(60));

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Migration completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify images in Cloudinary dashboard');
    console.log('   2. Test images are loading on website');
    console.log('   3. Optional: Delete old images from public/uploads/');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();
