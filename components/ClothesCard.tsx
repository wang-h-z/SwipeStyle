import React from "react";
import { Text, ImageBackground, View, StyleSheet } from "react-native";
import { ClothesData } from "../types/ClothesData";

export default function ClothesCard(props:{clothesData: ClothesData}) {

  const {name, price, img, currency} = props.clothesData;
  return (
    <View style={styles.card}>
      <ImageBackground 
      source={{uri: img}} 
      style={styles.image}>
        <View style = {styles.cardInner}>
        
          <Text style={styles.name}>{name}</Text> 
          <Text style={styles.desc}>{currency+price}</Text>
        
        </View>
      </ImageBackground>
    </View>
  ); 

};

const styles = StyleSheet.create({

  card: {
    width: '93%',
    height: '90%',
    backgroundColor:'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,

    borderRadius: 10,
    
  },

  cardInner: {
    padding:10,
  },

  name: {
    fontSize:30,
    color:'white',
    fontWeight:'bold',

  },

  desc: {
    fontSize:18,
    color:'white',
    lineHeight:25,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end'
  }

});