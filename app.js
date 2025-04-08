// Global Variables
let currentDeviceId = null;
const deviceTemplate = {
  host_name: "",
  ip: "",
  MAC: "",
  inventory_num: "",
  room: "",
  ref_person: "",
  manufacturer: "",
  model: "",
  OS: "",
  status: "",
  purchase_date: "",
  last_check: "",
  note: ""
};

let deviceList = []; // Array to hold devices loaded from Firestore

// --- Authentication ---
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      loadDevices();
    })
    .catch((error) => {
      alert('Login Failed: ' + error.message);
    });
}

// --- Device Loading and Rendering ---
function loadDevices() {
  db.collection("devices").get().then((querySnapshot) => {
    deviceList = []; // Reset the list
    querySnapshot.forEach((doc) => {
      let device = doc.data();
      device.id = doc.id; // Append the document ID to the device data
      deviceList.push(device);
    });
    renderTable(deviceList);
  }).catch((error) => {
    console.error("Error loading devices: ", error);
  });
}

function renderTable(devices) {
  const table = document.getElementById('inventoryTable');
  // Create header row from deviceTemplate keys
  table.innerHTML = `<tr>${Object.keys(deviceTemplate)
    .map(field => `<th>${field}</th>`)
    .join('')}<th>Actions</th></tr>`;
  
  devices.forEach(device => {
    const row = table.insertRow();
    Object.keys(deviceTemplate).forEach(field => {
      const cell = row.insertCell();
      const value = device[field];

      // 🔧 Format Firestore Timestamps
      if (value && typeof value === 'object' && value.seconds !== undefined) {
        const date = new Date(value.seconds * 1000);
        cell.textContent = date.toISOString().split('T')[0]; // e.g., 2024-10-17
      } else {
        cell.textContent = value || '';
      }
    });

    const actionCell = row.insertCell();
    actionCell.innerHTML = `<button onclick="editDevice('${device.id}')">Edit</button>
                            <button onclick="deleteDevice('${device.id}')">Delete</button>`;
  });
}



// --- Search Functionality (Client-Side Filtering) ---
function searchDevices() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredDevices = deviceList.filter(device => {
    return Object.values(device).some(val => {
      return (val && val.toString().toLowerCase().includes(searchTerm));
    });
  });
  renderTable(filteredDevices);
}

function handleOrdering() {
    const orderField = document.getElementById('orderField').value;
    orderDevices(orderField);
}

function orderDevices(field) {
  deviceList.sort((a, b) => {
      const aField = a[field];
      const bField = b[field];

      const isEmptyA = aField === undefined || aField === null || aField === '';
      const isEmptyB = bField === undefined || bField === null || bField === '';

      if (isEmptyA && !isEmptyB) return 1;
      if (!isEmptyA && isEmptyB) return -1;
      if (isEmptyA && isEmptyB) return 0;

      // If the field looks like a Firebase timestamp object
      const isTimestampA = typeof aField === 'object' && aField.seconds !== undefined;
      const isTimestampB = typeof bField === 'object' && bField.seconds !== undefined;

      if (isTimestampA && isTimestampB) {
          return aField.seconds - bField.seconds;
      }

      // Fallback to string comparison
      return aField.toString().toLowerCase().localeCompare(bField.toString().toLowerCase());
  });

  renderTable(deviceList);
}


// --- Form Handling for Add/Edit ---
function showAddForm() {
  currentDeviceId = null;
  // Clear form fields
  Object.keys(deviceTemplate).forEach(field => {
    document.getElementById(field).value = '';
  });
  document.getElementById('deviceForm').style.display = 'block';
}

function editDevice(id) {
    currentDeviceId = id;
    const device = deviceList.find(d => d.id === id);
    if (device) {
        Object.keys(deviceTemplate).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = device[field] || '';
            }
        });
        document.getElementById('deviceForm').style.display = 'block';
    }
}

function saveDevice() {
  const device = {};
  Object.keys(deviceTemplate).forEach(field => {
    device[field] = document.getElementById(field).value;
  });
  
  if (currentDeviceId) {
    db.collection("devices").doc(currentDeviceId).update(device)
      .then(() => {
        loadDevices();
        document.getElementById('deviceForm').style.display = 'none';
      })
      .catch((error) => {
        console.error("Error updating device: ", error);
      });
  } else {
    db.collection("devices").add(device)
      .then(() => {
        loadDevices();
        document.getElementById('deviceForm').style.display = 'none';
      })
      .catch((error) => {
        console.error("Error adding device: ", error);
      });
  }
}

function deleteDevice(id) {
  if (confirm("Are you sure you want to delete this device?")) {
    db.collection("devices").doc(id).delete()
      .then(() => {
        loadDevices();
      })
      .catch((error) => {
        console.error("Error deleting device: ", error);
      });
  }
}