import { v2 as cloudinary } from 'cloudinary';
import logger from '../logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

/**
 * Upload an image to Cloudinary
 * @param filePath - Path to the local image file
 * @param folder - Cloudinary folder to store the image
 * @returns Object with secure_url and public_id
 */
export async function uploadImage(filePath: string, folder: string = 'tienda-prado') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Resize large images
        { quality: 'auto', fetch_format: 'auto' }   // Auto-optimize quality and format
      ]
    });

    logger.info(`Image uploaded to Cloudinary: ${result.secure_url}`);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error: any) {
    logger.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
    return {
      success: true,
      result
    };
  } catch (error: any) {
    logger.error('Error deleting image from Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 */
export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
} = {}) {
  const transformations = [];
  
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  // Always auto-optimize
  transformations.push('f_auto', 'q_auto');
  
  const transformationString = transformations.join(',');
  return cloudinary.url(publicId, {
    transformation: [transformationString]
  });
}

/**
 * Upload base64 image data (from form uploads)
 * @param base64Data - Base64 encoded image string
 * @param folder - Cloudinary folder
 */
export async function uploadBase64Image(base64Data: string, folder: string = 'tienda-prado') {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    logger.info(`Base64 image uploaded to Cloudinary: ${result.secure_url}`);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error: any) {
    logger.error('Error uploading base64 image to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default cloudinary;
