import React, {useState} from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, SafeAreaView, Alert} from 'react-native';
import PrefButton from '../../components/buttons/PrefButton';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import NextButton from '../../components/buttons/NextButton';
import BackButton from '../../components/buttons/BackButton';
import { ColorData } from '../../data/ColorData'; 
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const { width, height } = Dimensions.get('screen');

export default function ColourPrefScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const { user } = useAuth();

  const handleColorSelection = (id: string) => {
    setSelectedColors(prevSelectedColors => {
        const updatedColors = prevSelectedColors.includes(id) 
            ? prevSelectedColors.filter(colorId => colorId !== id) 
            : [...prevSelectedColors, id];
        return updatedColors;
    });
};


  const handleNext = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ colors: selectedColors })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating colors:', error.message);
          Alert.alert('Error', `Could not update colors: ${error.message}`);
        } else {
          console.log('Colors updated successfully');
          console.log(selectedColors)
          navigation.navigate('PriceRangeScreen');
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
        <Text style={styles.titleText}>What do you prefer?</Text>
        <Text style={styles.description}>Help us understand you better by choosing a few colours!</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ColorData.map(item => (
          <PrefButton
            key={item.id}
            colorCode={item.colorCode}
            colorText={item.colorText}
            onPress={() => handleColorSelection(item.id)}
            selected={selectedColors.includes(item.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.nextButtonContainer}>
        <NextButton onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const stylesa = StyleSheet.create({
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
  scrollViewContent: {
    alignItems: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

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
