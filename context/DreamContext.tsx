import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Dream {
    text: string;
    isLucidDream: boolean;
}

interface DreamsContextType {
    dreams: Dream[];
    addDream: (newDream: Dream) => Promise<void>;
}

const DreamsContext = createContext<DreamsContextType | undefined>(undefined);

export const useDreams = () => {
    const context = useContext(DreamsContext);
    if (!context) {
        throw new Error('useDreams doit être utilisé au sein d\'un DreamsProvider');
    }
    return context;
};

export const DreamsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [dreams, setDreams] = useState<Dream[]>([]);

    useEffect(() => {
        const loadDreams = async () => {
            const storedDreams = await AsyncStorage.getItem('dreamFormDataArray');
            if (storedDreams) setDreams(JSON.parse(storedDreams));
        };

        loadDreams();
    }, []);

    const addDream = async (newDream: Dream) => {
        const updatedDreams = [...dreams, newDream];
        setDreams(updatedDreams);
        await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(updatedDreams));
    };

    return (
        <DreamsContext.Provider value={{ dreams, addDream }}>
            {children}
        </DreamsContext.Provider>
    );
};