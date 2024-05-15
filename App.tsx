import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ClothesCard from './components/ClothesCard';
import { useSharedValue } from  'react-native-reanimated';
import SwipeCard from './components/SwipeCard';
import Animated from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View)

export default function App() {
  return (
      <SwipeCard/>
  );
}

const styles = StyleSheet.create({

});

