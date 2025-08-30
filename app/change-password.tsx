import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { updatePassword } from '@/services/authService';

export default function ChangePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      await updatePassword(password);
      Alert.alert(
        'Success', 
        'Your password has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Change Password',
        headerStyle: {
          backgroundColor: theme.colors.primary.base,
        },
        headerTintColor: theme.colors.neutral.white,
      }} />
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        <ThemedView style={styles.formContainer} variant="card">
          <ThemedText type="h3" style={styles.title} color="primary.base">Change Password</ThemedText>
          <ThemedText type="body1" style={styles.subtitle} color="neutral.darkGrey">
            Enter your new password below.
          </ThemedText>
          
          <Input
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
            containerStyle={styles.inputContainer}
          />
          
          <Button
            title={loading ? 'Updating...' : 'Update Password'}
            onPress={handleChangePassword}
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            style={styles.updateButton}
          />
          
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="text"
            size="md"
            disabled={loading}
            style={styles.cancelButton}
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
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  updateButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    marginBottom: theme.spacing.xs,
  },
});