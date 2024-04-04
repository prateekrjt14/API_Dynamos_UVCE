const db = require('../firebase');

const expenseCollection = db.collection('expenses');

// Function to add a new expense record
const addExpense = async (expenseData) => {
    try {
        await expenseCollection.add(expenseData);
    } catch (error) {
        throw error;
    }
};

// Function to delete an expense record
const deleteExpense = async (expenseId) => {
    try {
        await expenseCollection.doc(expenseId).delete();
    } catch (error) {
        throw error;
    }
};

// Function to get expenses records by user ID
const getExpensesByUserId = async (userId) => {
    try {
        const snapshot = await expenseCollection.where('userId', '==', userId).get();
        const expenseRecords = [];
        snapshot.forEach(doc => {
            expenseRecords.push({ id: doc.id, ...doc.data() });
        });
        return expenseRecords;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addExpense,
    deleteExpense,
    getExpensesByUserId
};
