import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, Alert } from 'react-native';
import PriceButton from '../../components/buttons/PriceButton';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase'; 
import PriceData from '../../data/PriceData'; 
import useAuth from '../../hooks/useAuth';

const { width, height } = Dimensions.get('screen');

export default function PriceRangeScreen() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useAuth();

  const handleButtonPress = (id: string) => {
    setActiveButton(id); // Set activeButton state
  };

  const handleNextPress = async () => {
    try {
      if (user && activeButton) {
        const { error } = await supabase
          .from('users')
          .update({ price_range: activeButton }) // Update 'priceRange' field with selected id
          .eq('id', user.id);

        if (error) {
          console.error('Error updating price range:', error.message);
          Alert.alert('Error', `Could not update price range: ${error.message}`);
        } else {
          console.log('Price range updated successfully');
          console.log(activeButton)
          navigation.navigate('EndScreen'); // Navigate to next screen upon successful update
        }
      } else {
        Alert.alert('Error', 'User not found or price range not selected.');
      }
    } catch (error) {
      if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
      Alert.alert('Error', `Unexpected error: ${error.message}`);
    }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Pick a price range.</Text>
      </View>
      <View style={styles.rangeWrapper}>
        {PriceData.map((priceRange) => (
          <PriceButton
            key={priceRange.id}
            id={priceRange.id}
            label={priceRange.label}
            activeButton={activeButton}
            handleButtonPress={handleButtonPress}
          />
        ))}
      </View>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={handleNextPress} />
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
    alignSelf: 'flex-start',
    padding: 16,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 4,
  },
  rangeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
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
