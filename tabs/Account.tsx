import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

export default function Account() {
    const handleLogout = async ()=> {
        await signOut(auth);
    }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoutButton: {
            alignItems: 'center',
            padding: 10,
            backgroundColor: 'lightblue',
            margin: 25,
            borderRadius: 10,
            width: 300,
            height: 50,
        },
        logoutText: {
            fontSize: 25,
            fontWeight: 'bold', 
        },
    }
)