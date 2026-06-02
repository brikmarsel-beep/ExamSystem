import AppConfig from '../app.config.js';
import logger from '../services/Logger.js';
import storageService from '../services/StorageService.js';
import notifyService from '../services/NotifyService.js';

class AuthService {
  constructor() {
    this.currentUser = storageService.load(AppConfig.storageKeys.USER);
  }

  login(email, password) {
    if (AppConfig.useServer) {
      return fetch(`${AppConfig.serverUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.currentUser = data.user;
            storageService.save(AppConfig.storageKeys.USER, data.user);
            logger.info('AuthService: login success', data.user);
            notifyService.success(`ברוך הבא ${data.user.name}!`);
            return data.user;
          } else {
            throw new Error(data.message);
          }
        });
    }
  }

  register(name, email, password, role) {
    if (AppConfig.useServer) {
      return fetch(`${AppConfig.serverUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.currentUser = data.user;
            storageService.save(AppConfig.storageKeys.USER, data.user);
            logger.info('AuthService: register success', data.user);
            notifyService.success(`נרשמת בהצלחה ${data.user.name}!`);
            return data.user;
          } else {
            throw new Error(data.message);
          }
        });
    }
  }

  logout() {
    this.currentUser = null;
    storageService.remove(AppConfig.storageKeys.USER);
    logger.info('AuthService: logout');
    notifyService.info('התנתקת מהמערכת');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }
}

const authService = new AuthService();
export default authService;