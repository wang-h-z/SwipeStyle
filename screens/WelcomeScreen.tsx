import React from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LoginButton from '../components/LoginButton'; // adjust the path as needed



export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const LoginPress = () => {
    navigation.navigate('Login');
  }
  const RegisterPress = () => {
    navigation.navigate('Register');  
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/shopping.jpeg')} />
      <Text style={styles.title}>Welcome to {"\n"} StyleSwipe</Text>
      <Text style={styles.text}>A one-stop app for all your {"\n"} shopping needs!</Text>
      <LoginButton title="Login" color="#778da9" onPress={LoginPress}></LoginButton>
      <LoginButton title="Register" onPress={RegisterPress}></LoginButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '20%',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  }
});
