const API_URL = 'http://localhost:5000/api/reminders';

// Create Reminder
if (document.getElementById('createForm')) {
  document.getElementById('createForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      title: document.getElementById('title').value,
      message: document.getElementById('message').value,
      email: document.getElementById('email').value,
      dateTime: document.getElementById('dateTime').value
    };
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Reminder Created!');
    window.location.href = 'reminders.html';
  });
}

// Display Reminders
if (document.getElementById('reminderTable')) {
  fetch(API_URL)
    .then(res => res.json())
    .then(reminders => {
      const tbody = document.querySelector('#reminderTable tbody');
      reminders.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${r.title}</td>
          <td>${r.email}</td>
          <td>${new Date(r.dateTime).toLocaleString()}</td>
          <td>${r.sent ? 'Sent' : 'Pending'}</td>
          <td>
            <button onclick="deleteReminder('${r._id}')">Delete</button>
          </td>`;
        tbody.appendChild(row);
      });
    });
}

async function deleteReminder(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  alert('Deleted!');
  location.reload();
}
