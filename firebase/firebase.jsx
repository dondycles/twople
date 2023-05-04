// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkiOzxKaR9coJHNrB1yj68DAOptAtLOdc",
  authDomain: "twouple-by-dondy.firebaseapp.com",
  projectId: "twouple-by-dondy",
  storageBucket: "twouple-by-dondy.appspot.com",
  messagingSenderId: "802588974604",
  appId: "1:802588974604:web:ff457d5c395b7894a19829",
  measurementId: "G-2HK8JY9458",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
