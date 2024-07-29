import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import MainAccountScreen from '../screens/AccountScreens/MainAccount';
import OrderHistory from '../screens/AccountScreens/OrderHistory';

const AccountScreen: React.FC = () => {

  return (
      <Stack.Navigator >
        <Stack.Screen name="MainAccount" component={MainAccountScreen} options={{title:'Account'}}/>
        <Stack.Screen name="OrderHistory" component={OrderHistory} options={{title:'Order History'}}/>
      </Stack.Navigator>
  );
};


export default AccountScreen;
