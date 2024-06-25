import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../tabs/Login';
import SignUp from '../tabs/SignUp';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}