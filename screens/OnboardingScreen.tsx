import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import BrandScreen from './OnboardingScreens/BrandScreen';
import ColourPrefScreen from './OnboardingScreens/ColourPrefScreen';
import PriceRangeScreen from './OnboardingScreens/PriceRangeScreen';
import EndScreen from './OnboardingScreens/EndScreen';

const Stack = createNativeStackNavigator();

const OnboardingScreen = () => {
  return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='BrandScreen' component={BrandScreen} />
        <Stack.Screen name='ColourPrefScreen' component={ColourPrefScreen} />
        <Stack.Screen name='PriceRangeScreen' component={PriceRangeScreen} />
        <Stack.Screen name='EndScreen' component={EndScreen}/>
      </Stack.Navigator>
  )
}

export default OnboardingScreen
