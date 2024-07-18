import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface LikedContextType {
  likedItems: LikedProps[];
  addToLiked: (item: ClothesCardProps, imgNo: number) => void;
  addToDisliked: (item: ClothesCardProps, imgNo: number) => void;
  removeFromLiked: (name: string) => void;
}
interface LikedProviderProps {
    children: ReactNode;
}

interface LikedProps extends ClothesCardProps {
  imageNo: number;
}

const LikedContext = createContext<LikedContextType | undefined>(undefined);

export const LikedProvider: React.FC<LikedProviderProps> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<LikedProps[]>([]);
  const [dislikedItems, setDislikedItems] = useState<LikedProps[]>([]);

  const [fetched, setFetch] = useState<boolean>(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchLikedItems = async () => {
      if (user) {
        try {
          // Fetch collections from Supabase 'collections' table
          const { data: profile, error } = await supabase
            .from('users')
            .select('liked_items, disliked_items')
            .eq('id', user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }
          console.log("Fetched user liked items")
          if (profile?.liked_items !== null){
            setLikedItems(profile?.liked_items);
            
          }

          if (profile?.disliked_items !== null){
            setDislikedItems(profile?.disliked_items);
          }
          
          setFetch(true)
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error fetching liked items:', error.message);
          } else {
            console.log('Unknown Error', error)
          }
        }
      }
    }
    fetchLikedItems();
  },[]);

  const updateLikedItems = async () => {
    if (user) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ liked_items: likedItems })
                .eq('id', user.id);
            if (error) {
                console.error('Error updating liked items:', error.message);
            } else {
                console.log('Liked Items updated successfully');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Unexpected error:', error.message);
            }
        }
    }
  }

  const updateDislikedItems = async () => {
    if (user) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ disliked_items: dislikedItems })
                .eq('id', user.id);
            if (error) {
                console.error('Error updating disliked items:', error.message);
            } else {
                console.log('Disliked Items updated successfully');
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
        updateLikedItems();
      }
  }, [likedItems]);

  useEffect(() => {
    if (fetched) {
      updateDislikedItems();
    }
}, [dislikedItems]);

  const addToLiked = (item: ClothesCardProps, imgNo: number) => {
    const newItem = { ...item, imageNo: imgNo };

    setLikedItems((prevItems) => [newItem, ...prevItems]); //Most recent liked item will be at the top
  };

  const addToDisliked = (item: ClothesCardProps, imgNo: number) => {
    const newItem = { ...item, imageNo: imgNo };

    setDislikedItems((prevItems) => [newItem, ...prevItems]); //Most recent liked item will be at the top
  };

  const removeFromLiked = (id: string) => {
    setLikedItems((prevItems) => prevItems.filter(item => item.productID !== id));
  };

  return (
    <LikedContext.Provider value={{ likedItems, addToLiked, addToDisliked, removeFromLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) {
    throw new Error('useLiked must be used within a LikedProvider');
  }
  return context;
};
