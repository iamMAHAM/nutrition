// Import the functions you need from the SDKs you need
const { initializeApp } =  require("firebase/app");
const {getFirestore} = require("firebase/firestore")
const { getDatabase }= require('firebase/database')
const { getStorage }= require('firebase/storage');
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyC0Ll-UIUqjmknDSieH9NERARgwXqaNp4s",
  authDomain: "nutrition-a16a5.firebaseapp.com",
  projectId: "nutrition-a16a5",
  storageBucket: "nutrition-a16a5.appspot.com",
  messagingSenderId: "656276070457",
  appId: "1:656276070457:web:a178e17af2928a76e5ede8",
  databaseURL: "https://nutrition-a16a5-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const rtdb = getDatabase(app)
const storage = getStorage(app)
const auth = getAuth(app)
module.exports = { db, rtdb, storage }