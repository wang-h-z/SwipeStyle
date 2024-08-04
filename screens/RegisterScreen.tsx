import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from '../lib/firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LoginButton from '../components/LoginButton';
import { getAuth, GoogleAuthProvider, } from "firebase/auth";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Min 8 characters')
    .matches(/[0-9]/, 'Requires a number')
    .matches(/[a-z]/, 'Requires a lowercase letter')
    .matches(/[A-Z]/, 'Requires an uppercase letter')
    .matches(/[^\w]/, 'Requires a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords don\'t match.')
    .required('Confirm Password is required')
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
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const provider = new GoogleAuthProvider();

  const firebaseSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting signup");

      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      console.log('User registered with:', user.email);

      // Update user profile with the name
      await updateProfile(user, { displayName: values.name });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: values.name,
        email: values.email,
      });

      Alert.alert('Success', 'User registered successfully');
      navigation.navigate("Login"); // Navigate to Login after successful registration
      
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
      onSubmit={firebaseSubmit}
    >
      {({values, errors, touched, handleChange, setFieldTouched, handleSubmit}) => (
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
            {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
            {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
            {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.toggleButton}>
              <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#A9A9A9"
              secureTextEntry={confirmPasswordVisible}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              autoCapitalize='none'
              onBlur={() => setFieldTouched('confirmPassword')}
            />
            {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.toggleButton}>
              <Icon name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.login}>
            Already have an account? 
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
    marginBottom: '10%',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
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
  login: {
    alignSelf: 'center',
  },
  loginButton: {
    paddingLeft: 5,
    marginTop: -3,
  }
});

export default RegisterScreen;
