import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const cartItems: CartItem[] = [
  { id: '1', name: 'Product 1', price: 29.99, quantity: 2, imageUrl: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Product 2', price: 49.99, quantity: 1, imageUrl: 'https://via.placeholder.com/100' },
];

const CartScreen: React.FC = () => {
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const checkoutFunction = () => {
    console.log("Checkout!");
  }
  const deleteFunction = (no: string) => {
    console.log(`Product ${no} deleted`);
  }

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.cartItemImage} />

      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
        
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} 
        onPress={() => deleteFunction(item.id)}>
          <Ionicons name='trash-outline' size={20} color='red'/>
        </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotalPrice()}</Text>
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
    paddingRight:5,
    paddingBottom:10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
});

export default CartScreen;
