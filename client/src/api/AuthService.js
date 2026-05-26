import mockDb from './mockDb.js';
import AppConfig from '../app.config.js';
import logger from '../services/Logger.js';
import storageService from '../services/StorageService.js';
import notifyService from '../services/NotifyService.js';

class AuthService {
  constructor() {
    this.currentUser = storageService.load(AppConfig.storageKeys.USER);
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockDb.users.find(
          u => u.email === email && u.password === password
        );
        if (user) {
          const { password: _, ...safeUser } = user;
          this.currentUser = safeUser;
          storageService.save(AppConfig.storageKeys.USER, safeUser);
          logger.info('AuthService: login success', safeUser);
          notifyService.success(`ברוך הבא ${safeUser.name}!`);
          resolve(safeUser);
        } else {
          logger.warn('AuthService: login failed');
          notifyService.error('אימייל או סיסמה שגויים');
          reject(new Error('אימייל או סיסמה שגויים'));
        }
      }, AppConfig.mockDelay);
    });
  }

  register(name, email, password, role) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = mockDb.users.find(u => u.email === email);
        if (exists) {
          logger.warn('AuthService: register failed - email exists');
          notifyService.error('אימייל כבר קיים במערכת');
          reject(new Error('אימייל כבר קיים במערכת'));
        } else {
          const newUser = {
            id: mockDb.users.length + 1,
            name,
            email,
            password,
            role,
          };
          mockDb.users.push(newUser);
          const { password: _, ...safeUser } = newUser;
          this.currentUser = safeUser;
          storageService.save(AppConfig.storageKeys.USER, safeUser);
          logger.info('AuthService: register success', safeUser);
          notifyService.success(`נרשמת בהצלחה ${safeUser.name}!`);
          resolve(safeUser);
        }
      }, AppConfig.mockDelay);
    });
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