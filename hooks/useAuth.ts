import { useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';  // Importing FirebaseAuthTypes to get the User type

export default function useAuth() {
    // Correctly type the state to be either a User or null
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('User is signed in:', user);
                setUser(user);  // User is of type FirebaseAuthTypes.User
            } else {
                console.log('No user is signed in');
                setUser(null);  // Setting state to null
            }
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    return { user };
}
