// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl_vO0FEYQlIm49ICEFsMQahXnrYRwkQc",
  authDomain: "hostel-de-luz.firebaseapp.com",
  projectId: "hostel-de-luz",
  storageBucket: "hostel-de-luz.appspot.com",
  messagingSenderId: "367899159020",
  appId: "1:367899159020:web:9b401e989a1eb3f4c338c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage();