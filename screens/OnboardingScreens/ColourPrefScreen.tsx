import React from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import PrefButton from '../../components/buttons/PrefButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { ColorData } from '../../data/ColorData'; 

const { width, height } = Dimensions.get('screen');

export default function ColourPrefScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={styles.container}>
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
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={() => navigation.navigate('PriceRangeScreen')} />
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
});
