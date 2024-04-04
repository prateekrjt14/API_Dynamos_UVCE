const db = require('../firebase');

const marksCollection = db.collection('marks');

// Function to add a new marks record
const addMarksRecord = async (marksData) => {
    try {
        // Check if the record with the same subjectCode and testType exists
        const existingRecord = await marksCollection
            .where('subjectCode', '==', marksData.subjectCode)
            .where('testType', '==', marksData.testType)
            .limit(1)
            .get();

        // If the record already exists, do not add it again
        if (!existingRecord.empty) {
            console.log('Record with the same subjectCode and testType already exists.');
            return;
        }

        // Otherwise, add the new marks record
        await marksCollection.add(marksData);
    } catch (error) {
        throw error;
    }
};

// Function to delete a marks record
const deleteMarksRecord = async (marksId) => {
    try {
        await marksCollection.doc(marksId).delete();
    } catch (error) {
        throw error;
    }
};

// Function to get marks records by user ID
const getMarksRecordsByUserId = async (userId) => {
    try {
        const snapshot = await marksCollection.where('userId', '==', userId).get();
        const marksRecords = [];
        snapshot.forEach(doc => {
            marksRecords.push({ id: doc.id, ...doc.data() });
        });
        return marksRecords;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addMarksRecord,
    deleteMarksRecord,
    getMarksRecordsByUserId
};
