import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { ClothesCardProps } from '../types/ClothesCardProps';
import LoginButton from '../components/LoginButton';
import DropdownComponent from '../components/DropDown';

interface CartProps extends ClothesCardProps {
  imageNo: number;
  size: string;
}

const CartScreen: React.FC = () => {
  const { cartItems, removeFromCart, totalPrice, addQuantity, removeQuantity, updateCartItem } = useCart();
  
  const [selectedItem, setSelectedItem] = React.useState<CartProps | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const modalOpenedRef = useRef(false);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / screenWidth);
    setSelectedItem((prevItem) => prevItem ? { ...prevItem, imageNo: newIndex } : null);
    if (contentOffsetX === screenWidth * newIndex && selectedItem) {
      setColor(selectedItem.image[newIndex].colorString);
    }
  };

  useEffect(() => {
    if (selectedItem && !modalOpenedRef.current) {

      //console.log(selectedItem?.name)
      const timeout = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: screenWidth * (selectedItem.imageNo),
          animated: false,
        });
        modalOpenedRef.current = true;
        setSize(selectedItem.size);
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


  
  const checkoutFunction = () => {
    console.log("Checkout!");
  }

  const updateCart = (item: CartProps) => {
    if (color) {
      item.imageNo = item.image.findIndex((img) => img.colorString === color);
    }

    if (size) {
      item.size = size;
    }

    updateCartItem(item);
    setSelectedItem(null);

  } 





  const renderCartItem = ({ item }: { item: CartProps }) => (

    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => {setSelectedItem(item)}}>
      <Image source={{ uri: item.image[item.imageNo].url }} style={styles.cartItemImage} />
      </TouchableOpacity>  
      
      <Ionicons name='ellipse' size={20} color='white' style={{position:'absolute', top:88, left:86}}/>
      <Text style={{position:'absolute', top:90, left:92.5, fontSize:13}}>{item.quantity}</Text>
      
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price[0] + parseFloat(item.price[1]).toFixed(2)}</Text>
        <Text style={styles.cartItemQuantity}>
          Color: {item.image[item.imageNo].colorString}
        </Text>
        <Text style={styles.cartItemQuantity}>
          Size: {item.size}
        </Text>
      </View>
      <TouchableOpacity
          style={styles.addButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => addQuantity(item.productID, item.imageNo, item.size)}>
          <Ionicons name='add' size={20} color='green'/>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.minusButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => removeQuantity(item.productID, item.imageNo, item.size)}>
          <Ionicons name='remove' size={20} color='red'/>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        onPress={() => removeFromCart(item.productID, item.imageNo, item.size)}>
          <Ionicons name='trash-outline' size={20} color='red'/>
        </TouchableOpacity>
    </View>
  );
  return (
    
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.cartList}
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
                          
              {selectedItem.rating?.average && 
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
                placeholder="Select Size"
                onValueChange={setSize}  
                value={size}
              />

              </View>
              <LoginButton title='Update Cart' color='black' textColor='white' opStyles={{marginBottom: 120}} onPress={() => {updateCart(selectedItem)}}/>

              

            </ScrollView>
          )}
        </View>
      </Modal>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {totalPrice()}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={checkoutFunction}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cartList: {
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cartItemDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 30,
  },
  cartItemPrice: {
    fontSize: 16,
    color: 'gray',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: 'gray',
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  deleteButton: {
    position: 'absolute',
    top: 15,
    right: 10,
  },

  addButton: {
    position: 'absolute',
    bottom: 15,
    right: 10,
  },

  minusButton: {
    position: 'absolute',
    bottom: 15,
    right: 45,
  },
  
  checkoutButton: {
    backgroundColor: 'turquoise',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginTop: 90,
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
    top: 50,
    left: 20,
    zIndex: 1,
  },

  info: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 5,
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

});

export default CartScreen;
