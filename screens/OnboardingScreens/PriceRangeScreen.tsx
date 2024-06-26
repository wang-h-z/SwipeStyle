import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
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
