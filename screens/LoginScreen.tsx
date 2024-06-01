import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LoginButton from '../components/LoginButton';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface Form {
    email: string;
    password: string;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [passwordVisible, setPasswordVisible] = useState(true);

  const firebaseSubmit = async (values: Form) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log('User signed in with:', userCredential.user.email);
        Alert.alert('Success', 'User signed in successfully');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error signing in:', error.message);
            Alert.alert('Error', error.message);
        } else {
            console.error('Unexpected sign in error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    }
  };

  const temp = () => {
    Alert.alert('Sorry. This feature is currently unavailable', 'Please register with your email and password.');
  };

  return (
    <Formik
    initialValues={{ email: '', password: '' }}
    onSubmit={firebaseSubmit}
    validationSchema={LoginSchema}
    >
    {({ values, errors, handleChange, handleSubmit }) => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.text}>Let's sign you in</Text>
      <View style={styles.textContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Enter Username or Email"
        placeholderTextColor="#A9A9A9"
        onChangeText={handleChange('email')}
        autoCapitalize='none'
        value={values.email}
      />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={passwordVisible}
          value={values.password}
          autoCapitalize='none'
          onChangeText={handleChange('password')}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.toggleButton}>
          <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#A9A9A9" />
        </TouchableOpacity>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={()=>temp()}>
          <Icon name="logo-google" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={()=>temp()}>
          <Icon name="logo-facebook" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={()=>temp()}>
          <Icon name="logo-apple" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.register}>Don't have an account? 
      
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
      <Text>Register</Text>
      </TouchableOpacity>
      
      
      </Text>
      <LoginButton title="Login" onPress={handleSubmit as () => void}></LoginButton>
      
    </View>
    )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: '40%',
  },

  backButton: {
    position: 'absolute',
    top: 90,
    left: 20,

  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: '8%',
    

  },
  text: {
    fontSize: 30,
    paddingTop: 10,
    paddingLeft: '8%',
    marginBottom: '20%',

  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    width: '85%',
    alignSelf: 'center',
    
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
  },
  toggleText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  toggleButton: {
    paddingHorizontal: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    width: '90%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#A9A9A9',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A9A9A9',
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#A9A9A9',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  register: {
    paddingTop:'3%',
    paddingBottom: '28%',
    alignSelf: 'center',
  },

  registerButton: {
    paddingLeft: 5,
    marginTop: -15,
  }
});

export default LoginScreen;
