const firebaseConfig = {
    apiKey: "AIzaSyDxLWAQqGbCv-YmMRKkQukfptTtHg89q7o",
    authDomain: "inventory-db-lhep.firebaseapp.com",
    projectId: "inventory-db-lhep",
    storageBucket: "inventory-db-lhep.appspot.com",
    messagingSenderId: "123456789",
    appId: "APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();