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
              <CartProvider>
                <LikedProvider>
                  <CollectionsProvider>
                    <Tab.Navigator
                      initialRouteName='Home'
                      screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                          let iconName;

                          if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                          } else if (route.name === 'Cart') {
                            iconName = focused ? 'cart' : 'cart-outline';
                          } else if (route.name === 'Account') {
                            iconName = focused ? 'person' : 'person-outline';
                          } else if (route.name === 'Liked') {
                            iconName = focused ? 'heart' : 'heart-outline';
                          }

                          return <Ionicons name={iconName as any} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: 'turquoise',
                        tabBarInactiveTintColor: 'gray',
                      })}
                    >
                      <Tab.Screen name="Home" component={HomeTab} />
                      <Tab.Screen name="Liked" component={LikedScreen} options={{ headerShown: false }} />
                      <Tab.Screen name="Cart" component={CartTab} />
                      <Tab.Screen name="Account" component={AccountTab} />
                    </Tab.Navigator>
                  </CollectionsProvider>
                </LikedProvider>
              </CartProvider>
            ) : (
              <OnboardingScreen />
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
