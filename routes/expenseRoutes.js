const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Route to render the expense page
router.get('/', expenseController.renderExpensePage);

// Route to handle adding a new expense
router.post('/add', expenseController.addExpense);

// Route to handle deleting an expense
router.delete('/delete/:expenseId', expenseController.deleteExpense);

router.get('/getByUserId', expenseController.getExpensesByUserId);

module.exports = router;
