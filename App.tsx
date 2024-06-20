import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeTab from './tabs/Home';
import CartTab from './tabs/Cart';
import AccountTab from './tabs/Account';
import LikedTab from './tabs/Liked';

import Ionicons from '@expo/vector-icons/Ionicons';

import useAuth from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import { LikedProvider } from './context/LikedContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? (
        <CartProvider>
        <LikedProvider>
        
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
              } else if (route.name === "Liked") {
                iconName = focused ? 'heart' : 'heart-outline'
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'turquoise',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeTab} />
          <Tab.Screen name="Liked" component={LikedTab} />
          <Tab.Screen name="Cart" component={CartTab} />
          <Tab.Screen name="Account" component={AccountTab} />

        </Tab.Navigator>
        
        </LikedProvider>
        </CartProvider>
      ) : (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;

