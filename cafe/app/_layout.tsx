import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, NavigationContainer, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { useState, useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../src/store/CartContext';
import { UserProvider, useUser } from '../src/store/UserContext';
import { MenuProvider } from '../src/store/MenuContext';
import { BillingProvider } from '../src/store/BillingContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '../src/store/ThemeContext';
import { AppPauseProvider } from '../src/store/AppPauseContext';
import { AnimatedSplashScreen } from '../src/components/SplashScreen';

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { user, isLoggedIn } = useUser();
  const [splashFinished, setSplashFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Handle navigation after splash finishes
  useEffect(() => {
    if (splashFinished && isReady) {
      // Navigate based on login status
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/register');
      }
    }
  }, [splashFinished, isReady, isLoggedIn]);

  const handleSplashFinish = () => {
    setSplashFinished(true);
    setIsReady(true);
  };

  if (!splashFinished) {
    return (
      <AnimatedSplashScreen onFinish={handleSplashFinish} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product-detail" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
          <Stack.Screen name="order-success" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <UserProvider>
        <MenuProvider>
          <BillingProvider>
            <CartProvider>
              <AppPauseProvider>
                <RootLayoutInner />
              </AppPauseProvider>
            </CartProvider>
          </BillingProvider>
        </MenuProvider>
      </UserProvider>
    </AppThemeProvider>
  );
}
