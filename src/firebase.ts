// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsIrM4iA6SbzdmK3zoytyB6-C6mV49tis",
  authDomain: "bilahujan-app.firebaseapp.com",
  projectId: "bilahujan-app",
  storageBucket: "bilahujan-app.firebasestorage.app",
  messagingSenderId: "532407697220",
  appId: "1:532407697220:web:2c115d0192ff920c94e111",
  measurementId: "G-T996F8RTW0",
  databaseURL: "https://bilahujan-app-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, db, rtdb, storage };
