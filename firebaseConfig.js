// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKLQvH2lIY7idOJKeHaS0-_yhpO3UCUkA",
  authDomain: "lab5todo-5c6fd.firebaseapp.com",
  projectId: "lab5todo-5c6fd",
  storageBucket: "lab5todo-5c6fd.appspot.com",
  messagingSenderId: "495883336264",
  appId: "1:495883336264:web:9808e047e63c97eeaf767d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
