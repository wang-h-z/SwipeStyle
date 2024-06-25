import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClothesCardProps } from '../types/ClothesCardProps';

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

    const newCollection = ( name: string )  =>  {
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
