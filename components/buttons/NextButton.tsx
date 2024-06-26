import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NextButtonProps {
  onPress: () => void
}

const NextButton: React.FC<NextButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#249D9F',
    padding: 10,
    borderRadius: 70,
    height: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NextButton;