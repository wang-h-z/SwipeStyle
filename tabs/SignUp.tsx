import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,} from 'react-native'
import React , { useState }from 'react'
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// TODO: Save information after navigating out of tab 
// TODO: Remove Stack Navigator Header

const Stack = createNativeStackNavigator();

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

export default function SignUp() {
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
      <View style={styles.formWrapper}>
        <Text 
          style={styles.title}>Enter Details Below
        </Text>
        <View 
          style={styles.inputWrapper}>
            <TextInput 
            style={styles.inputStyle} 
            placeholder='Your Name' 
            value={values.name}
            onChangeText={handleChange('name')}
            autoCapitalize='none'
            onBlur={() => setFieldTouched('name')}
            />
              <View style={styles.errorWrapper}>
                {touched.name && errors.name && 
                  (<Text style={styles.errorText}>{errors.name}</Text>)}
              </View>
        </View>
        <View 
          style={styles.inputWrapper}>
            <TextInput 
            style={styles.inputStyle} 
            placeholder='Email' 
            value={values.email}
            onChangeText={handleChange('email')}
            autoCapitalize='none'
            onBlur={() => setFieldTouched('email')}
            />
              <View style={styles.errorWrapper}>
                {touched.email && errors.email && 
                  (<Text style={styles.errorText}>{errors.email}</Text>)}
              </View>
        </View>
        <View 
          style={styles.inputWrapper}>
            <TextInput 
              style={styles.inputStyle} 
              placeholder='Password' 
              value={values.password}
              onChangeText={handleChange('password')}
              autoCapitalize='none'
              onBlur={() => setFieldTouched('password')}
            />
              <View style={styles.errorWrapper}>
                {touched.password && errors.password && 
                  (<Text style={styles.errorText}>{errors.password}</Text>)}
              </View>
        </View>
        <View 
          style={styles.inputWrapper}>
            <TextInput 
              style={styles.inputStyle} 
              placeholder='Confirm Password' 
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              autoCapitalize='none'
              onBlur={() => setFieldTouched('confirmPassword')}
              />
                <View style={styles.errorWrapper}>
                {touched.confirmPassword && errors.confirmPassword && 
                  (<Text style={styles.errorText}>{errors.confirmPassword}</Text>)}
              </View>
        </View>
        <TouchableOpacity 
          onPress={handleSubmit as () => void} 
          style={[styles.submitBtn, {backgroundColor: isValid ? '#395B64' : '#A5C9CA'}]}
          disabled={!isValid}
          >
            <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
    )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
  errorWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 15,
    color: '#00546a',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputStyle: {
    borderColor: '#16213E',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  submitBtn: {
    backgroundColor: '#395B64',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600'
  }
})