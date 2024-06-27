import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface PriceButtonProps {
  id: string; // Ensure PriceButtonProps includes an 'id' prop
  label: string;
  activeButton: string | null;
  handleButtonPress: (id: string) => void;
}

const PriceButton: React.FC<PriceButtonProps> = ({ id, label, activeButton, handleButtonPress }) => {
  return (
    <TouchableOpacity
      key={id} // Ensure each button has a unique key
      style={[
        styles.button,
        activeButton === id && styles.activeButton,
      ]}
      onPress={() => handleButtonPress(id)}
    >
      <Text style={styles.buttonText}>{label}</Text>
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
