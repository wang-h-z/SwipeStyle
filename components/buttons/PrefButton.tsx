import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';

interface PrefButtonProps {
  colorCode: string;
  colorText: string;
}

const PrefButton: React.FC<PrefButtonProps> = ({ colorCode, colorText }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity 
      style={[styles.button, isPressed && styles.buttonPressed]} 
      onPressIn={() => setIsPressed(true)} 
      onPressOut={() => setIsPressed(false)}
    >
    <View style={styles.wrapper}>
    <View style={[styles.colorCircle, { backgroundColor: colorCode }]} />
    <Text style={styles.text}>{colorText}</Text>
    </View>
    </TouchableOpacity>
    
  );
};

export default PrefButton;

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 12,
    borderColor: 'black',
    borderWidth: 1,
    flexShrink: 0,
  }, 
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttonPressed: {
    backgroundColor: 'grey',
  },
  colorCircle: {
    borderRadius: 10,
    height: 20,
    width: 20,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    flexShrink: 1,
    overflow: 'hidden'
  }
});