import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import OnboardingScreen from './screens/OnboardingScreen';
import { supabase } from './lib/supabase';
import MainTabs from './tabs/Main';

import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, loading, onboarded } = useAuth();

  if (loading) {
    return null; // Add a loading spinner or screen here
  }

  return (
    <NavigationContainer>
      {user ? (
        onboarded ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
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
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
