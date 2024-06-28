import React, { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, View, Text } from 'react-native';
import axios from 'axios';
import SwipeCard from "../components/SwipeCard";
import { ClothesData } from '../types/ClothesData';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Home() {
    const [clothes, setClothes] = useState<ClothesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const appState = useRef(AppState.currentState);
    const { user } = useAuth();

    useEffect(() => {
        /** 
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
        

        return () => {
            listen.remove();
        };
        */

        fetchData();
        
    }, []);

    const fetchUserData = async () => {
        console.log("Fetching user data");
        if (user) {
            try {
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('gender, brands')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    throw new Error(error.message);
                }

                return profile;

            } catch (err) {
                console.error('Error fetching user data:', err);
                throw err;
            }
        }
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const profile = await fetchUserData();
            const { gender, brands } = profile || {};

            console.log('Fetching clothing data');
            const response = await axios.get(`https://styleswipe.azurewebsites.net/${gender}/get${brands[0]}Tops`, {
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

    if (loading) {
        console.log("loading");
        return <View><Text>Loading...</Text></View>;
    }

    if (error) {
        return <View><Text>Error fetching data: {error.message}</Text></View>;
    }

    const data = clothes.map((item, index) => ({
        ...item,
        start: Math.floor(Math.random() * item.image.length),
        quantity: 1,
    }));

    return (
        <SwipeCard dummy={data} />
    );
}
