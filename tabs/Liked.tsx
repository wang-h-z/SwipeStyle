// App.js
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LikedItems from "../screens/LikedItems";
import Collections from "../screens/Collections";
import CollectionHeader from '../headers/CollectionHeader';

const Tab = createMaterialTopTabNavigator();

export default function LikedScreen() {
  const [activeTab, setActiveTab] = React.useState('LikedItems');

  const handleTabChange = (route: { name: string }) => {
    setActiveTab(route.name);
  };

  return (
      <View style={styles.container}>
        {activeTab === 'Collections' 
          ? <CollectionHeader title='Collections' rightButton={true}/> 
          : <CollectionHeader title='Liked Items'/>}
        <Tab.Navigator
          initialRouteName="LikedItems"
          screenOptions={{
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            tabBarIndicatorStyle: {
              backgroundColor: 'black',
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              backgroundColor: 'white',
            },
          }}
          screenListeners={{
            state: (e) => {
              const route = e.data.state.routes[e.data.state.index];
              handleTabChange(route);
            },
          }}
        >
          <Tab.Screen
            name="LikedItems"
            component={LikedItems}
            options={{ title: 'All Items' }}
          />
          <Tab.Screen
            name="Collections"
            component={Collections}
            options={{ title: 'Mood Boards' }}
          />
        </Tab.Navigator>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
