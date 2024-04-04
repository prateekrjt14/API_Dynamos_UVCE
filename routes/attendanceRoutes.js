// attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Route to add a new subject
router.post('/addSubject', attendanceController.addSubject);

// Route to get subjects by userId
router.get('/subjects/:userId', attendanceController.getSubjectsByUserId);

// Route to delete a particular subject for a particular user
router.delete('/deleteSubject/:subjectId/:userId', attendanceController.deleteSubject);

// Route to increase attendance for a subject
router.put('/increaseAttendance/:subjectId/:userId', attendanceController.increaseAttendance);

// Route to increase total classes for a subject
router.put('/increaseTotalClasses/:subjectId/:userId', attendanceController.increaseTotalClasses);

module.exports = router;
