import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface PriceButtonProps {
  priceRange: string;
  activeButton: string | null;
  handleButtonPress: (priceRange: string) => void;
}

const PriceButton: React.FC<PriceButtonProps> = ({ priceRange, activeButton, handleButtonPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        activeButton === priceRange && styles.activeButton,
      ]}
      onPress={() => handleButtonPress(priceRange)}
    >
      <Text style={styles.buttonText}>{priceRange}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 60,
    marginVertical: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: 'rgba(140, 140, 140, 0.5)', // Grey overlay with transparency
  },
});

export default PriceButton;