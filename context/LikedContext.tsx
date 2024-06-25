import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';

interface LikedContextType {
  likedItems: CartProps[];
  addToLiked: (item: ClothesCardProps, imgNo: number) => void;
  removeFromLiked: (name: string) => void;
}
interface LikedProviderProps {
    children: ReactNode;
}

interface CartProps extends ClothesCardProps {
  imageNo: number;
}

const LikedContext = createContext<LikedContextType | undefined>(undefined);

export const LikedProvider: React.FC<LikedProviderProps> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<CartProps[]>([]);

  const addToLiked = (item: ClothesCardProps, imgNo: number) => {
    const newItem = { ...item, imageNo: imgNo };

    setLikedItems((prevItems) => [newItem, ...prevItems]); //Most recent liked item will be at the top
  };

  const removeFromLiked = (id: string) => {
    setLikedItems((prevItems) => prevItems.filter(item => item.productID !== id));
  };

  return (
    <LikedContext.Provider value={{ likedItems, addToLiked, removeFromLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) {
    throw new Error('useCart must be used within a LikedProvider');
  }
  return context;
};
