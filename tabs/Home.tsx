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
    //const appState = useRef(AppState.currentState);
    const { user } = useAuth();
    const [fetchMore, setFetchMore] = useState(false);
    const [AIloading, setAIloading] = useState(false);
    
    //Initial data fetch
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

    //Subsequent data fetch
    useEffect(() => {
        
        if(fetchMore){

            fetchAIData();
            
            setFetchMore(false);
        }
    }, [fetchMore]);

    const fetchUserData = async () => {
        console.log("Fetching user data");
        if (user) {
            try {
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('gender, brands, liked_items, disliked_items, id')
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
            const { gender, brands, liked_items, disliked_items } = profile || {};
            
            const names: { [key: string]: string } = {};
            
            liked_items.forEach((i: { name: string; }) => {
                names[i.name] = i.name;
            })
            
            disliked_items.forEach((i: { name: string; }) => {
                names[i.name] = i.name;
            }) 

            console.log('Fetching clothing data'); 
            //console.log(Object.keys(names).length);
            const url = `https://styleswipe.azurewebsites.net/${gender}/getStack`;
            
            //const url = `http://localhost:5051/${gender}/getStack`;
            
            const response = await axios.post(url, 
                {
                  brands: brands,
                  seen: names,
                }, 
                {
                  headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Content-Type': 'application/json' 
                  }
                }
              ).then((response) => setClothes(response.data.clothes_data))
               .catch((error) => {console.error('Error fetching data:', error);setError(error);})
               .finally(() => {setLoading(false);});

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateAI = async () => {
        console.log("Updating AI");

        const profile = await fetchUserData();
        const { gender, liked_items, disliked_items, id } = profile  || {}

        const url = 'https://swipestyle-ai.azurewebsites.net/update';

        const response = await axios.post(url, 
            {
                user: {
                    id : id,
                    liked_items: liked_items,
                    disliked_items: disliked_items,
                    gender: gender
                }
            }
        );
        
        return {response, gender, id};
    };

    const fetchAIData = async () => {
        setAIloading(true);
        const {response:res, gender, id} = await updateAI();
        console.log("Update Done")
        if (res.status === 200) {
            console.log("Fetching AI data");
            const url = 'https://swipestyle-ai.azurewebsites.net/recommend';

            const response = await axios.post(url,
                {
                    user_id: id,
                    top_n: 25,
                    gender: gender
                }
            ).then((response) => setClothes(response.data))
            .catch((error) => fetchData()).finally(() => setAIloading(false));
        } else {
            console.error('Error fetching AI data:', res);
            fetchData();
            setAIloading(false);   
        }
    };

    if (loading) {
        console.log("loading");
            return <View><Text>Loading...</Text></View>;
        
    }

    if (AIloading) {
        console.log("AI loading");
        return <View><Text>Fetching recommendations from AI model...</Text></View>;
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
        <SwipeCard dummy={data} fetchMore={setFetchMore}/>
    );
}
