import AppConfig from '../app.config.js';

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = null) {
    const entry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(entry);
    const style = level === AppConfig.logLevels.ERROR
      ? 'color: red'
      : level === AppConfig.logLevels.WARN
      ? 'color: orange'
      : 'color: blue';
    console.log(`%c[${level}] ${entry.timestamp} - ${message}`, style, data || '');
  }

  info(message, data = null) {
    this.log(AppConfig.logLevels.INFO, message, data);
  }

  warn(message, data = null) {
    this.log(AppConfig.logLevels.WARN, message, data);
  }

  error(message, data = null) {
    this.log(AppConfig.logLevels.ERROR, message, data);
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

const logger = new Logger();
export default logger;