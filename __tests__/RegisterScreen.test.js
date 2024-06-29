import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../screens/RegisterScreen';
import { supabase } from '../lib/supabase'; // Mocked
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../lib/supabase', () => ({
  auth: {
    signInWithPassword: jest.fn(),
  },
}));

describe('RegisterScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <RegisterScreen />
      </NavigationContainer>
    );
  };

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    expect(getByText(`Let's bring you onboard`)).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });


});
