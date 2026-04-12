const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const dataStore = require('../shared-data-store');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Patient Management
app.post('/api/patients/add', (req, res) => {
  const data = dataStore.readData();
  const patient = {
    id: Date.now().toString(),
    ...req.body,
    medicalHistory: [],
    prescriptions: [],
    appointments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  data.patients.push(patient);
  dataStore.writeData(data);
  res.status(201).json({ success: true, message: 'Patient added', data: patient });
});

app.get('/api/patients', (req, res) => {
  const data = dataStore.readData();
  res.json({ success: true, count: data.patients.length, data: data.patients });
});

app.get('/api/patients/search', (req, res) => {
  const data = dataStore.readData();
  const { query } = req.query;
  const results = data.patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.email.toLowerCase().includes(query.toLowerCase()) ||
    p.phone.includes(query)
  );
  res.json({ success: true, data: results });
});

app.get('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const patient = data.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: patient });
});

app.put('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const idx = data.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  data.patients[idx] = { ...data.patients[idx], ...req.body, updatedAt: new Date() };
  dataStore.writeData(data);
  res.json({ success: true, data: data.patients[idx] });
});

app.delete('/api/patients/:id', (req, res) => {
  const data = dataStore.readData();
  const idx = data.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  const deleted = data.patients.splice(idx, 1);
  dataStore.writeData(data);
  res.json({ success: true, data: deleted[0] });
});

// Appointments
app.post('/api/appointments', (req, res) => {
  const data = dataStore.readData();
  const appointment = { id: Date.now().toString(), ...req.body };
  data.appointments.push(appointment);
  dataStore.writeData(data);
  res.status(201).json({ success: true, data: appointment });
});

app.get('/api/appointments', (req, res) => {
  const data = dataStore.readData();
  res.json({ success: true, data: data.appointments });
});

// Prescriptions
app.post('/api/prescriptions', (req, res) => {
  const data = dataStore.readData();
  const prescription = { id: Date.now().toString(), ...req.body };
  data.prescriptions.push(prescription);
  dataStore.writeData(data);
  res.status(201).json({ success: true, data: prescription });
});

app.get('/api/prescriptions', (req, res) => {
  const data = dataStore.readData();
  res.json({ success: true, data: data.prescriptions });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Patient Records v3 is running',
    version: '3.0.0',
    features: ['CRUD', 'Appointments', 'Prescriptions', 'Full Stack']
  });
});

app.listen(PORT, () => {
  console.log(`Patient Records v3 running on http://localhost:${PORT}`);
});
