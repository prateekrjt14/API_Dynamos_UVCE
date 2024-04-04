// expense.js

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    addBtn.addEventListener('click', addExpense);

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expenseId = button.dataset.id;
            deleteExpense(expenseId);
        });
    });
});

async function addExpense() {
    const category = document.getElementById('category-select').value;
    const amount = document.getElementById('amount-input').value;
    const dateOfTransaction = document.getElementById('date-input').value;

    if (!category || !amount || !dateOfTransaction) {
        console.error('All fields are required.');
        return;
    }

    try {
        const response = await fetch('/expenses/add', { // Update the endpoint to '/expenses/add'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, amount, dateOfTransaction })
        });

        if (response.ok) {
            console.log('Expense added successfully.');
            location.reload();
        } else {
            console.error('Failed to add expense.');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

async function deleteExpense(expenseId) {
    try {
        const response = await fetch(`/expenses/delete/${expenseId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Expense deleted successfully.');
            // Reload the page or update the UI as needed
            location.reload();
        } else {
            console.error('Failed to delete expense.');
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    console.log(totalAmount);
    // Update the total amount displayed in the HTML
    const totalAmountElement = document.getElementById('total-amount');
    totalAmountElement.innerHTML = totalAmount.toFixed(2);