import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartProps[];
  addToCart: (item: ClothesCardProps, imgNo: number, size?:string) => void;

  removeFromCart: (name: string, imageNo: number, size: string) => void;
  addQuantity: (name: string, imageNo: number, size: string) => void;
  removeQuantity: (name: string, imageNo: number, size: string) => void;
  
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
  const [fetched, setFetch] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          // Fetch collections from Supabase 'collections' table
          const { data: profile, error } = await supabase
            .from('users')
            .select('cart_items')
            .eq('id', user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }
          console.log("Fetched user cart items")
          if (profile?.cart_items !== null){
            setCartItems(profile?.cart_items);
          }
          
          setFetch(true)
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error fetching cart items:', error.message);
          } else {
            console.log('Unknown Error', error)
          }
        }
      }
    }
    fetchCartItems();
  },[]);

  const updateCartItems = async () => {
    if (user) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ cart_items: cartItems })
                .eq('id', user.id);
            if (error) {
                console.error('Error updating cart items:', error.message);
            } else {
                console.log('Cart Items updated successfully');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Unexpected error:', error.message);
            }
        }
    }
  }

  useEffect(() => {
      if (fetched) {
        updateCartItems();
      }
  }, [cartItems]);

  const addToCart = (item: ClothesCardProps, imgNo: number, size?:string) => {
    const newItem = { ...item, imageNo: imgNo, size: size || 'L' };
    setCartItems((prevItems) => [...prevItems, newItem]);
  };

  const removeFromCart = (id: string, imageNo: number, size: string) => {
    setCartItems((prevItems) => prevItems.filter(item => item.productID !== id));
  };

  const addQuantity = (id: string, imageNo: number, size: string) => {
    setCartItems((prevItems) => prevItems.map(item => item.productID === id && item.size === size && item.imageNo === imageNo  ? { ...item, quantity: item.quantity + 1 } : item));
  }

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

  const updateCartItem = (item:CartProps) => {
    const index = cartItems.findIndex((cartItem) => cartItem.productID === item.productID);
    cartItems[index] = item;

  }
  

  const totalPrice = () => {
    const total = cartItems.reduce((total, item) => total + parseFloat(item.price[1]) * item.quantity, 0).toFixed(2);
    
    return cartItems.length > 0 ? cartItems[0].price[0] + total : '$0.00';
  }

  const clearCart = () => {
    setCartItems([]);
  }

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
