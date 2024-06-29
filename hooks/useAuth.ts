import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { User } from '@supabase/supabase-js'; // Import the necessary types

export default function useAuthHook() {
  const [user, setUser] = useState<User & { name?: string } | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        const user = data?.session?.user ?? null;
        if (user) {
          // Fetch user profile data from 'users' table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError.message);
            setUser(null); // Set user without name if there's an error
          } else {
            setUser({ ...user, ...profile }); // Merge user object with profile data
          }
        }
      }
    };

    getSession();

    // Listen for changes in authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) {
        // Fetch user profile data from 'users' table
        supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching profile:', profileError.message);
              setUser(user); // Set user without name if there's an error
            } else {
              setUser({ ...user, ...profile }); // Merge user object with profile data
            }
          });
      } else {
        setUser(null);
      }
    });

    // Cleanup the listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user };
}
