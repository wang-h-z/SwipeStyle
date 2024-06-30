import React, {useState} from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, SafeAreaView, Alert, TouchableOpacity} from 'react-native';
import PrefButton from '../../components/buttons/PrefButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { ColorData } from '../../data/ColorData'; 
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

import { useGender } from '../../context/GenderContext';

export default function GenderScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const { user } = useAuth();
  const { updateGender } = useGender();

  const handleNext = async () => {
    updateGender(selectedGender);
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ gender: selectedGender })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating colors:', error.message);
          Alert.alert('Error', `Could not update colors: ${error.message}`);
        } else {
          console.log('Gender updated successfully');
          console.log(selectedGender)
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>What is your gender?</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, selectedGender === 'Men' && styles.selectedButton]}
        onPress={() => setSelectedGender('Men')}
      >
        <Text style={styles.buttonText}>Male</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedGender === 'Women' && styles.selectedButton]}
        onPress={() => setSelectedGender('Women')}
      >
        <Text style={styles.buttonText}>Female</Text>
      </TouchableOpacity>


      <View style={styles.nextButtonContainer}>
        <NextButton onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color to ensure it covers the entire screen
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
  description: {
    fontSize: 20,
    paddingVertical: 4,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    marginVertical: 10,
  },
  selectedButton: {
    backgroundColor: '#87ceeb',
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
});
