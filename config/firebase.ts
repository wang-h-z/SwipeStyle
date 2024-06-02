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
  apiKey: process.env.EXPO_PUBLIC_FIREBASE,
  authDomain: "swipestyle-49ffc.firebaseapp.com",
  projectId: "swipestyle-49ffc",
  storageBucket: "swipestyle-49ffc.appspot.com",
  messagingSenderId: "940099973156",
  appId: "1:940099973156:web:0e1d131aebf16a03c0e8b1",
  measurementId: "G-9KDM3XTYRT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});