import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './tabs/Home';
import CartScreen from './tabs/Cart';
import Ionicons from '@expo/vector-icons/Ionicons';
import clothesJson from "./assets/clothesData/clothes.json";
import useAuth from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Account from './tabs/Account';
import WelcomeScreen from './screens/WelcomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const data = Object.values(clothesJson[0].data);
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Cart') {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'turquoise',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Account" component={Account} />
          
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;

