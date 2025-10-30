## 🐛 **Debug Steps - Photo Upload Issue:**

### **Test Checklist:**

1. **Photo Upload Test:**
   - Go to http://localhost:3000/form
   - Select a photo (check console for logs)
   - Should see preview image
   - Submit form and check console logs

2. **Console Logs to Check:**
   ```
   Photo URL: /uploads/profile-xxxxx.jpg
   Submitting profile data: { ...data, photoUrl: '/uploads/...' }
   ```

3. **Admin Dashboard Test:**
   - Go to http://localhost:3000/admin
   - Check if photos appear in table
   - Click profile to see modal with photo

### **Common Issues & Fixes:**

**Issue 1: Photo not uploading**
- Check browser Network tab for upload request
- Verify uploads folder exists: `public/uploads/`

**Issue 2: Photo URL not in database**
- Check console logs during form submission
- Verify Profile model includes photoUrl field

**Issue 3: Photos not showing in admin**
- Check browser Console for image load errors
- Verify image path is correct: `/uploads/filename.jpg`

### **Quick Test Commands:**

```bash
# Check if uploads folder exists
ls public/uploads/

# Check recent uploads
ls -la public/uploads/ | tail -5

# Start dev server with logs
npm run dev
```

### **Debug Form Submission:**

1. Open browser dev tools (F12)
2. Go to Console tab
3. Go to Network tab
4. Submit form with photo
5. Check for these requests:
   - POST `/api/upload` (should return photoUrl)
   - POST `/api/profiles` (should include photoUrl in body)
