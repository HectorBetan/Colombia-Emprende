import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuuJGLFCPHAJyvaKUytzr1e6VWZnwHuEw",
  authDomain: "colombia-emprende-app.firebaseapp.com",
  projectId: "colombia-emprende-app",
  storageBucket: "colombia-emprende-app.appspot.com",
  messagingSenderId: "340828725906",
  appId: "1:340828725906:web:3d2986090db91b02fcbc4b",
  measurementId: "G-TN6T3LT9E4"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);