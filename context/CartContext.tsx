import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { useAuth } from './AuthContextfb';
import { db } from '../lib/firebase'; // Import your Firestore instance
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface CartContextType {
  cartItems: CartProps[];
  addToCart: (item: ClothesCardProps, imgNo: number, size?: string) => void;
  removeFromCart: (id: string, imageNo: number, size: string) => void;
  addQuantity: (id: string, imageNo: number, size: string) => void;
  removeQuantity: (id: string, imageNo: number, size: string) => void;
  totalPrice: () => string;
  updateCartItem: (item: CartProps) => void;
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

interface CartProps extends ClothesCardProps {
  imageNo: number;
  size: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProps[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.id); // Retrieve uid from user object
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCartItems(userData.cart_items || []);
            setFetched(true);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };
    fetchCartItems();
  }, [user]);

  const updateCartItems = async () => {
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.id); // Retrieve uid from user object
        await updateDoc(userDoc, { cart_items: cartItems });
        console.log('Cart items updated successfully');
      } catch (error) {
        console.error('Error updating cart items:', error);
      }
    }
  };

  useEffect(() => {
    if (fetched) {
      updateCartItems();
    }
  }, [cartItems]);

  const addToCart = (item: ClothesCardProps, imgNo: number, size: string = 'L') => {
    const newItem = { ...item, imageNo: imgNo, size };
    if (!cartItems.some(cartItem => cartItem.productID === newItem.productID)) {
      setCartItems(prevItems => [...prevItems, newItem]);
    }
  };

  const removeFromCart = (id: string, imageNo: number, size: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productID !== id || item.imageNo !== imageNo || item.size !== size));
  };

  const addQuantity = (id: string, imageNo: number, size: string) => {
    setCartItems(prevItems => prevItems.map(item => item.productID === id && item.size === size && item.imageNo === imageNo ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const removeQuantity = (id: string, imageNo: number, size: string) => {
    const updatedCartItems = cartItems.reduce((acc: CartProps[], item) => {
      if (item.productID === id && item.size === size && item.imageNo === imageNo) {
        if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    setCartItems(updatedCartItems);
  };

  const updateCartItem = (item: CartProps) => {
    setCartItems(prevItems => prevItems.map(cartItem => cartItem.productID === item.productID ? item : cartItem));
  };

  const totalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price[1]) * item.quantity, 0).toFixed(2);
    return cartItems.length > 0 ? `${cartItems[0].price[0]}${total}` : '$0.00';
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, totalPrice, 
      addQuantity, removeQuantity, updateCartItem, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
