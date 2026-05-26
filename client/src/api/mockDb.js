import AppConfig from '../app.config.js';

const mockDb = {
  users: [
    {
      id: 1,
      name: "David Cohen",
      email: "teacher@test.com",
      password: "1234",
      role: AppConfig.roles.TEACHER,
    },
    {
      id: 2,
      name: "Yossi Levi",
      email: "student@test.com",
      password: "1234",
      role: AppConfig.roles.STUDENT,
    },
  ],
  exams: [
    {
      id: 1,
      title: "JavaScript Basics",
      teacherId: 1,
      status: AppConfig.examStatus.ACTIVE,
      duration: 30,
      questions: [
        { id: 1, text: "What is a variable?", options: ["A container for data", "A function", "A loop", "A class"], correct: 0 },
        { id: 2, text: "What does === mean?", options: ["Assignment", "Strict equality", "Not equal", "Greater than"], correct: 1 },
        { id: 3, text: "What is an array?", options: ["A single value", "A function", "A list of values", "A boolean"], correct: 2 },
      ],
    },
    {
      id: 2,
      title: "React Fundamentals",
      teacherId: 1,
      status: AppConfig.examStatus.DRAFT,
      duration: 45,
      questions: [
        { id: 1, text: "What is a component?", options: ["A database", "A reusable UI piece", "A server", "A style"], correct: 1 },
        { id: 2, text: "What is useState?", options: ["A router", "A database hook", "A state management hook", "A style hook"], correct: 2 },
      ],
    },
  ],
  submissions: [],
};

export default mockDb;