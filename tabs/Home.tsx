import React, { useState,  useEffect, useRef } from 'react';
import { AppState, AppStateStatus, View, Text } from 'react-native';
import axios from 'axios';
import SwipeCard from "../components/SwipeCard";
import { UniqloData } from '../types/UniqloData';


//ClothesData interface for data fetched from API

export default function Home() {
    const [clothes, setClothes] = useState<UniqloData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {

        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            console.log('AppState changed from', appState.current, 'to', nextAppState);
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground, fetching data...');
                fetchData();
            }
            appState.current = nextAppState;
        };

        const listen = AppState.addEventListener('change', handleAppStateChange);

        // Initial data fetch       
        fetchData();

        return () => {
            
            listen.remove();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching data');
            const response = await axios.get(`https://styleswipe.azurewebsites.net/getUniqloMenTops`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
            if (response.data) {
                setClothes(response.data[0].clothes_data);
                console.log('setClothes called');
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    //Can add loading screen here
    if (loading) {
        console.log("loading");
        return <View><Text>Loading...</Text></View>;
    }

    //Can add Error page here
    if (error) {
        return <View><Text>Error fetching data: {error.message}</Text></View>;
    }
  
    const names = clothes.map(c => c.name);
    const prices = clothes.map(c => parseFloat(c.price[1]).toFixed(2))
    const images = clothes.map(c => {
        const num = Math.floor(Math.random() * c.image.length);
        return c.image[num].url;
    });

    const currency = clothes[0].price[0];

    const data = names.map((name, index) => ({
        name: name,
        price: prices[index],
        img: images[index],
        currency: currency
    }));
    
    
    return (
        <SwipeCard data={data} />
    );
}
