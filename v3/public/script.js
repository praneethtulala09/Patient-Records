const API = 'http://localhost:5003/api';
let currentPage = 'dashboard';

// Navigation
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(page).classList.add('active');
  event.target.classList.add('active');
  currentPage = page;
  
  if (page === 'dashboard') loadDashboard();
  if (page === 'patients') loadPatients();
  if (page === 'appointments') loadAppointments();
  if (page === 'prescriptions') loadPrescriptions();
}

// Dashboard
async function loadDashboard() {
  try {
    const pRes = await fetch(`${API}/patients`);
    const aRes = await fetch(`${API}/appointments`);
    const prRes = await fetch(`${API}/prescriptions`);
    
    const patients = (await pRes.json()).data;
    const appointments = (await aRes.json()).data;
    const prescriptions = (await prRes.json()).data;
    
    document.getElementById('patientCount').textContent = patients.length;
    document.getElementById('appointmentCount').textContent = appointments.length;
    document.getElementById('prescriptionCount').textContent = prescriptions.length;
  } catch (err) {
    console.error(err);
  }
}

// Patients
document.getElementById('patientForm').addEventListener('submit', async (e) => {
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
      showMsg('patientMsg', 'Patient added successfully!', 'success');
      document.getElementById('patientForm').reset();
      loadPatients();
    }
  } catch (err) {
    showMsg('patientMsg', 'Error adding patient', 'error');
  }
});

async function loadPatients() {
  try {
    const res = await fetch(`${API}/patients`);
    const result = await res.json();
    
    const html = result.data.map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p><strong>Email:</strong> ${p.email}</p>
        <p><strong>Phone:</strong> ${p.phone}</p>
        <p><strong>DOB:</strong> ${p.dateOfBirth || 'N/A'}</p>
        <p><strong>Address:</strong> ${p.address || 'N/A'}</p>
      </div>
    `).join('');
    
    document.getElementById('patientsList').innerHTML = html || '<p>No patients found</p>';
  } catch (err) {
    console.error(err);
  }
}

// Appointments
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const appointment = {
    patientId: document.getElementById('appointmentPatient').value,
    date: document.getElementById('appointmentDate').value,
    reason: document.getElementById('appointmentReason').value
  };
  
  try {
    const res = await fetch(`${API}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });
    
    if (res.ok) {
      document.getElementById('appointmentForm').reset();
      loadAppointments();
    }
  } catch (err) {
    console.error(err);
  }
});

async function loadAppointments() {
  try {
    const res = await fetch(`${API}/appointments`);
    const result = await res.json();
    
    const html = result.data.map(a => `
      <div class="card">
        <h3>Patient: ${a.patientId}</h3>
        <p><strong>Date:</strong> ${a.date}</p>
        <p><strong>Reason:</strong> ${a.reason}</p>
      </div>
    `).join('');
    
    document.getElementById('appointmentsList').innerHTML = html || '<p>No appointments</p>';
  } catch (err) {
    console.error(err);
  }
}

// Prescriptions
document.getElementById('prescriptionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const prescription = {
    patientId: document.getElementById('prescriptionPatient').value,
    medicine: document.getElementById('prescriptionMedicine').value,
    dosage: document.getElementById('prescriptionDosage').value
  };
  
  try {
    const res = await fetch(`${API}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescription)
    });
    
    if (res.ok) {
      document.getElementById('prescriptionForm').reset();
      loadPrescriptions();
    }
  } catch (err) {
    console.error(err);
  }
});

async function loadPrescriptions() {
  try {
    const res = await fetch(`${API}/prescriptions`);
    const result = await res.json();
    
    const html = result.data.map(p => `
      <div class="card">
        <h3>Medicine: ${p.medicine}</h3>
        <p><strong>Patient:</strong> ${p.patientId}</p>
        <p><strong>Dosage:</strong> ${p.dosage}</p>
      </div>
    `).join('');
    
    document.getElementById('prescriptionsList').innerHTML = html || '<p>No prescriptions</p>';
  } catch (err) {
    console.error(err);
  }
}

function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `message ${type}`;
}

// Load dashboard on start
loadDashboard();
