const expenseModel = require('../models/expenseModel');

// Controller method to add a new expense record
exports.addExpense = async (req, res) => {
    try {
        const { category, amount, dateOfTransaction } = req.body;
        
        if (!category || !amount || !dateOfTransaction) {
            throw new Error('All fields are required.');
        }

        const userId = req.session.userId;
        
        await expenseModel.addExpense({ category, amount, dateOfTransaction, userId });
        res.status(201).json({ success: true, message: 'Expense record added successfully.' });
    } catch (error) {
        console.error('Error adding expense record:', error);
        res.status(500).json({ success: false, message: 'Failed to add expense record.' });
    }
};

// Controller method to delete an expense record
exports.deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        await expenseModel.deleteExpense(expenseId);
        res.status(200).json({ success: true, message: 'Expense record deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense record:', error);
        res.status(500).json({ success: false, message: 'Failed to delete expense record.' });
    }
};


// Controller method to get expenses records by user ID
exports.getExpensesByUserId = async (req, res) => {
    try {
        const userId = req.session.userId;
        const expenseRecords = await expenseModel.getExpensesByUserId(userId);
        res.status(200).json({ success: true, expenses: expenseRecords });
    } catch (error) {
        console.error('Error fetching expense records:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch expense records.' });
    }
};

// Controller method to render the expense page
exports.renderExpensePage = async (req, res) => {
    try {
        const userId = req.session.userId;
        
        // Fetch expenses for the logged-in user
        const expenses = await expenseModel.getExpensesByUserId(userId);
        
        // Render the expense.ejs template with expense data
        res.render('expense', { expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Internal Server Error');
    }
};
