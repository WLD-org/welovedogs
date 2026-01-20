# Storage Buckets Setup

This document explains how to set up Supabase Storage buckets for the We Love Dogs application.

## Required Storage Buckets

The application requires the following storage buckets:

1. **`profile-photos`** - User profile photos (public, 5MB limit)
2. **`dog-images`** - Dog profile images (public, 10MB limit)
3. **`campaign-updates`** - Campaign update images (public, 10MB limit)
4. **`expense-proofs`** - Expense proof documents (public, 5MB limit)

## Automatic Setup (Via Migration)

Storage buckets and policies have been created via migration. However, you may need to verify they exist in your Supabase project.

## Manual Setup (If Needed)

If the buckets don't exist, create them via Supabase Dashboard:

### Via Supabase Dashboard

1. Go to your Supabase project Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** for each bucket:

#### 1. profile-photos

- **Name**: `profile-photos`
- **Public bucket**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### 2. dog-images

- **Name**: `dog-images`
- **Public bucket**: ✅ Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### 3. campaign-updates

- **Name**: `campaign-updates`
- **Public bucket**: ✅ Yes
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

#### 4. expense-proofs

- **Name**: `expense-proofs`
- **Public bucket**: ✅ Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`

### Storage Policies

Storage policies have been created via migration to allow:

- **Public read access** - Anyone can view images (for transparency)
- **Authenticated upload** - Only authenticated users can upload
- **Owner update/delete** - Users can manage their own files

## Verifying Buckets

To verify buckets exist, run:

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets;
```

You should see all 4 buckets listed.

## Troubleshooting

### Error: "Bucket not found"

- Verify buckets exist: Check Supabase Dashboard > Storage
- Ensure bucket names match exactly (case-sensitive)
- Check that the migration was applied: `npm run migrate`

### Error: "Permission denied"

- Verify storage policies were created
- Check that RLS is enabled on storage.objects
- Ensure user is authenticated when uploading

### Files not uploading

- Check file size is within limits
- Verify MIME type is allowed
- Ensure user is authenticated
- Check browser console for detailed error messages

## Testing Upload

To test if storage is working:

```typescript
const supabase = createClient();
const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

const { data, error } = await supabase.storage.from("profile-photos").upload("test/test.jpg", file);

if (error) {
  console.error("Upload error:", error);
} else {
  console.log("Upload successful:", data);
}
```
