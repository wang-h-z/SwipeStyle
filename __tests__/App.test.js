import 'react-native';
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (obj) => obj.ios,
}));

jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => ({
  setBarStyle: jest.fn(),
  setBackgroundColor: jest.fn(),
}));

jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  RNDeviceInfo: {
    getConstants: jest.fn(),
  },
  RNGestureHandlerModule: {
    getConstants: jest.fn(),
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    State: {},
  },
  PlatformConstants: {
    getConstants: () => ({
      forceTouchAvailable: false,
    }),
  },
}));

jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }) => children,
  usePaymentSheet: jest.fn().mockReturnValue({
    initPaymentSheet: jest.fn(),
    presentPaymentSheet: jest.fn(),
  }),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => children,
}));

import { useAuth } from '../context/AuthContext';

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the WelcomeScreen when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, loading: false, onboarded: null });
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Welcome to\nStyleSwipe')).toBeTruthy();
    });
  });

  it('renders the LoginScreen when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, loading: false, onboarded: null });
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Login')).toBeTruthy();
    });
  });

  it('renders the RegisterScreen when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, loading: false, onboarded: null });
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Register')).toBeTruthy();
    });
  });

  it('renders the OnboardingScreen when authenticated but not onboarded', async () => {
    useAuth.mockReturnValue({ user: {}, loading: false, onboarded: false });
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('What is your gender?')).toBeTruthy();
    });
  });

  it('does not render anything when loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true, onboarded: null });
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeNull();
  });
});
