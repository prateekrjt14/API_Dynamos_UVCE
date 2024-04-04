// tasksRoutes.js

const express = require('express');
const router = express.Router();
const { getTasksByUserId } = require('../models/taskModel');
const taskController = require('../controllers/taskController');

// Function to classify tasks as active or missed based on end dates
const classifyTasks = (tasks) => {
    const currentDate = new Date();
    const activeTasks = [];
    const missedTasks = [];

    tasks.forEach(task => {
        const endDate = new Date(task.endDate);
        if (endDate >= currentDate) {
            activeTasks.push(task);
        } else {
            missedTasks.push(task);
        }
    });

    return { activeTasks, missedTasks };
};

// Route to fetch and render tasks
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Retrieve tasks associated with the current user's userId
        const tasks = await getTasksByUserId(userId);

        // Classify tasks as active or missed
        const { activeTasks, missedTasks } = classifyTasks(tasks);

        // Render the tasks.ejs template with active and missed tasks
        res.render('tasks', { activeTasks, missedTasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to handle task deletion
router.delete('/delete/:taskId', taskController.deleteTask);

// Route to handle adding a new task
router.post('/add', taskController.addTask);

module.exports = router;
