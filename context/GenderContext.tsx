import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GenderContextType {
    gender: string;
    updateGender: (gender: string) => void;
}

interface GenderProviderProps {
    children: ReactNode;
  }

const GenderContext = createContext<GenderContextType | undefined>(undefined);

export const GenderProvider: React.FC<GenderProviderProps> = ({ children }) => {

    const [gender, setGender]  = useState<string>('');

    return (
        <GenderContext.Provider value={{ 
          gender, updateGender: setGender
        }}>
          {children}
        </GenderContext.Provider>
      );

}

export const useGender = () => {
    const context = useContext(GenderContext);
    if (!context) {
      throw new Error('useGender must be used within a GenderProvider');
    }
    return context;
  };

