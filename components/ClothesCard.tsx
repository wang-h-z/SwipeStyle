import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default function ClothesCard() {
  return (
    <View style={styles.frameStyles}>
      <Image 
      source={{uri:"../assets/clothesData/c1.jpeg"}} 
      style={{width:250, height:250}}/>

      
    </View>
  
  ); 

};

const styles = StyleSheet.create({
  frameStyles: {
    justifyContent:'center',
    alignContent:'center',
    flex:1,
  },

});