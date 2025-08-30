import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/AppIcon';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { signUpWithEmail } from '@/services/authService';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      Alert.alert(
        'Registration Successful', 
        'Please check your email for verification instructions.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Error', error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Register', headerShown: false }} />
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        <View style={styles.headerContainer}>
          <AppIcon size={100} />
          <ThemedText type="h1" style={styles.title} color="primary.base">Create Account</ThemedText>
          <ThemedText type="h5" style={styles.subtitle} color="neutral.darkGrey">Join Monika Gift & Flower Assistant</ThemedText>
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <Button
            title={loading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <ThemedText type="body2" color="neutral.darkGrey">Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <ThemedText type="body2" color="primary.base" style={styles.loginText}>Login</ThemedText>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xxs,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    padding: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  loginText: {
    fontWeight: '600',
  },
});