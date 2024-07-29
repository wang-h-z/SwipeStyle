import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import NextButton from '../../components/buttons/NextButton';
import BrandButton from '../../components/buttons/BrandButton';
import BackButton from '../../components/buttons/BackButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { useGender } from '../../context/GenderContext';
import { useOnboarding } from '../../context/OnboardingContext'; 
import useAuthHook from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase'; 
import ProgressBar from '../../components/ProgressBar';

import { useAuth } from '../../context/AuthContext';

interface Brands {
  brand: string;
  image: string;
}

const BrandScreen: React.FC = () => {
  const { user } = useAuthHook();
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const { gender } = useGender();
  const { setCurrentStep, currentStep} = useOnboarding(); 

  const { name } = useAuth();
  const handleBrandSelection = (id: string) => {
    setSelectedBrands(prevSelectedBrands => {
      const updatedBrands = prevSelectedBrands.includes(id)
        ? prevSelectedBrands.filter(brandId => brandId !== id)
        : [...prevSelectedBrands, id];
      return updatedBrands;
    });
  };

  const handleNext = async () => {
    if (user && selectedBrands.length > 0) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ brands: selectedBrands })
          .eq('id', user.id);
        if (error) {
          console.error('Error updating brands:', error.message);
          Alert.alert('Error', `Could not update brands: ${error.message}`);
        } else {
          console.log('Brands updated successfully');
          console.log(selectedBrands)
          navigation.navigate('ColourPrefScreen');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Unexpected error:', error.message);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      }
    } else {
      if (!user) {
        Alert.alert('Error', 'User not found. Please log in again.');
      } else {
        Alert.alert('Error', 'No brands selected. Please select at least 1 brand.');
      }
    }
  };

  const handleBack = async () => {
    setCurrentStep(1)
    navigation.goBack()
  }

  const getBrands = async () => {
    try {
      console.log('Fetching Brands Data');
      const response = await axios.get(`https://styleswipe.azurewebsites.net/getBrands${gender}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      if (response.data) {
        setBrands(response.data);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {    
    getBrands();
    setCurrentStep(2);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar totalSteps={5} currentStep={currentStep}/>
      <View style={styles.title}>
        <Text style={styles.titleText}>Hey {name || 'Guest'},</Text>
        <Text style={styles.description}>Pick some brands that you like.</Text>
      </View>
      {brands && <View style={styles.buttonWrapper}>
        {brands.map((brand) => (
          <BrandButton
            key={brand.brand}
            name={brand.brand}
            url={brand.image}
            onPress={handleBrandSelection}
            selected={selectedBrands.includes(brand.brand)}
          />
        ))}
      </View>}
      <View style={styles.backButtonContainer}>
        <BackButton onPress={handleBack} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
  buttonWrapper: {
    alignSelf: 'flex-start',
    padding: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust this value based on your design needs
    right: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});

export default BrandScreen;
