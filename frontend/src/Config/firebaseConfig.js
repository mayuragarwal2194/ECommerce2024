// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration object (replace with your own config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCu5JKlRkU2l9AhFhbDMw5A01DsM9zo8-Y",
  authDomain: "marwar-store-2024.firebaseapp.com",
  projectId: "marwar-store-2024",
  storageBucket: "marwar-store-2024.appspot.com",
  messagingSenderId: "493065928436",
  appId: "1:493065928436:web:1ce51731d57144ef2b68a1",
  measurementId: "G-SYXN055007"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
