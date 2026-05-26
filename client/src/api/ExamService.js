import mockDb from './mockDb.js';
import AppConfig from '../app.config.js';
import logger from '../services/Logger.js';
import notifyService from '../services/NotifyService.js';

class ExamService {
  getAllExams() {
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info('ExamService: getAllExams');
        resolve([...mockDb.exams]);
      }, AppConfig.mockDelay);
    });
  }

  getExamById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exam = mockDb.exams.find(e => e.id === parseInt(id));
        if (exam) {
          logger.info('ExamService: getExamById', exam);
          resolve({ ...exam });
        } else {
          logger.warn('ExamService: exam not found', id);
          reject(new Error('מבחן לא נמצא'));
        }
      }, AppConfig.mockDelay);
    });
  }

  getExamsByTeacher(teacherId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exams = mockDb.exams.filter(e => e.teacherId === teacherId);
        logger.info('ExamService: getExamsByTeacher', exams);
        resolve([...exams]);
      }, AppConfig.mockDelay);
    });
  }

  createExam(title, teacherId, duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExam = {
          id: mockDb.exams.length + 1,
          title,
          teacherId,
          status: AppConfig.examStatus.DRAFT,
          duration,
          questions: [],
        };
        mockDb.exams.push(newExam);
        logger.info('ExamService: createExam', newExam);
        notifyService.success('מבחן נוצר בהצלחה!');
        resolve({ ...newExam });
      }, AppConfig.mockDelay);
    });
  }

  updateExam(id, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDb.exams.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
          mockDb.exams[index] = { ...mockDb.exams[index], ...updates };
          logger.info('ExamService: updateExam', mockDb.exams[index]);
          notifyService.success('מבחן עודכן בהצלחה!');
          resolve({ ...mockDb.exams[index] });
        } else {
          logger.warn('ExamService: exam not found for update', id);
          reject(new Error('מבחן לא נמצא'));
        }
      }, AppConfig.mockDelay);
    });
  }

  changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDb.exams.findIndex(e => e.id === parseInt(id));
        if (index !== -1) {
          mockDb.exams[index].status = status;
          logger.info('ExamService: changeStatus', { id, status });
          notifyService.success(`סטטוס מבחן שונה ל ${status}`);
          resolve({ ...mockDb.exams[index] });
        } else {
          logger.warn('ExamService: exam not found for status change', id);
          reject(new Error('מבחן לא נמצא'));
        }
      }, AppConfig.mockDelay);
    });
  }

  addQuestion(examId, question) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exam = mockDb.exams.find(e => e.id === parseInt(examId));
        if (exam) {
          const newQuestion = {
            id: exam.questions.length + 1,
            ...question,
          };
          exam.questions.push(newQuestion);
          logger.info('ExamService: addQuestion', newQuestion);
          notifyService.success('שאלה נוספה בהצלחה!');
          resolve({ ...exam });
        } else {
          logger.warn('ExamService: exam not found for addQuestion', examId);
          reject(new Error('מבחן לא נמצא'));
        }
      }, AppConfig.mockDelay);
    });
  }

  submitExam(examId, studentId, answers) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exam = mockDb.exams.find(e => e.id === parseInt(examId));
        if (exam) {
          let score = 0;
          exam.questions.forEach((q, index) => {
            if (answers[index] === q.correct) score++;
          });
          const percentage = Math.round((score / exam.questions.length) * 100);
          const submission = {
            id: mockDb.submissions.length + 1,
            examId,
            studentId,
            answers,
            score: percentage,
            passed: percentage >= AppConfig.minPassScore,
            submittedAt: new Date().toISOString(),
          };
          mockDb.submissions.push(submission);
          logger.info('ExamService: submitExam', submission);
          notifyService.success(`הגשת המבחן הצליחה! ציון: ${percentage}`);
          resolve({ ...submission });
        } else {
          logger.warn('ExamService: exam not found for submit', examId);
          reject(new Error('מבחן לא נמצא'));
        }
      }, AppConfig.mockDelay);
    });
  }

  getSubmissionsByStudent(studentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const submissions = mockDb.submissions.filter(
          s => s.studentId === studentId
        );
        logger.info('ExamService: getSubmissionsByStudent', submissions);
        resolve([...submissions]);
      }, AppConfig.mockDelay);
    });
  }
}

const examService = new ExamService();
export default examService;