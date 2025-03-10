let currentDeviceId = null;

// Authentication
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            loadDevices();
        });
}

// Load Devices
function loadDevices() {
    db.collection("devices").get().then((querySnapshot) => {
        const table = document.getElementById('inventoryTable');
        table.innerHTML = `<tr>${Object.keys(deviceTemplate).map(f => `<th>${f}</th>`).join('')}<th>Actions</th></tr>`;
        
        querySnapshot.forEach((doc) => {
            const device = doc.data();
            const row = table.insertRow();
            
            Object.keys(device).forEach(field => {
                row.insertCell().textContent = device[field];
            });
            
            const actionCell = row.insertCell();
            actionCell.innerHTML = `<button onclick="editDevice('${doc.id}')">Edit</button>
                                   <button onclick="deleteDevice('${doc.id}')">Delete</button>`;
        });
    });
}

// Search Functionality
function searchDevices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    // Implement field-specific search logic
}

// Add/Edit Device
function saveDevice() {
    const device = {
        host_name: document.getElementById('host_name').value,
        ip: document.getElementById('ip').value,
        MAC: document.getElementById('MAC').value,
        inventory_num: document.getElementById('inventory_num').value,
        room: document.getElementById('room').value,
        ref_person: document.getElementById('ref_person').value,
        manufacturer: document.getElementById('manufacturer').value,
        model: document.getElementById('model').value,
        OS: document.getElementById('OS').value,
        purchase_date: document.getElementById('purchase_date').value,
        last_check: document.getElementById('last_check').value,
        note: document.getElementById('note').value
        // Add all other fields
    };

    if(currentDeviceId) {
        db.collection("devices").doc(currentDeviceId).update(device);
    } else {
        db.collection("devices").add(device);
    }
}

// Delete Device
function deleteDevice(id) {
    db.collection("devices").doc(id).delete().then(loadDevices);
}