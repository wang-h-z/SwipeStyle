import React, { useState,  useEffect, useRef } from 'react';
import { AppState, AppStateEvent, AppStateStatus, View, Text } from 'react-native';
import axios from 'axios';
import SwipeCard from "../components/SwipeCard";


interface ClothesData {
    careInstruction: string,
    colors: Array<Object>,
    composition: string,
    designDetail: string,
    freeInformation: string,
    genderName: string,
    hideReview: Boolean,
    images: {
        main: Array<{
            url: string,
            colorCode: string
        }>,
        chip: Array<{
            url: string,
            colorCode: string
        }>,
        sub: Array<{
            url: string,
        }>
    },
    l1Id: string,
    longDescription: string,
    name: string,
    prices: {
        base?: {
            currency: {
                code: string,
                symbol: string
            },
            value: string,
        },
        promo?: {
            currency: {
                code: string,
                symbol: string
            },
            value: string,
        },
    },
    productId: string,
    plds: Array<Object>,
    rating: Object,
    representative: Object,
    reviews: Object,
    shortDescription: string,
    sizeChartUrl: string,
    sizeInformation: string,
    sizes: Array<Object>,
    unisexFlag: Number,
    washingInformation: string,
}

interface Results {
    aggregations: Object,
    items: Array<ClothesData>,
    pagination: Object,
}

interface UniqloData {
    _id: string,
    status: string,
    result: Results
}

export default function Home() {
    const [clothes, setClothes] = useState<ClothesData[]>([]);
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
            const response = await axios.get(`http://192.168.10.113:5051/getUniqlo`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
            if (response.data && response.data[0] && response.data[0].result && response.data[0].result.items) {
                setClothes(response.data[0].result.items);
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
    const prices = clothes.map(c => c.prices)
        .map(p => {
            const symbol = p.base?.currency.symbol || p.promo?.currency.symbol || '';
            const value = parseFloat(p.base?.value || p.promo?.value || '0').toFixed(2);
            return `${symbol}${value}`;
        });

    const images = clothes.map(c => {
        const num = Math.floor(Math.random() * c.images.main.length);
        return c.images.main[num].url;
    });

    const data = names.map((name, index) => ({
        name: name,
        price: prices[index],
        img: images[index]
    }));
    /*
    const data = [{
        name: 'inclusivity',
        price: '$4000',
        img: 'https://i.pinimg.com/originals/c2/dc/b0/c2dcb0dc37e31432c66bf33200e89496.jpg',
    }, 
    {
        name: 'Fuck mongoDB',
        price: 'idk',
        img: 'https://i.pinimg.com/736x/92/62/71/926271a6a42c594812cb6f8956729e7e.jpg',
    }, 
    
    ]
    */
   
    return (
        <SwipeCard data={data} />
    );
}
