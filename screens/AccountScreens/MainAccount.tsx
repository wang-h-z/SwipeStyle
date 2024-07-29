import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import {useAuth} from '../../context/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';


const MainAccountScreen: React.FC = () => {

  const navigation = useNavigation<NavigationProp<any>>();
  const { user, name:userName } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };
  //console.log(user);
  // Get user email and name
  const email = user?.email;
  const name = userName || 'John Doe'; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://thumbs.dreamstime.com/b/profile-anonymous-face-icon-gray-silhouette-person-male-businessman-profile-default-avatar-photo-placeholder-isolated-white-107003824.jpg' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("OrderHistory")}>
          <Text style={styles.optionText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default MainAccountScreen;
