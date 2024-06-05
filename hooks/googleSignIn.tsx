import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: '940099973156-2hlvhb4mvje1i2nthu7rcunr94i3vjt1.apps.googleusercontent.com',
});

export async function onGoogleButtonPress() {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the user's ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    Alert.alert('Error', 'Failed to sign in with Google');
  }
}
