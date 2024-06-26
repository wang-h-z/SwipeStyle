import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Alert } from 'react-native';
import NextButton from '../../components/buttons/NextButton';
import BrandButton from '../../components/buttons/BrandButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase'; // Import Supabase instance
import useAuth from '../../hooks/useAuth'; // Assuming useAuth hook provides access to user
import brandData from '../../data/BrandData';

const { width, height } = Dimensions.get('screen');

const BrandScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const handleBrandSelection = (id: string) => {
    setSelectedBrands(prevSelectedBrands => {
      const index = prevSelectedBrands.indexOf(id);
      if (index === -1) {
        // Brand not selected, add it
        console.log('1');
        return [...prevSelectedBrands, id];
      } else {
        // Brand already selected, remove it
        console.log('2');
        return prevSelectedBrands.filter(brandId => brandId !== id);
      }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Hey {user?.name || 'Guest'},</Text>
        <Text style={styles.description}>Pick some brands that you like.</Text>
      </View>

      <View style={styles.buttonWrapper}>
        {brandData.map((brand) => (
          <BrandButton
            key={brand.id}
            id={brand.id}
            url={brand.url}
            onPress={handleBrandSelection}
            selected={selectedBrands.includes(brand.id)}
          />
        ))}
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
    backgroundColor: 'white', // Set background color to ensure it covers the entire screen
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
});

export default BrandScreen;
