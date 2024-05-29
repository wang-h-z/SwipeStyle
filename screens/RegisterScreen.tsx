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
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Please enter your full name.'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email address.'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters long')
    .required('Please enter your password.')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Your Passwords do not match.')
      .required('Please confirm your password')
});

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [passwordVisible, setPasswordVisible] = useState(true);
  const firebaseSubmit = async (values: FormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      console.log('User registered with:', userCredential.user.email);
      Alert.alert('Success', 'User registered successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error registering user:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('Unexpected sign up error:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <Formik 
    initialValues={{
      name: '',
      email: '',
      password: '',
      confirmPassword: '' 
    }} 
    validationSchema={SignupSchema}
    onSubmit={firebaseSubmit}>
      {({values, errors, touched, handleChange, setFieldTouched, isValid, handleSubmit}) => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>Let's bring you onboard</Text>
      <View style={styles.textContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Username"
        placeholderTextColor="#A9A9A9"
        value={values.name}
        onChangeText={handleChange('name')}
        autoCapitalize='none'
        onBlur={() => setFieldTouched('name')}
      />
      </View>
      <View style={styles.textContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Email"
        placeholderTextColor="#A9A9A9"
        value={values.email}
        onChangeText={handleChange('email')}
        autoCapitalize='none'
        onBlur={() => setFieldTouched('email')}
      />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={passwordVisible}
          value={values.password}
          onChangeText={handleChange('password')}
          autoCapitalize='none'
          onBlur={() => setFieldTouched('password')}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.toggleButton}>
          <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#A9A9A9" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={passwordVisible}
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          autoCapitalize='none'
          onBlur={() => setFieldTouched('confirmPassword')}
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
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="logo-google" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="logo-facebook" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="logo-apple" size={30} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.login}>Already have an account? 
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
      <Text>Login</Text>
      </TouchableOpacity>
      
      
      </Text>
      <LoginButton title="Register" onPress={handleSubmit as () => void}></LoginButton>
      
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
  login: {
    alignSelf:'center',
  },
  loginButton: {
    paddingLeft:10,
  }
 
});

export default RegisterScreen;
