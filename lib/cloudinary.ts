import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

/**
 * Extract public ID from Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 * Returns: sample
 */
export function extractPublicId(url: string): string | null {
  if (!url) return null;
  
  try {
    // Match pattern: /upload/v{version}/{public_id}.{extension}
    // or /upload/{public_id}.{extension}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(url: string): Promise<boolean> {
  if (!url) return true;
  
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn('Could not extract public ID from URL:', url);
    return false;
  }

  try {
    // Determine resource type (image or video)
    const isVideo = url.includes('/video/');
    const resourceType = isVideo ? 'video' : 'image';
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    
    console.log(`Deleted ${resourceType} from Cloudinary:`, publicId, result);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

/**
 * Delete multiple files from Cloudinary
 */
export async function deleteMultipleFromCloudinary(urls: string[]): Promise<void> {
  const deletePromises = urls.filter(url => url).map(url => deleteFromCloudinary(url));
  await Promise.all(deletePromises);
}
