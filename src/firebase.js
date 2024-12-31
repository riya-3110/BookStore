import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBitRL29Li_JrP9wSPTNiqehtj5vZuRgPs",
  authDomain: "crud-node-firebase-30927.firebaseapp.com",
  projectId: "crud-node-firebase-30927",
  storageBucket: "crud-node-firebase-30927.firebasestorage.app",
  messagingSenderId: "501491791467",
  appId: "1:501491791467:web:ac454353c5b8cb82d2a32e",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
