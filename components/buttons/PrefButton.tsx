import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';

interface PrefButtonProps {
  colorCode: string;
  colorText: string;
  onPress: () => void;
  selected: boolean;
}

const PrefButton: React.FC<PrefButtonProps> = ({ colorCode, colorText, onPress, selected }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, selected && styles.buttonPressed]} 
      onPress={onPress}
    >
      <View style={styles.wrapper}>
        <View style={[styles.colorBox, { backgroundColor: colorCode }]} />
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{colorText}</Text>
          <Text style={styles.codeText}>{colorCode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PrefButton;

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: 140,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 12,
    borderColor: 'black',
    borderWidth: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: 'grey',
  },
  colorBox: {
    borderRadius: 12,
    height: 20,
    width: 40,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#000', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, 
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 64, 
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  codeText: {
    fontSize: 8,
    textAlign: 'center', 
  },
});
