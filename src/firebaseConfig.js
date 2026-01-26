import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
// IMPORTANTE: Substitua estas credenciais pelas suas próprias do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyASSld4l8rbw6ZvRX4NHa9SasVjPap09bw",
  authDomain: "cozinha-delivery.firebaseapp.com",
  databaseURL: "https://cozinha-delivery-default-rtdb.firebaseio.com",
  projectId: "cozinha-delivery",
  storageBucket: "cozinha-delivery.firebasestorage.app",
  messagingSenderId: "667304449273",
  appId: "1:667304449273:web:b5ab3295b43e1be40f3e28"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
