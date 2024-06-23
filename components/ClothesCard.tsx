import React, { useEffect, useState } from "react";
import {
  Text,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  Image,
  Touchable,
} from "react-native";
import { ClothesCardProps } from "../types/ClothesCardProps";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useCollections } from "../context/CollectionsContext";
const { width, height } = Dimensions.get("window");

interface Collection {
  title: string;
  items: CartProps[];
  itemNo: number;
}

interface CartProps extends ClothesCardProps {
  imageNo: number;
}

export default function ClothesCard(props: {
  clothesData: ClothesCardProps;
  start: number;
  setStart: (start: number) => void;
  leftTap: () => void;
  rightTap: () => void;
  triggerRightSwipe: () => void;

}) {
  const { name, price, image } = props.clothesData;
  const { start, setStart, leftTap, rightTap, triggerRightSwipe } = props;

  const final_price = price[0] + parseFloat(price[1]).toFixed(2);

  const { addItem, collections } = useCollections();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartProps | null>(null);

  useEffect(() => {
    setStart(props.clothesData.start);
  }, [props.clothesData.start]);

  if (start < 0 || start >= image.length) {
    setStart(0);
    return null;
  }

  const saveButton = (item: CartProps) => {
    setModalVisible(true);
    setSelectedItem(item);
    
  };

  const addToCollection = (name: string) => {
    addItem(name, selectedItem!);
    setModalVisible(false);
    setSelectedItem(null);
    triggerRightSwipe();
  }

  const renderCollectionList = ({ item }: { item: Collection }) => {

    return (
      <View style={styles.collection}>
        <TouchableOpacity onPress={() => addToCollection(item.title)}>
        <View style={styles.collectionInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={{alignSelf: "center",}}>{item.itemNo} items</Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  };

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
                index === start ? styles.activeSegment : styles.inactiveSegment,
              ]}
            />
          ))}
        </View>
      </ImageBackground>
      <TouchableOpacity style={styles.leftTapArea} onPress={leftTap} />
      <TouchableOpacity style={styles.rightTapArea} onPress={rightTap} />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveButton({ ...props.clothesData, imageNo: start })}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="bookmark"
            size={30}
            color="white"
            style={styles.iconFill}
          />
          <Ionicons
            name="bookmark-outline"
            size={30}
            color="black"
            style={styles.iconOutline}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Choose your mood board</Text>
                  <FlatList
                    data={collections}
                    renderItem={renderCollectionList}
                    keyExtractor={(item) => item.title}
                    contentContainerStyle={{ padding: 5 }}
                    style={{ width: "100%" }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "93%",
    height: "90%",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 10,
  },
  cardInner: { padding: 10 },
  name: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  desc: {
    fontSize: 18,
    color: "white",
    lineHeight: 25,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  leftTapArea: {
    position: "absolute",
    left: 0,
    width: "25%",
    height: "100%",
  },
  rightTapArea: {
    position: "absolute",
    right: 0,
    width: "25%",
    height: "100%",
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
  activeSegment: { backgroundColor: "rgba(255, 255, 255, 0.8)" },
  inactiveSegment: { backgroundColor: "rgba(255, 255, 255, 0.3)" },
  saveButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
  },
  iconContainer: {
    position: "relative",
    width: 30,
    height: 30,
  },
  iconFill: { position: "absolute", top: 0, left: 0 },
  iconOutline: { position: "absolute", top: 0, left: 0 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  centeredView: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    width: width,
    height: height / 2,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  collection: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    width: "100%",
    height: 50,
    
  },
 
  collectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "center",
  },
});
