import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import PrefButton from '../../components/buttons/PrefButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { ColorData } from '../../data/ColorData';

const { width, height } = Dimensions.get('screen');

const data = [
  { id: '1', colorCode: '#FF0000', colorText: 'Red' },
  { id: '2', colorCode: '#00FF00', colorText: 'Green' },
  { id: '3', colorCode: '#0000FF', colorText: 'Blue' },
  { id: '4', colorCode: '#FFFF00', colorText: 'Yellow' },
  { id: '5', colorCode: '#FF00FF', colorText: 'Magenta' },
  { id: '6', colorCode: '#00FFFF', colorText: 'Cyan' },
  { id: '7', colorCode: '#800080', colorText: 'Purple' },
  { id: '8', colorCode: '#FFA500', colorText: 'Orange' },
  { id: '9', colorCode: '#A52A2A', colorText: 'Brown' },
  { id: '10', colorCode: '#008000', colorText: 'Dark Green' },
  { id: '11', colorCode: '#800000', colorText: 'Maroon' },
  { id: '12', colorCode: '#808000', colorText: 'Olive' },
];

export default function ColourPrefScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>What do you prefer?</Text>
        <Text style={styles.description}>Help us understand you better by choosing a few colours!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ColorData.map(item => (
          <PrefButton key={item.id} colorCode={item.colorCode} colorText={item.colorText} />
        ))}
      </ScrollView>
      <View style={styles.backButtonContainer}>
      <BackButton onPress={() => navigation.goBack()}></BackButton>
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={() => navigation.navigate('PriceRangeScreen')} />
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
  description: {
    fontSize: 20,
    padding: 4,
  },
  scrollViewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
    padding: 4,
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
