import AppConfig from '../app.config.js';
import logger from './Logger.js';

class ConfigService {
  constructor() {
    this.config = { ...AppConfig };
  }

  get(key) {
    const value = this.config[key];
    logger.info(`ConfigService: get "${key}"`, value);
    return value;
  }

  set(key, value) {
    this.config[key] = value;
    logger.info(`ConfigService: set "${key}"`, value);
  }

  getRole() {
    return this.config.roles;
  }

  getExamStatus() {
    return this.config.examStatus;
  }

  getStorageKeys() {
    return this.config.storageKeys;
  }

  getMinPassScore() {
    return this.config.minPassScore;
  }

  getMaxExamDuration() {
    return this.config.maxExamDuration;
  }
}

const configService = new ConfigService();
export default configService;