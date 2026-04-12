document.getElementById('patientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const patient = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };
  
  const response = await fetch('/api/patients/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient)
  });
  
  const result = await response.json();
  if (result.success) {
    document.getElementById('patientForm').reset();
    loadPatients();
  }
});

async function loadPatients() {
  const response = await fetch('/api/patients');
  const result = await response.json();
  
  const html = result.data.map(p => `
    <div class="patient">
      <h3>${p.name}</h3>
      <p>Email: ${p.email}</p>
      <p>Phone: ${p.phone}</p>
    </div>
  `).join('');
  
  document.getElementById('patients').innerHTML = html;
}

loadPatients();
