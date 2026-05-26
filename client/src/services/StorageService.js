import AppConfig from '../app.config.js';
import logger from './Logger.js';

class StorageService {
  constructor() {
    this.storage = localStorage;
  }

  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      this.storage.setItem(key, serialized);
      logger.info(`Storage: saved key "${key}"`);
    } catch (error) {
      logger.error(`Storage: failed to save key "${key}"`, error);
    }
  }

  load(key) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return null;
      logger.info(`Storage: loaded key "${key}"`);
      return JSON.parse(item);
    } catch (error) {
      logger.error(`Storage: failed to load key "${key}"`, error);
      return null;
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
      logger.info(`Storage: removed key "${key}"`);
    } catch (error) {
      logger.error(`Storage: failed to remove key "${key}"`, error);
    }
  }

  clear() {
    try {
      this.storage.clear();
      logger.info('Storage: cleared all data');
    } catch (error) {
      logger.error('Storage: failed to clear', error);
    }
  }
}

const storageService = new StorageService();
export default storageService;