import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

interface CartProps extends ClothesCardProps {
    imageNo: number;

}

interface Collection {
    title: string;
    items: CartProps[];
    itemNo: number;
}

interface CollectionsContextType {
    collections: Collection[];
    
    newCollection: (name: string) => void;
    removeCollection: (name: string) => void;

    addItem: (name: string, item: CartProps) => void;
    removeItem: (name: string, item: CartProps) => void;

}

interface CollectionsProviderProps {
    children: ReactNode;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<CollectionsProviderProps> = ({ children }) => {
    
    const [collections, setCollections] = useState<Collection[]>([]);
    const [fetched, setFetch] = useState<boolean>(false);
    const { user } = useAuth();

    useEffect(() => {
      const fetchCollections = async () => {
        if (user) {
          try {
            // Fetch collections from Supabase 'collections' table
            const { data: profile, error } = await supabase
              .from('users')
              .select('collections')
              .eq('id', user.id)
              .single();
  
            if (error) {
              throw new Error(error.message);
            }
            console.log("Fetched user collections")
            if (profile?.collections !== null){
                setCollections(profile?.collections);
            }
            setFetch(true)
          } catch (error) {
            if (error instanceof Error) {
              console.error('Error fetching collections:', error.message);
              // Handle error fetching collections
            } else {
              console.log('Unknown Error', error)
            }
          }
        }
      }
      fetchCollections();
    },[]);

    const updateCollections = async () => {
        if (user) {
            try {
                const { error } = await supabase
                    .from('users')
                    .update({ collections: collections })
                    .eq('id', user.id);
                if (error) {
                    console.error('Error updating collections:', error.message);
                } else {
                    console.log('Collections updated successfully');
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
            updateCollections();
        }
    }, [collections]);

    const newCollection = ( name: string )  =>  {
        if (collections.find(collection => collection.title === name)) {
            Alert.alert("Error", "Collection already exists");
            return;
        }
        setCollections((prevCollections) => [...prevCollections, {title: name, items: [], itemNo: 0}]);
    }

    const removeCollection = (name: string) => {
        setCollections((prevCollections) => prevCollections.filter(collection => collection.title !== name));
    }

    const addItem = (name: string, item: CartProps) => {
        setCollections((prevCollections) => 
            prevCollections.map(collection => 
                collection.title === name 
                ? {...collection, items: [...collection.items, item], itemNo: collection.itemNo + 1} 
                : collection));
    }

    const removeItem = (name: string, item: CartProps) => {
        setCollections((prevCollections) => 
            prevCollections.map(collection => 
                collection.title === name 
                ? {...collection, items: collection.items.filter(i => i.productID !== item.productID), itemNo: collection.itemNo - 1} 
                : collection));
    }

    return (
        <CollectionsContext.Provider value={{
            collections,
            newCollection,
            removeCollection,
            addItem,
            removeItem,
        }}>
        
            {children}
        
        </CollectionsContext.Provider>
    );
};

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    if (!context) {
        throw new Error('useCollections must be used within a CollectionsProvider');
    }
    return context;
}
