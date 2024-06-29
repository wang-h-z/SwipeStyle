import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen'; // Adjust the path as needed

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    onboarded: null,
  }),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('WelcomeScreen', () => {
  it('should render the WelcomeScreen correctly', async () => {
    const { findByText, getByTestId } = render(
      <NavigationContainer>
        <WelcomeScreen />
      </NavigationContainer>
    );

    const welcomeText = await findByText('Welcome to\nStyleSwipe');
    expect(welcomeText).toBeTruthy();
    expect(getByTestId('LoginButtonWelcScreen')).toBeTruthy();
    expect(getByTestId('RegisterButtonWelcScreen')).toBeTruthy();
  });

  it('should display "Login" and "Register" buttons', () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <WelcomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByTestId('LoginButtonWelcScreen')).toBeTruthy();
    expect(getByTestId('RegisterButtonWelcScreen')).toBeTruthy();
  });

  it('should navigate to Login screen when "Login" button is pressed', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <WelcomeScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('LoginButtonWelcScreen'));
    // Add your navigation assertions here
  });

  it('should navigate to Register screen when "Register" button is pressed', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <WelcomeScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('RegisterButtonWelcScreen'));
    // Add your navigation assertions here
  });
});
