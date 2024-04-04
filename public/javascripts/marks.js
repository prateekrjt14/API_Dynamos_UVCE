document.getElementById('scoreForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = {
        subjectCode: document.getElementById('subjectCode').value,
        subjectName: document.getElementById('subjectName').value,
        testType: document.getElementById('testType').value,
        marks: document.getElementById('marks').value
    };

    try {
        // Send POST request to add marks record
        const response = await fetch('/marks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Refresh the page to display the updated marks records
            window.location.reload();
        } else {
            console.error('Failed to add marks record');
        }
    } catch (error) {
        console.error('Error adding marks record:', error);
    }
});


async function deleteMarksRecord(marksId) {
    try {
        const response = await fetch(`/marks/delete/${marksId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            // If deletion is successful, refresh the page to update the table
            window.location.reload();
        } else {
            const errorMessage = await response.json();
            // Display an alert with the error message received from the server
            alert(errorMessage.message);
        }
    } catch (error) {
        console.error('Error deleting marks record:', error);
        // Display an alert for any other errors that occurred
        alert('Failed to delete marks record. Please try again later.');
    }
}