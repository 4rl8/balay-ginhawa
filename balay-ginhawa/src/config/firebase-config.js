// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

console.log("FIREBASE CONFIG:", firebaseConfig);

console.log(import.meta.env.VITE_API_KEY);


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app

export const db = getFirestore(app);
// For debugging purposes
console.log(db.app.options.projectId); 
console.log("Project ID:", firebaseConfig.projectId);


