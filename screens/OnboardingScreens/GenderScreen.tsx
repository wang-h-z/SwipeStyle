import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import GenderButton from '../../components/buttons/GenderButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from '../../context/OnboardingContext';
import { useGender } from '../../context/GenderContext';
import ProgressBar from '../../components/ProgressBar';

export default function GenderScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women' | ''>('');
  const { user } = useAuth();
  const { updateGender } = useGender();
  const { setCurrentStep, currentStep } = useOnboarding();

  useEffect(() => {
    setCurrentStep(1);
  }, []);

  const handleNext = async () => {
    updateGender(selectedGender);
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ gender: selectedGender })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating gender:', error.message);
          Alert.alert('Error', `Could not update gender: ${error.message}`);
        } else {
          console.log('Gender updated successfully');
          navigation.navigate('BrandScreen');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Unexpected error:', error.message);
          Alert.alert('Error', `Unexpected error: ${error.message}`);
        }
      }
    } else {
      Alert.alert('Error', 'User not found. Please log in again.');
    }
  };

  const handleGenderPress = (gender: 'Men' | 'Women') => {
    setSelectedGender(gender);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar totalSteps={5} currentStep={currentStep} />
      <View style={styles.title}>
        <Text style={styles.titleText}>What is your gender?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <GenderButton
          side="left"
          onPress={() => handleGenderPress('Men')}
          title="Male"
          isSelected={selectedGender === 'Men'}
        />
        <GenderButton
          side="right"
          onPress={() => handleGenderPress('Women')}
          title="Female"
          isSelected={selectedGender === 'Women'}
        />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
    paddingVertical: 4,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  space: {
    width: 20,
  },
});
