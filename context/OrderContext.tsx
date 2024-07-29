import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartProps extends ClothesCardProps {
  imageNo: number;
  size: string;
}

interface OrderProps {
  orderNo?: string,
  items: CartProps[];
  itemNo: number;
  orderTotal: string;
}

interface OrderContextType {
  orderItems: OrderProps[];
  addToOrder: (item: OrderProps) => void;
}

interface OrderProviderProps {
    children: ReactNode;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orderItems, setOrderItems] = useState<OrderProps[]>([]);
  const [fetched, setFetch] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (user) {
        try {
          // Fetch collections from Supabase 'collections' table
          const { data: profile, error } = await supabase
            .from('users')
            .select('order_history')
            .eq('id', user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }
          console.log("Fetched user order history")
          if (profile?.order_history !== null){
            setOrderItems(profile?.order_history);
          }
          setFetch(true)
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error fetching order history:', error.message);
          } else {
            console.log('Unknown Error', error)
          }
        }
      }
    }
    fetchOrderHistory();
  },[]);

  const updateOrderHistory = async () => {
    if (user) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ order_history: orderItems })
                .eq('id', user.id);
            if (error) {
                console.error('Error updating order history:', error.message);
            } else {
                console.log('Order History updated successfully');
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
      updateOrderHistory();
    }
}, [orderItems]);

  const addToOrder = (item: OrderProps) => {
    setOrderItems((prevItems) => [...prevItems, item]);
  }

  return (
    <OrderContext.Provider value={{ 
      orderItems, addToOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider');
  }
  return context;
};
