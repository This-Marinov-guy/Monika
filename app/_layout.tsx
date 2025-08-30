import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import useFonts from '@/hooks/useFonts';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before assets are loaded
SplashScreen.preventAutoHideAsync();

// Root layout component
export default function RootLayout() {
  const { fontsLoaded, error } = useFonts();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { initialized, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Wait for auth to initialize
  useEffect(() => {
    if (initialized) {
      setIsLoading(false);
    }
  }, [initialized]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.base} />
      </ThemedView>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.base,
        },
        headerTintColor: theme.colors.neutral.white,
        headerTitleStyle: {
          fontWeight: '600',
          fontFamily: 'Satoshi-SemiBold',
        },
        contentStyle: {
          backgroundColor: theme.colors.neutral.offWhite,
        },
      }}
    >
      {/* If not authenticated, redirect to auth screens */}
      {!session && (
        <>
          <Stack.Screen name="index" redirect={true} options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" redirect={true} options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" options={{ headerTitle: 'Forgot Password' }} />
        </>
      )}
      
      {/* If authenticated, redirect to app screens */}
      {session && (
        <>
          <Stack.Screen name="auth/login" redirect={true} options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" redirect={true} options={{ headerShown: false }} />
          <Stack.Screen name="auth/forgot-password" redirect={true} options={{ headerShown: false }} />
          
          {/* App screens with standard header styles */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="person/[id]" options={{ headerTitle: 'Person Details' }} />
          <Stack.Screen name="add-person" options={{ headerTitle: 'Add Person' }} />
          <Stack.Screen name="add-gift" options={{ headerTitle: 'Add Gift' }} />
          <Stack.Screen name="add-date" options={{ headerTitle: 'Add Important Date' }} />
          <Stack.Screen name="reminder-settings" options={{ headerTitle: 'Notification Settings' }} />
          <Stack.Screen name="flower-settings/[id]" options={{ headerTitle: 'Flower Settings' }} />
          <Stack.Screen name="ai-gift-suggestions" options={{ headerTitle: 'AI Gift Suggestions' }} />
          <Stack.Screen name="profile" options={{ headerTitle: 'Your Profile' }} />
          <Stack.Screen name="change-password" options={{ headerTitle: 'Change Password' }} />
        </>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});