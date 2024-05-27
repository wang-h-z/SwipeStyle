import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, Button, Touchable, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer, useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SignUp from './SignUp';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

//TODO: Firebase Auth to track accounts 

interface Form {
    email: string;
    password: string;
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email'),
  });
  const navigation = useNavigation<NavigationProp<any>>();
  
export default function Login() {
    const firebaseSubmit = async (values: Form) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
          console.log('User signedin with:', userCredential.user.email);
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
    return (
        <Formik 
        initialValues={{email: '', password: ''}} 
        onSubmit={firebaseSubmit}
        validationSchema={LoginSchema}> 
        {({values, errors, handleChange, handleSubmit,}) => (
            <SafeAreaView style={styles.container}> 
            <Text style ={styles.title}>  Login</Text>
            <View style={styles.email}>
            <TextInput
                style={styles.textInput}
                placeholder={'Email'}
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={handleChange('email')}
                value={values.email}
                />
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                )}
                </View>
            <TextInput
                style={styles.textInput}
                placeholder={'Password'}
                secureTextEntry={false} //set this to true or false to hide password
                autoCapitalize='none'
                onChangeText={handleChange('password')}
                value={values.password}
                />
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit as () => void}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>       
            <View style={styles.signUp}>
                <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={styles.signUpButton}>Sign Up</Text>
                    </TouchableOpacity>
            </View>
            </SafeAreaView>
    )}
        </Formik>
        
    )
}
const styles = StyleSheet.create({
    email: {
        alignItems: 'flex-end',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF0D10',
        fontSize: 12,
    },
    title: {
        flex: 0.2,
        fontWeight: 'bold',
        fontSize: 40,
        height: 120,
        width: 150,
    },
    textInput: {
        borderRadius: 10,
        width: 300,
        height: 55,
        margin: 10,
        borderWidth: 1,
        padding: 20,
    },
    loginButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'lightblue',
        margin: 25,
        borderRadius: 10,
        width: 300,
        height: 50,
    },
    signUpButton: {
        color: 'blue',
    },
    loginText: {
        fontSize: 25,
        fontWeight: 'bold', 
    },
    signUp: {
        alignItems: 'center',
        flexDirection: 'row',
    }
});

