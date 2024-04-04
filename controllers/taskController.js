const taskModel = require('../models/taskModel');

// Controller method to add a new task
exports.addTask = async (req, res) => {
    try {
        const { taskName, startDate, endDate } = req.body;
        const userId = req.session.userId;
        await taskModel.addTask({ userId, taskName, startDate, endDate });
        res.redirect('/tasks');
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: 'Failed to add task.' });
    }
};

// Controller method to delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await taskModel.deleteTask(taskId);
        res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Failed to delete task.' });
    }
};