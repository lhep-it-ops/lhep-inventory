const firebaseConfig = {
    apiKey: "AIzaSyDxLWAQqGbCv-YmMRKkQukfptTtHg89q7o",
    authDomain: "inventory-db-lhep.firebaseapp.com",
    projectId: "inventory-db-lhep",
    storageBucket: "inventory-db-lhep.firebasestorage.app",
    messagingSenderId: "820650788464",
    appId: "1:820650788464:web:e1740a2d06bbe38280d6b5"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();