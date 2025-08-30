import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      // Auth context will handle redirection
    } catch (error: any) {
      Alert.alert('Sign Out Error', error.message || 'Failed to sign out');
      setLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Your Profile',
        headerStyle: {
          backgroundColor: theme.colors.primary.base,
        },
        headerTintColor: theme.colors.neutral.white,
      }} />
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        <ThemedText type="h2" style={styles.title} color="primary.base">Your Account</ThemedText>
        
        <ThemedView style={styles.card} variant="card">
          <ThemedText type="h5" style={styles.sectionTitle} color="neutral.charcoal">Account Information</ThemedText>
          
          <ThemedView style={styles.infoRow}>
            <ThemedText type="body2" style={styles.label} color="neutral.darkGrey">Email</ThemedText>
            <ThemedText type="body1" style={styles.value} color="neutral.charcoal">{user?.email}</ThemedText>
          </ThemedView>
          
          {user?.user_metadata?.name && (
            <ThemedView style={styles.infoRow}>
              <ThemedText type="body2" style={styles.label} color="neutral.darkGrey">Name</ThemedText>
              <ThemedText type="body1" style={styles.value} color="neutral.charcoal">{user.user_metadata.name}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        
        <ThemedView style={styles.optionsContainer} variant="card">
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push('/change-password')}
          >
            <ThemedText type="body1" color="neutral.charcoal">Change Password</ThemedText>
            <ThemedText style={styles.arrowIcon} color="neutral.darkGrey">›</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push('/reminder-settings')}
          >
            <ThemedText type="body1" color="neutral.charcoal">Notification Settings</ThemedText>
            <ThemedText style={styles.arrowIcon} color="neutral.darkGrey">›</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <Button
          title={loading ? 'Signing Out...' : 'Sign Out'}
          onPress={handleSignOut}
          variant="secondary"
          size="md"
          disabled={loading}
          loading={loading}
          style={styles.signOutButton}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightGrey,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.lightGrey,
  },
  arrowIcon: {
    fontSize: 22,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
  },
});