import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import PriceButton from '../../components/buttons/PriceButton';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import priceRanges from '../../data/PriceData';

const { width, height } = Dimensions.get('screen');

export default function PriceRangeScreen() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const handleButtonPress = (priceRange: string) => {
    setActiveButton(priceRange);
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Pick a price range.</Text>
      </View>
      <View style={styles.rangeWrapper}>
        {priceRanges.map((priceRange) => (
          <PriceButton
            key={priceRange}
            priceRange={priceRange}
            activeButton={activeButton}
            handleButtonPress={handleButtonPress}
          />
        ))}
      </View>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={() => navigation.navigate('EndScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
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
    padding: 4,
  },
  rangeWrapper: {
    justifyContent: 'center',
    alignContent: 'center',
    padding: 12,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 200, 
    right: 20, 
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 200,
    left: 20,
  },
});
