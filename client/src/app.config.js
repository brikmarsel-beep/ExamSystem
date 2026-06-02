const AppConfig = {
  appName: "ExamSystem",
  version: "1.0.0",
  mockDelay: 500,
  maxExamDuration: 120,
  minPassScore: 60,
  useServer: true,
  serverUrl: "http://localhost:3001/api",
  roles: {
    TEACHER: "teacher",
    STUDENT: "student",
  },
  examStatus: {
    DRAFT: "draft",
    ACTIVE: "active",
    CLOSED: "closed",
  },
  storageKeys: {
    USER: "examSystem_user",
    EXAMS: "examSystem_exams",
  },
  logLevels: {
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
  },
};

export default AppConfig;
