const { db, rtdb } = require("./configs")
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged,signOut } = require("firebase/auth")
const  { collection, doc, addDoc, getDoc, getDocs, where, query, deleteDoc, setDoc, updateDoc } = require("firebase/firestore")

