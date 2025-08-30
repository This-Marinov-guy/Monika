import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
      <Stack.Screen options={{ title: 'Forgot Password' }} />
      <ThemedView style={styles.container}>
        <View style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>Back to Login</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  formContainer: {
    width: '100%',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4BB675',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  backButton: {
    alignSelf: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#5AA9E6',
    fontSize: 16,
    fontWeight: '500',
  },
});
