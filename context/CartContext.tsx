import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClothesData } from '../types/UniqloData';
import { CartData } from '../types/CartData';

interface CartContextType {
  cartItems: CartData[];
  addToCart: (item: ClothesData) => void;
  removeFromCart: (name: string) => void;
  addQuantity: (name: string) => void;
  removeQuantity: (name: string) => void;
  totalPrice: () => string;
}
interface CartProviderProps {
    children: ReactNode;
  }

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartData[]>([]);

  const addToCart = (item: ClothesData) => {
    const newItem = {
      ...item,
      quantity: 1,
    };
    

    setCartItems((prevItems) => [...prevItems, newItem]);
  };

  const removeFromCart = (name: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.name !== name));
  };

  const addQuantity = (name: string) => {
    setCartItems((prevItems) => prevItems.map(item => item.name === name ? { ...item, quantity: item.quantity + 1 } : item));
  }

  const removeQuantity = (name: string) => {
    const updatedCartItems = cartItems.reduce((acc: CartData[], item) => {
      if (item.name === name) {
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
  

  const totalPrice = () => {
    const total = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
    
    return cartItems.length > 0 ? cartItems[0].currency + total : '$0.00';
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalPrice, addQuantity, removeQuantity }}>
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
