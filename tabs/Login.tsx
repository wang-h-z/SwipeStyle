import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, TextInput } from 'react-native';
import { registerRootComponent } from 'expo';
import type { StatusBarStyle } from 'react-native';


//TODO: Valid Email
//TODO: Sign up Page
export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    console.log(email);
    console.log(password);
    return (
        <SafeAreaView style={styles.container}> 
        <Text style ={styles.title}>  Login</Text>
        <TextInput
            style={styles.textInput}
            placeholder={'Email'}
            keyboardType='email-address'
            autoCapitalize='none'
            onSubmitEditing={(value) => setEmail(value.nativeEvent.text)}/> 
        <TextInput
            style={styles.textInput}
            placeholder={'Password'}
            secureTextEntry={false} //set this to true or false to hide password
            autoCapitalize='none'
            onSubmitEditing={(value) => setPassword(value.nativeEvent.text)}/> 
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40,
        height: 120,
        width: 150,
    },
    textInput: {
        flex: 0.1,
        borderRadius: 10,
        width: 300,
        height: 5,
        margin: 10,
        borderWidth: 1,
        padding: 20,
    }
});

registerRootComponent(Login);