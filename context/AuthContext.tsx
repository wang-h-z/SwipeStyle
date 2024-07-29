import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import useAuthHook from '../hooks/useAuth';

interface User {
  id: string;
  email?: string;
  name?: string;
  
}

interface AuthContextType {
  user: User | null;
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
  const { user } = useAuthHook();

  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const fetchOnboardedStatus = async () => {
        if (user) {
          try {
            // Fetch onboarded status from Supabase 'profiles' table
            console.log("fetching onboarded status")
            const { data: profile, error } = await supabase
              .from('users')
              .select('onboarded, name')
              .eq('id', user.id)
              .single();
  
            if (error) {
              throw new Error(error.message);
            }
  
            setOnboarded(profile?.onboarded ?? false);
            setName(profile?.name)
            console.log(profile)
          } catch (error) {
            if (error instanceof Error) {
              console.error('Error fetching onboarded status:', error.message);
              // Handle error fetching onboarded status
            } else {
              console.log('Unknown Error', error)
            }
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };

    fetchOnboardedStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setTimeout(async () => {
          console.log('hi')
          const { data } = await supabase
            .from('users')
            .select('onboarded, name')
            .eq('id', session?.user?.id)
            .single();

          setOnboarded(data?.onboarded || false);
          setName(data?.name)
          console.log(data?.name)
        }, 1000)
      } else {
        setOnboarded(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
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
