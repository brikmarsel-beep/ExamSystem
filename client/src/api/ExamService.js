import AppConfig from '../app.config.js';
import logger from '../services/Logger.js';
import notifyService from '../services/NotifyService.js';

class ExamService {
  getAllExams() {
    return fetch(`${AppConfig.serverUrl}/exams`)
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: getAllExams', data);
        return data;
      });
  }

  getExamById(id) {
    return fetch(`${AppConfig.serverUrl}/exams/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('מבחן לא נמצא');
        return res.json();
      })
      .then(data => {
        logger.info('ExamService: getExamById', data);
        return data;
      });
  }

  getExamsByTeacher(teacherId) {
    return fetch(`${AppConfig.serverUrl}/exams/teacher/${teacherId}`)
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: getExamsByTeacher', data);
        return data;
      });
  }

  createExam(title, teacherId, duration) {
    return fetch(`${AppConfig.serverUrl}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, teacherId, duration }),
    })
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: createExam', data);
        notifyService.success('מבחן נוצר בהצלחה!');
        return data;
      });
  }

  updateExam(id, updates) {
    return fetch(`${AppConfig.serverUrl}/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: updateExam', data);
        notifyService.success('מבחן עודכן בהצלחה!');
        return data;
      });
  }

  changeStatus(id, status) {
    return fetch(`${AppConfig.serverUrl}/exams/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: changeStatus', data);
        notifyService.success(`סטטוס מבחן שונה ל ${status}`);
        return data;
      });
  }

  addQuestion(examId, question) {
    return fetch(`${AppConfig.serverUrl}/exams/${examId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    })
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: addQuestion', data);
        notifyService.success('שאלה נוספה בהצלחה!');
        return data;
      });
  }

  submitExam(examId, studentId, answers) {
    return fetch(`${AppConfig.serverUrl}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId, studentId, answers }),
    })
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: submitExam', data);
        notifyService.success(`הגשת המבחן הצליחה! ציון: ${data.score}`);
        return data;
      });
  }

  getSubmissionsByStudent(studentId) {
    return fetch(`${AppConfig.serverUrl}/submissions/student/${studentId}`)
      .then(res => res.json())
      .then(data => {
        logger.info('ExamService: getSubmissionsByStudent', data);
        return data;
      });
  }
}

const examService = new ExamService();
export default examService;