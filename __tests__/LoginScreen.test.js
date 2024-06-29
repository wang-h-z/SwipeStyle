import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { supabase } from '../lib/supabase'; // Mocked
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../lib/supabase', () => ({
  auth: {
    signInWithPassword: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    expect(getByText('Welcome Back!')).toBeTruthy();
    expect(getByPlaceholderText('Username or Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });


});
