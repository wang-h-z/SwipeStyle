import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeTab from './tabs/Home';
import CartTab from './tabs/Cart';
import AccountTab from './tabs/Account';
import LikedScreen from './tabs/Liked';
import useAuth from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { CartProvider } from './context/CartContext';
import { LikedProvider } from './context/LikedContext';
import { CollectionsProvider } from './context/CollectionsContext';
import OnboardingScreen from './screens/OnboardingScreen';
import { supabase } from './lib/supabase';
import EndScreen from './screens/OnboardingScreens/EndScreen';
import MainTabs from './tabs/Main';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const { user } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardedStatus = async () => {
      if (user) {
        try {
          // Fetch onboarded status from Supabase 'profiles' table
          const { data: profile, error } = await supabase
            .from('users')
            .select('onboarded')
            .eq('id', user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }

          setOnboarded(profile?.onboarded ?? false);
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
  }, [user]);

  return (
    <NavigationContainer>
      {!loading && (
        <>
          {user ? (
            onboarded ? (
              <MainTabs/>
            ) : (
              <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              </Stack.Navigator>
            )
          ) : (
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          )}
        </>
      )}
    </NavigationContainer>
  );
};

export default App;
