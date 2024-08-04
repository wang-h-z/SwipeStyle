import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqwEWafsRvTVicDRKdVjkPqte5iYCK5rM",
  authDomain: "swipestyle-49ffc.firebaseapp.com",
  projectId: "swipestyle-49ffc",
  storageBucket: "swipestyle-49ffc.appspot.com",
  messagingSenderId: "940099973156",
  appId: "1:940099973156:web:0e1d131aebf16a03c0e8b1",
  measurementId: "G-9KDM3XTYRT"
};
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Google Sign-In
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('User signed in:', user);
    // Handle signed-in user here
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
  }
};

export { auth, db, signInWithGoogle };
