const fs = require('fs');
const path = require('path');

/**
 * Deletes uploaded files from the server in case of failure.
 * @param {Array} files - Array of multer file objects.
 */
const cleanupUploadedFiles = async (files) => {
  if (files) {
    for (const file of files) {
      let filePath = path.join(__dirname, '..', file.path.replace(/\\/g, '/')); // Normalize the file path

      if (filePath) {
        try {
          console.log('Attempting to delete file:', filePath);
          await fs.promises.unlink(filePath);
          console.log('Successfully deleted file:', filePath);
        } catch (err) {
          console.error('Failed to delete file during cleanup:', filePath, err.message);
        }
      }
    }
  } else {
    console.log('No files to clean up.');
  }
};

module.exports = cleanupUploadedFiles;