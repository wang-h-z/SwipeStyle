import React, { useEffect } from "react";
import { Text, ImageBackground, View, StyleSheet, TouchableOpacity } from "react-native";
import { ClothesCardProps } from "../types/ClothesCardProps";
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function ClothesCard(props: { 
  clothesData: ClothesCardProps,
  start: number,
  setStart: (start: number) => void,
  leftTap: () => void,
  rightTap: () => void
}) {
  const { name, price, image } = props.clothesData;
  const { start, setStart, leftTap, rightTap } = props;

  const final_price = price[0] + parseFloat(price[1]).toFixed(2);

  useEffect(() => {
    setStart(props.clothesData.start); 
  }, [props.clothesData.start]);

  if (start < 0 || start >= image.length) {
    setStart(0);
    return null;
  }

  const saveButton = () => {
    console.log('Saved')
  }

  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: image[start].url }} style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.desc}>{final_price}</Text>
        </View>
        <View style={styles.indicatorBar}>
          {image.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorSegment,
                index === start ? styles.activeSegment : styles.inactiveSegment
              ]}
            />
          ))}
        </View>
      </ImageBackground>
      <TouchableOpacity style={styles.leftTapArea} onPress={leftTap} />
      <TouchableOpacity style={styles.rightTapArea} onPress={rightTap} />
      <TouchableOpacity style={styles.saveButton} onPress={saveButton}>
        <View style={styles.iconContainer}>
          <Ionicons name="bookmark" size={30} color="white" style={styles.iconFill} />
          <Ionicons name="bookmark-outline" size={30} color="black" style={styles.iconOutline} />
        </View>
      </TouchableOpacity>
      
      {/* Ratings icon 
       <View style={styles.ratings}>
      <View style={styles.iconContainer}>
        <FontAwesome name="star" size={30} color="gold" style={styles.iconFill} />
        <FontAwesome name="star-o" size={30} color="black" style={styles.iconOutline} />
        </View>
      </View>
      */}
      
    </View>
  );
}


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
    shadowOpacity: 0.3,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2,
  },

  desc: {
    fontSize:18,
    color:'white',
    lineHeight:25,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end'
  },
  leftTapArea: {
    position: 'absolute',
    left: 0,
    width: '25%',
    height: '100%',
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    width: '25%',
    height: '100%',
  },

  indicatorBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  indicatorSegment: {
    flex: 1,
    height: "100%",
    marginHorizontal: 2,
  },
  activeSegment: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  inactiveSegment: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  ratings: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  saveButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,

    padding: 5,
  },
  iconContainer: {
    position: 'relative',
    width: 30,
    height: 30,
  },
  iconFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  iconOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

});