const API = 'http://localhost:5002/api';

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const patient = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    dateOfBirth: document.getElementById('dob').value,
    address: document.getElementById('address').value
  };
  
  try {
    const res = await fetch(`${API}/patients/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    });
    
    const result = await res.json();
    if (result.success) {
      showMessage('addMsg', 'Patient added successfully!', 'success');
      document.getElementById('addForm').reset();
    }
  } catch (err) {
    showMessage('addMsg', 'Error adding patient', 'error');
  }
});

async function searchPatients() {
  const query = document.getElementById('searchBox').value;
  if (!query) {
    alert('Enter search query');
    return;
  }
  
  try {
    const res = await fetch(`${API}/patients/search?query=${query}`);
    const result = await res.json();
    displayPatients(result.data, 'searchResults');
  } catch (err) {
    console.error(err);
  }
}

async function loadAllPatients() {
  try {
    const res = await fetch(`${API}/patients`);
    const result = await res.json();
    displayPatients(result.data, 'allPatients');
  } catch (err) {
    console.error(err);
  }
}

function displayPatients(patients, elementId) {
  const html = patients.map(p => `
    <div class="patient-card">
      <h3>${p.name}</h3>
      <p><strong>Email:</strong> ${p.email}</p>
      <p><strong>Phone:</strong> ${p.phone}</p>
      <p><strong>DOB:</strong> ${p.dateOfBirth || 'N/A'}</p>
      <p><strong>Address:</strong> ${p.address || 'N/A'}</p>
    </div>
  `).join('');
  
  document.getElementById(elementId).innerHTML = html || '<p>No records found</p>';
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

function showMessage(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `message ${type}`;
}
