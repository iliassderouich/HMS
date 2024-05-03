// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyC-Y8ibZ_oqTFizDkPy4us0BISguJBcyx4",
  authDomain: "hospital-management-system3105.firebaseapp.com",
  databaseURL: "https://hospital-management-system3105-default-rtdb.firebaseio.com",
  projectId: "hospital-management-system3105",
  storageBucket: "hospital-management-system3105.appspot.com",
  messagingSenderId: "378037666393",
  appId: "1:378037666393:web:6eed5fd186976f8b46a748"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);