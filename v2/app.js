const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dataStore = require('../shared-data-store');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// CRUD Operations
app.post('/api/patients/add', (req, res) => {
  const data = dataStore.readData();
  const patient = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  data.patients.push(patient);
  dataStore.writeData(data);
  res.status(201).json({ success: true, data: patient });
});

app.get('/api/patients', (req, res) => {
  const data = dataStore.readData();
  res.json({ success: true, data: data.patients, count: data.patients.length });
});

app.get('/api/patients/search', (req, res) => {
  const data = dataStore.readData();
  const { query } = req.query;
  const results = data.patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.email.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ success: true, data: results });
});

app.get('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const patient = data.patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.json({ success: true, data: patient });
});

app.put('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const idx = data.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  data.patients[idx] = { ...data.patients[idx], ...req.body, updatedAt: new Date() };
  dataStore.writeData(data);
  res.json({ success: true, data: data.patients[idx] });
});

app.delete('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const idx = data.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  const deleted = data.patients.splice(idx, 1);
  dataStore.writeData(data);
  res.json({ success: true, data: deleted[0] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Patient Records v2 is running', version: '2.0.0' });
});

app.listen(PORT, () => {
  console.log(`Patient Records v2 running on http://localhost:${PORT}`);
});
