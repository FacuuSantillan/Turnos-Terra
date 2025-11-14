// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// ESTA CONFIGURACIÓN ES PÚBLICA Y ESTÁ BIEN QUE ESTÉ EN EL FRONTEND
const firebaseConfig = {
  apiKey: "AIzaSyCEN8z-X98uhf3qGeAMn1d-ALzlGfiOjhY", // Asumo que esta es tu clave de CLIENTE
  authDomain: "terra-turnos.firebaseapp.com",
  projectId: "terra-turnos",
  storageBucket: "terra-turnos.firebasestorage.app",
  messagingSenderId: "598961123334",
  appId: "1:598961123334:web:442ee17d5df3fcc0ba1387",
  measurementId: "G-THMKYMDRBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de 'auth' del CLIENTE
export const auth = getAuth(app);