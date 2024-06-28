import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign icon library

interface BrandButtonProps {
  url: string;
  name: string;
  onPress: (id: string) => void; 
  selected: boolean; 
}

const BrandButton: React.FC<BrandButtonProps> = ({ name, url, onPress, selected }) => {
  
  const handlePress = () => {
    onPress(name); 
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: url }} style={[styles.image, selected && styles.imageSelected]} />
      {selected && (
        <View style={styles.overlay}>
          <AntDesign name="check" size={24} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    position: 'relative',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  imageSelected: {
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BrandButton;
