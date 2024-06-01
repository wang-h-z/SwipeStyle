import { useEffect, useState} from 'react'
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase'

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                console.log('got user');
                setUser(user)
            } else {
                setUser(null)
            }
        })
        return unsub;
    }, []);

    return { user };
}