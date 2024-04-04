// marksController.js

const marksModel = require('../models/marksModel');

// Controller method to fetch and render marks records
exports.getAndRenderMarks = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Retrieve marks records associated with the current user's userId
        const marksRecords = await marksModel.getMarksRecordsByUserId(userId);

        // Render the marks.ejs template with marks records
        res.render('marks', { marks: marksRecords });
    } catch (error) {
        console.error('Error fetching marks records:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller method to add a new marks record
exports.addMarksRecord = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { subjectCode, subjectName, testType, marks } = req.body;
        
        // Check if required fields are present and have valid values
        if (!subjectCode || !subjectName || !testType || !marks) {
            // Throw an error if any required field is missing
            throw new Error('All fields are required.');
        }

        const userId = req.session.userId;
        
        // Call the model method to add marks record
        await marksModel.addMarksRecord({ userId, subjectCode, subjectName, testType, marks });
        
        // Redirect to the marks page after successful addition
        res.redirect('/marks');
    } catch (error) {
        // Handle errors and send a response with appropriate status code and message
        console.error('Error adding marks record:', error);
        res.status(500).json({ success: false, message: 'Failed to add marks record.' });
    }
};


// Controller method to delete a marks record
exports.deleteMarksRecord = async (req, res) => {
    try {
        const { marksId } = req.params;
        await marksModel.deleteMarksRecord(marksId);
        res.status(200).json({ success: true, message: 'Marks record deleted successfully.' });
    } catch (error) {
        console.error('Error deleting marks record:', error);
        res.status(500).json({ success: false, message: 'Failed to delete marks record.' });
    }
};
