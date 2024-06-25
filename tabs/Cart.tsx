import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { ClothesCardProps } from '../types/ClothesCardProps';
import LoginButton from '../components/LoginButton';
import DropdownComponent from '../components/DropDown';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { StripeProvider, usePaymentSheet } from '@stripe/stripe-react-native';


interface CartProps extends ClothesCardProps {
  imageNo: number;
  size: string;
}

const Cart: React.FC = () => {

  const navigation = useNavigation<NavigationProp<any>>();
  
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

  /**
   * Stripe Functions
   */

  const { initPaymentSheet, presentPaymentSheet} = usePaymentSheet();

  const [checkOutLoading, setCheckOutLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    console.log('Fetching payment sheet params')

    const response = await fetch(`https://styleswipe.azurewebsites.net/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalPrice: totalPrice(),
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    //console.log(response.json())

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "SwipeStyle",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
      returnURL: 'payment-sheet://stripe-redirect',
    });

  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
    setCheckOutLoading(false);
  };

  const checkoutFunction = () => {
    console.log("Checkout!");
  }
  const deleteFunction = (name: string) => {
    removeFromCart(name);
  }

  const addFunction = (name: string) => {
    addQuantity(name);
    
  }

  const removeFunction = (name: string) => {
    removeQuantity(name);
  }

  const renderCartItem = ({ item }: { item: CartData }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.img }} style={styles.cartItemImage} />

      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.currency + item.price}</Text>
        <Text style={styles.cartItemQuantity}>
          Quantity: {item.quantity} 
          
        
        </Text>
        
      </View>
      <TouchableOpacity
          style={styles.addButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => addFunction(item.name)}>
          <Ionicons name='add' size={20} color='green'/>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.minusButton}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          onPress={() => removeFunction(item.name)}>
          <Ionicons name='remove' size={20} color='red'/>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton} 
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        onPress={() => deleteFunction(item.name)}>
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
    marginRight: 20,
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
});

export default CartScreen;
