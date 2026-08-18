import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZL9WwUrdeL4akdqi42ySVcn8x_CNcWOY",
  authDomain: "contratacao-ae5c1.firebaseapp.com",
  projectId: "contratacao-ae5c1",
  storageBucket: "contratacao-ae5c1.firebasestorage.app",
  messagingSenderId: "929951198539",
  appId: "1:929951198539:web:10360d577886a2873b0cce",
  measurementId: "G-XRJWXNC680"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
