import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before assets are loaded
SplashScreen.preventAutoHideAsync();

// Root layout component
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
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
        <ActivityIndicator size="large" color="#4BB675" />
      </ThemedView>
    );
  }

  return (
    <Stack>
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