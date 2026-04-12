const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'shared-data.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { patients: [], appointments: [], prescriptions: [] };
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw || '{}');

    return {
      patients: Array.isArray(parsed.patients) ? parsed.patients : [],
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
      prescriptions: Array.isArray(parsed.prescriptions) ? parsed.prescriptions : []
    };
  } catch (error) {
    return { patients: [], appointments: [], prescriptions: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData
};
