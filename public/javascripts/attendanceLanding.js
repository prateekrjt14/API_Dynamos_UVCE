//Function to add a new subject
function addSubject() {
    const subjectId = prompt('Enter subject ID:');
    const courseName = prompt('Enter course name:');
    if(!subjectId || !courseName){
        return;
    }

    // Get the element by id
    const element = document.getElementById('uid');

    // Get the text content of the element
    const textContent = element.textContent.trim();

    // Extract the userId
    const userId = textContent.split(':')[1].trim();

    console.log('userId:', userId); // Log the userId

    // Send the data to the server
    fetch('/attendance/addSubject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subjectId, courseName, userId }) // Include userId in the body
    })
    .then(response => {
      if (response.ok) {
        alert('Subject added successfully!');
        // Reload the page after successful addition
        location.reload();
      } else {
        alert('Failed to add subject!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to add subject!');
    });
}


// function to delete a subject
function deleteSubject(subjectId, username) {
    fetch(`/attendance/deleteSubject/${subjectId}/${username}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Subject deleted successfully!');
            // Reload the page after successful deletion
            location.reload();
        } else {
            alert('Failed to delete subject!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete subject!');
    });
}

// Function to handle when the plus button is clicked
function increaseAttendance(subjectId, userId) {
    fetch(`/attendance/increaseAttendance/${subjectId}/${userId}`, {
        method: 'PUT'
    })
    .then(response => {
        if (response.ok) {
            location.reload(); // Reload the page after successful update
        } else {
            alert('Failed to update attendance!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update attendance!');
    });
}

// Function to handle when the minus button is clicked
function increaseTotalClasses(subjectId, userId) {
    fetch(`/attendance/increaseTotalClasses/${subjectId}/${userId}`, {
        method: 'PUT'
    })
    .then(response => {
        if (response.ok) {
            location.reload(); // Reload the page after successful update
        } else {
            alert('Failed to update attendance!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update attendance!');
    });
}