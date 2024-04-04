const db = require('../firebase');

// Reference to the Firestore collection where attendance records will be stored
const attendanceCollection = db.collection('attendanceRecords');

// Function to add a new subject
const addSubject = async (subjectData) => {
    try {
        await attendanceCollection.add(subjectData);
    } catch (error) {
        throw error;
    }
};

// Function to get subjects by userId
const getSubjectsByUserId = async (userId) => {
    try {
        const querySnapshot = await attendanceCollection.where('userId', '==', userId).get();
        const subjects = [];
        querySnapshot.forEach(doc => {
            subjects.push(doc.data());
        });
        return subjects;
    } catch (error) {
        throw error;
    }
};

// Function to get subject by userId and subjectId
const getSubjectByUserIdAndSubjectId = async (userId, subjectId) => {
    try {
        const querySnapshot = await attendanceCollection.where('userId', '==', userId).where('subjectId', '==', subjectId).get();
        if (querySnapshot.empty) {
            return null;
        } else {
            return querySnapshot.docs[0].data();
        }
    } catch (error) {
        throw error;
    }
};

const deleteSubjectFromDatabase = async (subjectId, userId) => {
    try {
        // Query for the subject with the given subject ID and user ID
        const querySnapshot = await attendanceCollection
            .where('subjectId', '==', subjectId)
            .where('userId', '==', userId)
            .get();

        // Delete the subject document if it exists
        querySnapshot.forEach(doc => {
            doc.ref.delete();
        });
    } catch (error) {
        throw error;
    }
};

// Function to increase attendance for a subject
const increaseAttendance = async (subjectId, userId) => {
    try {
        // Get the document reference for the subject specific to the user
        const subjectRef = attendanceCollection.where('subjectId', '==', subjectId)
                                                .where('userId', '==', userId)
                                                .limit(1); // Limit to 1 document

        // Get the current attendance data for the subject
        const querySnapshot = await subjectRef.get();
        if (querySnapshot.empty) {
            throw new Error('Subject not found');
        }

        // Update the attendance data
        const doc = querySnapshot.docs[0];
        const attendanceData = doc.data();
        attendanceData.classesAttended += 1;
        attendanceData.totalClasses+=1;
        attendanceData.percentage = ((attendanceData.classesAttended / attendanceData.totalClasses) * 100).toFixed(2);

        // Update the document in the database
        await doc.ref.update(attendanceData);
    } catch (error) {
        throw error;
    }
};


// Function to increase total classes for a subject
const increaseTotalClasses = async (subjectId, userId) => {
    try {
        // Get the document reference for the subject specific to the user
        const subjectRef = attendanceCollection.where('subjectId', '==', subjectId)
                                                .where('userId', '==', userId)
                                                .limit(1); // Limit to 1 document

        // Get the current attendance data for the subject
        const querySnapshot = await subjectRef.get();
        if (querySnapshot.empty) {
            throw new Error('Subject not found');
        }

        // Update the attendance data
        const doc = querySnapshot.docs[0];
        const attendanceData = doc.data();
        attendanceData.totalClasses += 1;
        attendanceData.percentage = ((attendanceData.classesAttended / attendanceData.totalClasses) * 100).toFixed(2);

        // Update the document in the database
        await doc.ref.update(attendanceData);
    } catch (error) {
        throw error;
    }
};


// Export the attendance functions
module.exports = {
    addSubject,
    getSubjectByUserIdAndSubjectId,
    getSubjectsByUserId,
    deleteSubjectFromDatabase,
    increaseAttendance,
    increaseTotalClasses
};
