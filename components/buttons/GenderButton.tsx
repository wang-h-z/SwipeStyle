import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

interface GenderButtonProps {
  side: 'left' | 'right';
  onPress: () => void;
  title: string;
  isSelected: boolean; // New prop to indicate if the button is selected
}

const GenderButton: React.FC<GenderButtonProps> = ({ side, onPress, title, isSelected }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={[
        styles.button, 
        side === 'left' ? styles.leftButton : styles.rightButton, 
        isSelected && styles.selectedButton
      ]}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>{title}</Text>
        <View style={styles.iconContainer}>
          {side === 'left' ? (
            <FontAwesome name="mars" size={24} color="white" />
          ) : (
            <FontAwesome name="venus" size={24} color="white" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 240,
    marginHorizontal: 10,
  },
  button: {
    width: 140,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 100,
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  leftButton: {
    backgroundColor: 'skyblue',
  },
  rightButton: {
    backgroundColor: 'pink',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  selectedText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  selectedButton: {
    borderColor: '#000', // Change borderColor when selected
    elevation: 20, // Increase elevation for selected state
  },
});

export default GenderButton;



