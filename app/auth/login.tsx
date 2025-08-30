import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { useTheme } from '@/context/ThemeContext';
import { signInWithEmail, signInWithGoogle } from '@/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { getThemedColor } = useTheme();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // On successful login, navigate to the app
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Auth state change listener will handle navigation
    } catch (error: any) {
      Alert.alert('Google Login Error', error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        <View style={styles.logoContainer}>
          <AppIcon size={120} />
          <ThemedText type="h1" style={styles.title} color="primary.base">Monika</ThemedText>
          <ThemedText type="h5" style={styles.subtitle} color="neutral.darkGrey">Gift & Flower Assistant</ThemedText>
        </View>
        
        <ThemedView style={styles.formContainer} variant="cardOutlined">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/auth/forgot-password')}
            disabled={loading}
          >
            <ThemedText style={styles.forgotPasswordText} color="secondary.base">Forgot Password?</ThemedText>
          </TouchableOpacity>
          
          <Button
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            style={styles.loginButton}
          />
          
          <View style={styles.orContainer}>
            <View style={[styles.divider, { backgroundColor: getThemedColor('neutral.lightGrey') }]} />
            <ThemedText style={styles.orText} color="neutral.darkGrey">OR</ThemedText>
            <View style={[styles.divider, { backgroundColor: getThemedColor('neutral.lightGrey') }]} />
          </View>
          
          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="outline"
            size="md"
            disabled={loading}
            loading={loading}
            style={styles.googleButton}
          />
          
          <View style={styles.signupContainer}>
            <ThemedText type="body2" color="neutral.darkGrey">Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <ThemedText type="body2" color="primary.base" style={styles.signupText}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxs,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    width: '100%',
    padding: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginTop: theme.spacing.sm,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: theme.spacing.xs,
    fontSize: 14,
  },
  googleButton: {
    marginBottom: theme.spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  signupText: {
    fontWeight: '600',
  },
});