import { View, Text } from 'react-native'
import React, { useEffect, useState} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase'

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                console.log('got user: ', user);
                setUser(user)
            } else {
                setUser(null)
            }
        })
        return unsub;
    }, []);

    return { user };
}