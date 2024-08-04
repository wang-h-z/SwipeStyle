import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase'; 
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile extends User {
  name?: string;
}

export default function useAuthHook() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (user: User) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUser({ ...user, ...userDoc.data() } as UserProfile);
          } else {
            setUser(user); 
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(user); 
        }
      } else {
        setUser(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user };
}
