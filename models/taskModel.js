// taskModel.js

const db = require('../firebase');

const taskCollection = db.collection('tasks');

// Function to add a new task
const addTask = async (taskData) => {
    try {
        await taskCollection.add(taskData);
    } catch (error) {
        throw error;
    }
};

// Function to delete a task
const deleteTask = async (taskId) => {
    try {
        await taskCollection.doc(taskId).delete();
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// Function to get tasks by user ID
const getTasksByUserId = async (userId) => {
    try {
        const snapshot = await taskCollection.where('userId', '==', userId).get();
        const tasks = [];
        snapshot.forEach(doc => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        return tasks;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addTask,
    deleteTask,
    getTasksByUserId
};
