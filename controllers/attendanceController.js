// attendanceController.js

const attendanceModel = require('../models/attendanceModel');

// Function to add a new subject
exports.addSubject = async (req, res) => {
  try {
      const { subjectId,courseName } = req.body;
      const userId = req.session.userId;
      
      // Check if the subject already exists for the user
      const existingSubject = await attendanceModel.getSubjectByUserIdAndSubjectId(userId, subjectId);
      if (existingSubject) {
          return res.status(400).json({ success: false, message: 'Subject already exists for this user.' });
      }
      
      // If subject does not exist, add it
      await attendanceModel.addSubject({ subjectId, userId, courseName, totalClasses: 0, classesAttended: 0 , percentage: 0});
      res.status(201).json({ success: true, message: 'Subject added successfully.' });
  } catch (error) {
      console.error('Error adding subject:', error);
      res.status(500).json({ success: false, message: 'Failed to add subject.' });
  }
};

exports.getSubjectsByUserId = async (req, res) => {
  try {
      const userId = req.session.userId;
      const subjects = await attendanceModel.getSubjectsByUserId(userId);
      res.json(subjects);
  } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch subjects.' });
  }
};

// Function to delete a subject
exports.deleteSubject = async (req, res) => {
  try {
      console.log('Params:', req.params); // Log parameters
      const { subjectId} = req.params; 
      const userId = req.session.userId;
      await attendanceModel.deleteSubjectFromDatabase(subjectId, userId);
      res.status(200).json({ success: true, message: 'Subject deleted successfully.' });
  } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ success: false, message: 'Failed to delete subject.' });
  }
};

// Function to increase attendance for a subject
exports.increaseAttendance = async (req, res) => {
  try {
      const { subjectId } = req.params;
      const userId = req.session.userId;
      await attendanceModel.increaseAttendance(subjectId, userId);
      res.status(200).json({ success: true, message: 'Attendance increased successfully.' });
  } catch (error) {
      console.error('Error increasing attendance:', error);
      res.status(500).json({ success: false, message: 'Failed to increase attendance.' });
  }
};

// Function to increase total classes for a subject
exports.increaseTotalClasses = async (req, res) => {
  try {
      const { subjectId } = req.params;
      const userId = req.session.userId;
      await attendanceModel.increaseTotalClasses(subjectId, userId);
      res.status(200).json({ success: true, message: 'Total classes increased successfully.' });
  } catch (error) {
      console.error('Error increasing total classes:', error);
      res.status(500).json({ success: false, message: 'Failed to increase total classes.' });
  }
};