import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';

interface CartContextType {
  cartItems: CartProps[];
  addToCart: (item: ClothesCardProps, imgNo: number) => void;
  removeFromCart: (name: string) => void;
  addQuantity: (name: string) => void;
  removeQuantity: (name: string) => void;
  totalPrice: () => string;
}
interface CartProviderProps {
    children: ReactNode;
  }

interface CartProps extends ClothesCardProps {
  imageNo: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProps[]>([]);

  const addToCart = (item: ClothesCardProps, imgNo: number) => {
    const newItem = { ...item, imageNo: imgNo };

    setCartItems((prevItems) => [...prevItems, newItem]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.productID !== id));
  };

  const addQuantity = (id: string) => {
    setCartItems((prevItems) => prevItems.map(item => item.productID === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  const removeQuantity = (id: string) => {
    const updatedCartItems = cartItems.reduce((acc: CartProps[], item) => {
      if (item.productID === id) {
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
    const total = cartItems.reduce((total, item) => total + parseFloat(item.price[1]) * item.quantity, 0).toFixed(2);
    
    return cartItems.length > 0 ? cartItems[0].price[0] + total : '$0.00';
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
