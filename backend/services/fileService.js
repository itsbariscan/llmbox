const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class FileService {
  constructor() {
    this.uploadsDir = 'uploads';
    this.ensureUploadsDir();
  }

  async ensureUploadsDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir);
    }
  }

  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      logger.error('File read error:', error);
      throw new AppError('Failed to read file', 500);
    }
  }

  async readFileAsBase64(filePath) {
    try {
      const buffer = await fs.readFile(filePath);
      return buffer.toString('base64');
    } catch (error) {
      logger.error('File read error:', error);
      throw new AppError('Failed to read file', 500);
    }
  }

  async writeFile(fileName, content) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      await fs.writeFile(filePath, content);
      return filePath;
    } catch (error) {
      logger.error('File write error:', error);
      throw new AppError('Failed to write file', 500);
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error('File delete error:', error);
      // Don't throw error for delete failures
    }
  }

  async cleanupOldFiles(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    try {
      const files = await fs.readdir(this.uploadsDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = await fs.stat(filePath);
        const age = now - stats.mtime.getTime();

        if (age > maxAge) {
          await this.deleteFile(filePath);
        }
      }
    } catch (error) {
      logger.error('Cleanup error:', error);
    }
  }

  getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  async saveUploadedFile(file) {
    try {
      const filePath = path.join(this.uploadsDir, file.filename);
      await fs.rename(file.path, filePath);
      return filePath;
    } catch (error) {
      logger.error('File save error:', error);
      throw new AppError('Failed to save uploaded file', 500);
    }
  }
}

module.exports = new FileService();