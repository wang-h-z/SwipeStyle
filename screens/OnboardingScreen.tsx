import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import BrandScreen from './OnboardingScreens/BrandScreen';
import GenderScreen from './OnboardingScreens/GenderScreen';
import ColourPrefScreen from './OnboardingScreens/ColourPrefScreen';
import PriceRangeScreen from './OnboardingScreens/PriceRangeScreen';
import EndScreen from './OnboardingScreens/EndScreen';
import MainTabs from '../tabs/Main';
import useAuth from '../hooks/useAuth';

import { supabase } from '../lib/supabase';


import { GenderProvider } from '../context/GenderContext';

const Stack = createNativeStackNavigator();


const OnboardingScreen = () => {
  return (
    <GenderProvider>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='GenderScreen' component={GenderScreen} />
        <Stack.Screen name='BrandScreen' component={BrandScreen} />
        <Stack.Screen name='ColourPrefScreen' component={ColourPrefScreen} />
        <Stack.Screen name='PriceRangeScreen' component={PriceRangeScreen} />
        <Stack.Screen name='EndScreen' component={EndScreen}/>
        
        
        
      </Stack.Navigator>
    </GenderProvider>
  )
}

export default OnboardingScreen
