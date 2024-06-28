import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Alert } from 'react-native';
import NextButton from '../../components/buttons/NextButton';
import BrandButton from '../../components/buttons/BrandButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase'; // Import Supabase instance
import useAuth from '../../hooks/useAuth'; // Assuming useAuth hook provides access to user
import BackButton from '../../components/buttons/BackButton';
import axios from 'axios';

import { useGender } from '../../context/GenderContext';

interface Brands {
  brand: string;
  image: string;
}

const BrandScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brands, setBrands] = useState<Brands[]|null>(null);
  const { gender } = useGender();

  const handleBrandSelection = (id: string) => {
    setSelectedBrands(prevSelectedBrands => {
        const updatedBrands = prevSelectedBrands.includes(id) 
            ? prevSelectedBrands.filter(brandId => brandId !== id)
            : [...prevSelectedBrands, id];
        return updatedBrands;
    });
  };

  const handleNext = async () => {
    if (user) {
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
        if (error instanceof Error)
        console.error('Unexpected error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } else {
      Alert.alert('Error', 'User not found. Please log in again.');
    }
  };
  
  const getBrands = async () => {
    try {
      console.log('Fetching data');
      //console.log('Gender: '+gender)
      const response = await axios.get(`https://styleswipe.azurewebsites.net/getBrands${gender}`, {
          headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
          },
      });
      if (response.data) {
          setBrands(response.data);
          console.log(brands);
      } else {
          console.error('Unexpected response structure:', response.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  useEffect(() => {    
    getBrands();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Hey {user?.name || 'Guest'},</Text>
        <Text style={styles.description}>Pick some brands that you like.</Text>
      </View>
      {brands && <View style={styles.buttonWrapper}>
        {brands.map((i) => (
          <BrandButton
            
            name={i.brand}
            url={i.image}
            onPress={handleBrandSelection}
            selected={selectedBrands.includes(i.brand)}
          />
        ))}
      </View>
      }
      
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
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
