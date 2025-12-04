# Cloudinary Integration Guide

## 🎯 Overview
PerfectPair now uses **Cloudinary** for image hosting instead of local file storage. This provides:
- ✅ CDN delivery for faster loading
- ✅ Automatic image optimization (WebP, quality, size)
- ✅ Transformations on-the-fly
- ✅ Better scalability for production
- ✅ No storage issues on Vercel/hosting platforms

---

## 🚀 Setup Instructions

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com/users/register_free)
2. Sign up for **free** (25 GB storage, 25 GB bandwidth/month)
3. Verify your email

### 2. Get Your Credentials
1. Log in to Cloudinary Dashboard
2. Navigate to **Dashboard** → **Product Environment Credentials**
3. Copy these values:
   - **Cloud Name** (e.g., `dxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Configure Environment Variables

Add to your `.env.local` file:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**For Vercel Deployment:**
1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Add all three Cloudinary variables
4. Redeploy

---

## 📁 File Structure

```
src/
├── lib/
│   └── cloudinary.ts          # Cloudinary utilities
├── app/
│   └── api/
│       └── upload/
│           └── route.ts       # Upload endpoint (now uses Cloudinary)
│       └── profiles/
│           └── [id]/
│               └── delete/
│                   └── route.ts  # Deletes from Cloudinary too
└── models/
    └── Profile.ts            # Added cloudinaryPublicId field
```

---

## 🔧 Features

### Image Upload
- **Max size:** 5MB
- **Formats:** JPG, JPEG, PNG, WebP
- **Auto transformations:**
  - Max dimensions: 800x800px
  - Quality: auto (optimized)
  - Format: auto (WebP when supported)

### Image Storage
Images are organized in Cloudinary folders:
```
perfect-pair/
└── profiles/
    ├── profile-1234567890.jpg
    ├── profile-1234567891.jpg
    └── ...
```

### Profile Deletion
When a profile is deleted:
1. ✅ Image deleted from Cloudinary
2. ✅ Profile record deleted from database
3. ✅ No orphaned images

---

## 📊 API Changes

### Upload Response
**Before:**
```json
{
  "photoUrl": "/uploads/profile-1234567890.jpg"
}
```

**Now:**
```json
{
  "photoUrl": "https://res.cloudinary.com/xxx/image/upload/v1234567890/perfect-pair/profiles/profile-1234567890.jpg",
  "publicId": "perfect-pair/profiles/profile-1234567890"
}
```

### Profile Model
Added field:
```typescript
cloudinaryPublicId?: string;  // For deletion tracking
```

---

## 🎨 Image Optimization

### Automatic Transformations
All uploaded images are automatically:
- Resized to max 800x800px
- Compressed with quality optimization
- Converted to WebP (when browser supports)
- Served via CDN

### Custom Transformations
Use the `getOptimizedImageUrl()` helper:
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const thumbnailUrl = getOptimizedImageUrl(publicId, 200, 200);
// Returns optimized 200x200 thumbnail
```

---

## 🆓 Free Tier Limits
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **Admin API calls:** 500/hour

**Sufficient for:**
- ~25,000+ profile images
- Thousands of daily visitors
- Most matchmaking applications

---

## 🔄 Migration from Local Storage

### Old Images (in `public/uploads/`)
- Still work (backward compatible)
- New uploads use Cloudinary
- Can manually migrate old images if needed

### Manual Migration Script (Optional)
```typescript
// scripts/migrate-to-cloudinary.ts
// Can be created if needed to migrate existing images
```

---

## 🧪 Testing

### Local Development
```bash
npm run dev
```

### Upload Test
1. Go to `/form` or `/admin`
2. Upload a profile image
3. Check Cloudinary Media Library
4. Verify image appears in `perfect-pair/profiles/` folder

### Delete Test
1. Delete a profile from admin
2. Check Cloudinary Media Library
3. Verify image was removed

---

## 🐛 Troubleshooting

### "Upload failed" error
- ✅ Check `.env.local` has all 3 Cloudinary variables
- ✅ Verify credentials are correct
- ✅ Restart dev server after adding env variables

### Images not loading
- ✅ Check browser console for CORS errors
- ✅ Verify Cloudinary cloud name is correct
- ✅ Check if image exists in Cloudinary dashboard

### Production deployment issues
- ✅ Add env variables to Vercel dashboard
- ✅ Redeploy after adding variables
- ✅ Check deployment logs

---

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)

---

## ✅ Benefits

| Feature | Local Storage | Cloudinary |
|---------|--------------|------------|
| CDN Delivery | ❌ | ✅ |
| Auto Optimization | ❌ | ✅ |
| Transformations | ❌ | ✅ |
| Scalability | Limited | Unlimited |
| Vercel Compatible | ❌ | ✅ |
| Backup | Manual | Automatic |

---

**Status:** ✅ Cloudinary integration complete and tested!
