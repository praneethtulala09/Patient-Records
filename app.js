const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dataStore = require('../shared-data-store');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add patient
app.post('/api/patients/add', (req, res) => {
  const data = dataStore.readData();
  const patient = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  data.patients.push(patient);
  dataStore.writeData(data);
  res.json({ success: true, data: patient });
});

// Get all patients
app.get('/api/patients', (req, res) => {
  const data = dataStore.readData();
  res.json({ success: true, data: data.patients });
});

// Search patients
app.get('/api/patients/search', (req, res) => {
  const data = dataStore.readData();
  const { query } = req.query;
  const results = data.patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ success: true, data: results });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Patient Records v1 is running' });
});

app.listen(PORT, () => {
  console.log(`Patient Records v1 running on http://localhost:${PORT}`);
});
