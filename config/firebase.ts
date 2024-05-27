// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2nQSd3wYfX1REJ2-Sg4_jCz689S0a0n0",
  authDomain: "swipestyle-84f83.firebaseapp.com",
  projectId: "swipestyle-84f83",
  storageBucket: "swipestyle-84f83.appspot.com",
  messagingSenderId: "370802593665",
  appId: "1:370802593665:web:e227cdfd2d3ca64e25a280",
  measurementId: "G-47917TWSKY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});