import React from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView, Alert } from 'react-native';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase'; // Import Supabase instance
import useAuth from '../../hooks/useAuth'; // Assuming useAuth hook provides access to user

const { width, height } = Dimensions.get('screen');

const EndScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth(); // Assuming useAuth hook provides user information

  const handleNext = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ onboarded: true })
          .eq('id', user.id);

        if (error) {
          if (error instanceof Error) {
            console.error('Error updating onboarded status:', error.message);
            Alert.alert('Error', `Could not update onboarded status: ${error.message}`);
          } else {
            console.error('Unknown error updating onboarded status:', error);
            Alert.alert('Error', 'An unknown error occurred. Please try again.');
          }
        } else {
          console.log('Onboarded status updated successfully');
          navigation.navigate('Home'); // Navigate to Home screen after update
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Unexpected error updating onboarded status:', error.message);
          Alert.alert('Error', `Unexpected error: ${error.message}`);
        } else {
          console.error('Unexpected error:', error);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      }
    } else {
      Alert.alert('Error', 'User not found. Please log in again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>You're all set!</Text>
          <Text style={styles.description}>Let's get to swiping!</Text>
        </View>
        <View style={styles.backButtonContainer}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.nextButtonContainer}>
          <NextButton onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Adjust background color as needed
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    justifyContent: 'center',
    padding: 16,
    alignSelf: 'flex-start',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    padding: 4,
  },
  description: {
    fontSize: 20,
    padding: 4,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default EndScreen;

