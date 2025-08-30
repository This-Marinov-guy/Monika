import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { resetPassword } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Link Sent', 
        'Please check your email for password reset instructions.',
        [
          {
            text: 'Back to Login',
            onPress: () => router.replace('/auth/login'),
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Password Reset Error', error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Forgot Password',
        headerStyle: {
          backgroundColor: theme.colors.primary.base,
        },
        headerTintColor: theme.colors.neutral.white,
      }} />
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        <ThemedView style={styles.formContainer} variant="cardOutlined">
          <ThemedText type="h3" style={styles.title} color="primary.base">Forgot Password</ThemedText>
          <ThemedText type="body1" style={styles.subtitle} color="neutral.darkGrey">
            Enter your email address and we'll send you a link to reset your password.
          </ThemedText>
          
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
          
          <Button
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleResetPassword}
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            style={styles.resetButton}
          />
          
          <Button
            title="Back to Login"
            onPress={() => router.back()}
            variant="text"
            size="md"
            disabled={loading}
            style={styles.backButton}
          />
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  formContainer: {
    width: '100%',
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  resetButton: {
    marginBottom: theme.spacing.md,
  },
  backButton: {
    marginBottom: theme.spacing.xs,
  },
});