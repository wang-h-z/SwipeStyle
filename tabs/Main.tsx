import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from './Home';
import Cart from './Cart';
import Liked from './Liked';
import Account from './Account';
import { CartProvider } from '../context/CartContext';
import { LikedProvider } from '../context/LikedContext';
import { OrderProvider } from '../context/OrderContext';
import { CollectionsProvider } from '../context/CollectionsContext';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <OrderProvider>
    <CartProvider>
    <LikedProvider>
    <CollectionsProvider>

      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Cart') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Liked') {
              iconName = focused ? 'heart' : 'heart-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'turquoise',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{ tabBarTestID: 'home-tab' }} />
        <Tab.Screen name="Liked" component={Liked} options={{ headerShown: false }} />
        <Tab.Screen name="Cart" component={Cart} />
        <Tab.Screen name="Account" component={Account} options={{ headerShown: false }} />
      </Tab.Navigator>
    
    </CollectionsProvider>
    </LikedProvider>
    </CartProvider>
    </OrderProvider>
  );
};

export default MainTabs;
