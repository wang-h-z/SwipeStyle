import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign icon library

interface BrandButtonProps {
  url: string;
}

const BrandButton: React.FC<BrandButtonProps> = ({ url }) => {
  const [pressed, setPressed] = useState(false); 

  const handlePress = () => {
    setPressed(!pressed); 
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: url }} style={[styles.image, pressed && styles.imagePressed]} />
      {pressed && (
        <View style={styles.overlay}>
          <AntDesign name="check" size={24} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BrandButton;

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
  imagePressed: {
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
