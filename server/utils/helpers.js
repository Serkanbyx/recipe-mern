import cloudinary from '../config/cloudinary.js';

/**
 * Escapes special regex characters in a string to prevent ReDoS attacks.
 * @param {string} string - The input string to escape.
 * @returns {string} The escaped string safe for use in RegExp.
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * Fails silently to avoid blocking the main operation.
 */
export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};
