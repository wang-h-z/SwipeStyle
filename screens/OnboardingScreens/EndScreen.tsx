import { StyleSheet, View, Text, Dimensions } from 'react-native'
import React from 'react'
import NextButton from '../../components/buttons/NextButton'
import BackButton from '../../components/buttons/BackButton'
import { useNavigation, NavigationProp } from '@react-navigation/native';

const {width, height} = Dimensions.get('screen')
export default function EndScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>You're all set!</Text>
        <Text style = {styles.description}>Let's get to swiping!</Text>
      </View>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={()=>console.log('Next')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center',
  },
  title: {
    justifyContent: 'center',
    padding: 16,
    alignSelf: 'flex-start',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 4,
  },
  description: {
    fontSize: 20,
    padding: 4,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 200, 
    right: 20, 
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 200,
    left: 20,
  },
})