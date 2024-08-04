import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  onboarded?: boolean; 
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  onboarded: boolean;
  setOnboarded: (onboarded: boolean) => void;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async (user: User) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userProfile = userDoc.data() as UserProfile;
            setUser({ id: user.uid, email: user.email ?? undefined, name: userProfile.name });
            setOnboarded(userProfile.onboarded ?? false);
            setName(userProfile.name ?? '');
          } else {
            setUser({ id: user.uid, email: user.email ?? undefined });
            setOnboarded(false);
            setName('');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user);
      } else {
        setUser(null);
        setOnboarded(false);
        setName('');
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, name, loading, onboarded, setOnboarded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
