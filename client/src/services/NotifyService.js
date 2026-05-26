import logger from './Logger.js';

class NotifyService {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    logger.info('NotifyService: new listener subscribed');
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
    logger.info('NotifyService: listener unsubscribed');
  }

  notify(type, message) {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    this.listeners.forEach(listener => listener(notification));
    logger.info(`NotifyService: notification sent - ${type}: ${message}`);
  }

  success(message) {
    this.notify('success', message);
  }

  error(message) {
    this.notify('error', message);
  }

  warning(message) {
    this.notify('warning', message);
  }

  info(message) {
    this.notify('info', message);
  }
}

const notifyService = new NotifyService();
export default notifyService;