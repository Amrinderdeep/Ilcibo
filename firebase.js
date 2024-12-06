// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYp2i7cYV0bAk9lEQgsOtIsDTwbc847ak",
  authDomain: "food-del-9a058.firebaseapp.com",
  projectId: "food-del-9a058",
  storageBucket: "food-del-9a058.firebasestorage.app",
  messagingSenderId: "774581370918",
  appId: "1:774581370918:web:b316e835e69241379f66e7",
  measurementId: "G-50CQY72PLW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)