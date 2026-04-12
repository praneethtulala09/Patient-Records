const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'shared-data.json');

function readLocalData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    return { patients: [], appointments: [], prescriptions: [] };
  }
}

function uniquePatients(records) {
  const seen = new Set();
  return records.filter((p) => {
    const key = p.id || `${p.name || ''}|${p.email || ''}|${p.phone || ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function fetchPatients(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    return [];
  }
}

async function main() {
  const local = readLocalData();
  const v1Patients = await fetchPatients('http://localhost:5001/api/patients');
  const v2Patients = await fetchPatients('http://localhost:5002/api/patients');

  const mergedPatients = uniquePatients([
    ...(local.patients || []),
    ...v1Patients,
    ...v2Patients
  ]);

  const merged = {
    patients: mergedPatients,
    appointments: Array.isArray(local.appointments) ? local.appointments : [],
    prescriptions: Array.isArray(local.prescriptions) ? local.prescriptions : []
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2));
  console.log(`Merged patients: ${mergedPatients.length} (v1: ${v1Patients.length}, v2: ${v2Patients.length})`);
}

main();
