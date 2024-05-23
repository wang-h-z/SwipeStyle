import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput, Button, Touchable, TouchableOpacity, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import type { StatusBarStyle } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

//TODO: Valid Email --> using Formik Library
//TODO: Sign up Page --> use react-navigation
//TODO: Firebase Auth to track accounts 
// Dependencies: 
// npm install @react-navigation/native
// npm install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install formik --save
// npm install yup --save

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const loginPress = () => console.log("youre gay");
    const signUp = () => console.log("fuck you");
    console.log(email);
    console.log(password);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required(''),
      });
        
    return (
        <Formik 
        initialValues={{email: '',}} 
        onSubmit={value => Alert.alert('hello')}
        validationSchema={LoginSchema}> 
        {({values, errors, handleChange, handleSubmit, setFieldTouched, touched}) => (
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
                onSubmitEditing={(value) => setEmail(value.nativeEvent.text)}/>
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                )}
                </View>
            <TextInput
                style={styles.textInput}
                placeholder={'Password'}
                secureTextEntry={false} //set this to true or false to hide password
                autoCapitalize='none'
                onSubmitEditing={(value) => setPassword(value.nativeEvent.text)}/>
            <TouchableOpacity style={styles.loginButton} onPress={()=>handleSubmit}>
                <Text style={styles.loginText}>
                Login</Text>
            </TouchableOpacity>       
            <View style={styles.signUp}>
                <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => handleSubmit}>
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

registerRootComponent(Login);