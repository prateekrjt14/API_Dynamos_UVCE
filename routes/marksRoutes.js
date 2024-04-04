// marksRoutes.js

const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

// Route to fetch and render marks records
router.get('/', marksController.getAndRenderMarks);

// Route to handle adding a new marks record
router.post('/add', marksController.addMarksRecord);

// Route to handle deleting a marks record
router.delete('/delete/:marksId', marksController.deleteMarksRecord);

module.exports = router;
