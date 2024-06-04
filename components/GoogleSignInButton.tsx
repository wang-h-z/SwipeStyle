import React, { useEffect } from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '597431037560-35rhi5m4ffsj1khv45e383mfvushfb66.apps.googleusercontent.com',
    iosClientId: '597431037560-8jl84nteitm41tehtvdfsfte3etjdg06.apps.googleusercontent.com',
    webClientId: '597431037560-35rhi5m4ffsj1khv45e383mfvushfb66.apps.googleusercontent.com',
    redirectUri: makeRedirectUri()
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'User signed in with Google');
        })
        .catch((error) => {
          Alert.alert('Error', (error as Error).message);
        });
    }
  }, [response]);

  return (
    <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
      <Icon name="logo-google" size={30} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

export default GoogleSignInButton;
