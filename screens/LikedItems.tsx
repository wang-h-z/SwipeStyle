import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Text, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { useLiked } from '../context/LikedContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoginButton from '../components/LoginButton';
import { useCart } from '../context/CartContext';
import DropdownComponent from '../components/DropDown';

interface CartProps extends ClothesCardProps {
  imageNo: number;
}

const LikedScreen: React.FC = () => {
  const { likedItems, removeFromLiked } = useLiked();
  
  const [selectedItem, setSelectedItem] = useState<CartProps | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const modalOpenedRef = useRef(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const { addToCart } = useCart();
  
  const addCart = (item: CartProps) => {
    if (!size) {
      setSize('L') //Default size
      //Alert.alert('Error', 'Please select a size');
      //return;
    }

    if (color) {
      item.imageNo = item.image.findIndex((img) => img.colorString === color);
    }
    addToCart(item, item.imageNo, size || 'L');
    removeFromLiked(item.productID);
    
    console.log(color, size)

    setColor(null);
    setSize(null);
    setSelectedItem(null);

  }

  const renderLikedItem = ({ item }: { item: CartProps }) => (
    <View style={styles.likedItem}>

      <TouchableOpacity onPress={() => {setSelectedItem(item)}}>
      <Image source={{ uri: item.image[item.imageNo].url }} style={styles.likedItemImage} />
      </TouchableOpacity>  
      
      <View style={styles.likedItemDetails}>
        <Text style={styles.likedItemName}>{item.name}</Text>
        <Text style={styles.likedItemPrice}>{item.price[0] + parseFloat(item.price[1]).toFixed(2)}</Text>
        <Text style={styles.likedItemPrice}>
          {item.image[item.imageNo].colorString}
        </Text>
      </View>

      <TouchableOpacity
          style={{    
            position: 'absolute',
            bottom: 15,
            right: 10,
          }}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => addCart(item)}>
          <MaterialIcons name='add-shopping-cart' size={20} color='black'/>
      </TouchableOpacity>
      <TouchableOpacity
          style={{    
            position: 'absolute',
            top: 15,
            right: 10,
          }}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => removeFromLiked(item.productID)}>
          <Ionicons name='remove' size={20} color='red'/>
      </TouchableOpacity>

    </View>
  );

  useEffect(() => {
    if (selectedItem && !modalOpenedRef.current) {

      //console.log(selectedItem?.name)
      const timeout = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: screenWidth * (selectedItem.imageNo),
          animated: false,
        });
        modalOpenedRef.current = true;
        setSize('L') //Default size
      }, 100); 
      
      return () => clearTimeout(timeout);
    }
  }, [selectedItem]);

  useEffect(() => {
    
    if (selectedItem && color) {
      const index = selectedItem.image.findIndex((img) => img.colorString === color);
      scrollViewRef.current?.scrollTo({
        x: screenWidth * index,
        animated: true,
      }); 
    }
  
  }, [color])

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / screenWidth);
    
    setSelectedItem((prevItem) => prevItem ? { ...prevItem, imageNo: newIndex } : null);
    
    if (contentOffsetX === screenWidth * newIndex && selectedItem) {
      setColor(selectedItem.image[newIndex].colorString);
    }
  };

  

  return (
    <View style={styles.container}>
      <FlatList
        data={likedItems}
        renderItem={renderLikedItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.likedList}
        
      />
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setSelectedItem(null)
          modalOpenedRef.current = false;
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            setSelectedItem(null)
            modalOpenedRef.current = false;
          }}>
            <Ionicons name='arrow-back' size={30} color={'black'}/>
          </TouchableOpacity>
          {selectedItem && (
            <ScrollView contentContainerStyle={{marginTop:50}}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollViewContent}
                
              >
                {selectedItem.image.map((img, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: img.url }}
                      style={[styles.fullScreenImage, { width: screenWidth, height: screenHeight * 0.5}]} 
                    />
                  </View>
                ))}
              </ScrollView>
              
              <View style={{
                flexDirection:'row', 
                justifyContent: 'space-between', width: '100%'
                }}>

              <Text style={styles.price}>{selectedItem.price[0] + parseFloat(selectedItem.price[1]).toFixed(2)}</Text>
                          
              {typeof(selectedItem.rating) !== "string" && selectedItem.rating.average !== null && 
                <Text style={styles.price}>{selectedItem.rating.average.toFixed(2)} ⭐ ({selectedItem.rating.count})</Text>
              }
              </View>
              
              <Text style={styles.info}>{selectedItem.name}</Text>  
              
              <View style={{
                flexDirection:'row', 
                justifyContent: 'space-between', width: '100%',
                
                }}>
              <DropdownComponent 
                data={selectedItem.image.map((i) => ({ label: i.colorString, value: i.colorString }))} 
                placeholder={selectedItem.image[selectedItem.imageNo]?.colorString || selectedItem.image[0].colorString}
                onValueChange={(value) => setColor(value || null)}  
                value={color}
              />
              <DropdownComponent 
                data={selectedItem.sizes.map((i: string) => ({ label: i, value: i }))} 
                placeholder='Select Size'
                onValueChange={setSize}  
                value={size}
              />

              </View>
              <LoginButton title='Add to Cart' color='black' textColor='white' opStyles={{marginBottom: 120}} onPress={() => {addCart(selectedItem)}}/>

              

            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  likedList: {
    padding: 5,
  },
  likedItem: {
    flexDirection: 'row',
    marginBottom: 2, //Spacing between items
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    height: 120,
  },
  likedItemImage: {
    width: 100,
    height: 100,
    
  },
  likedItemDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  likedItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 30,
  },
  likedItemPrice: {
    fontSize: 16,
    color: 'gray',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FAF9F6',
    marginTop: 50,
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 1,
  },
  price: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginLeft: 8,  
    marginRight: 8,
    marginBottom: 15,
  },

  info: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 5,
  },

});

export default LikedScreen;
