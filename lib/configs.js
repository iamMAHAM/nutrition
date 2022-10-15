// Import the functions you need from the SDKs you need
const { initializeApp } =  require("firebase/app");
const {getFirestore} = require("firebase/firestore")
const { getDatabase }= require('firebase/database')

const firebaseConfig = {
  apiKey: "AIzaSyC0Ll-UIUqjmknDSieH9NERARgwXqaNp4s",
  authDomain: "nutrition-a16a5.firebaseapp.com",
  projectId: "nutrition-a16a5",
  storageBucket: "nutrition-a16a5.appspot.com",
  messagingSenderId: "656276070457",
  appId: "1:656276070457:web:a178e17af2928a76e5ede8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const rtdb = getDatabase(app)
module.exports = { db, rtdb }