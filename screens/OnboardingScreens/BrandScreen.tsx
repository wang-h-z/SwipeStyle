import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import BrandButton from '../../components/buttons/BrandButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import brandData from '../../data/BrandData';

const { width, height } = Dimensions.get('screen');

export default function BrandScreen() {
  const user = useAuth().user;
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Hey {user?.displayName},</Text>
        <Text style={styles.description}>Pick some brands that you like.</Text>
      </View>

      <View style={styles.buttonWrapper}>
        {brandData.map((brand) => (
          <BrandButton key={brand.id} url={brand.url} />
        ))}
      </View>

      <View style={styles.nextButtonContainer}>
        <NextButton onPress={() => navigation.navigate('ColourPrefScreen')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: 'center'
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
    padding: 4
  },
  buttonWrapper: {
    alignSelf: 'flex-start',
    padding: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 200, 
    right: 20, 
  }
})