import React from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
  title: string;
  color?: string;
  textColor?: string;
  opStyles?: object;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, color, textColor, opStyles, onPress }) => {
  const colour = color || '#000000'; //Default colour is black
  const textColour = textColor || '#FFFFFF'; //Default text colour is white
  
  return (
    <TouchableOpacity style={[styles.button, {backgroundColor:colour}, opStyles]} onPress={onPress}>
      <Text style={[styles.buttonText, {color:textColour}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%', // Adjust width of button
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
