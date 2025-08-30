import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
      <Stack.Screen options={{ title: 'Your Profile' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Your Account</ThemedText>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Account Information</ThemedText>
          
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedText style={styles.value}>{user?.email}</ThemedText>
          </ThemedView>
          
          {user?.user_metadata?.name && (
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <ThemedText style={styles.value}>{user.user_metadata.name}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        
        <ThemedView style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push('/change-password')}
          >
            <ThemedText style={styles.optionText}>Change Password</ThemedText>
            <ThemedText style={styles.arrowIcon}>›</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push('/reminder-settings')}
          >
            <ThemedText style={styles.optionText}>Notification Settings</ThemedText>
            <ThemedText style={styles.arrowIcon}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <TouchableOpacity 
          style={[styles.signOutButton, loading && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={loading}
        >
          <ThemedText style={styles.signOutButtonText}>
            {loading ? 'Signing Out...' : 'Sign Out'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  label: {
    fontSize: 16,
    color: '#6C757D',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  optionText: {
    fontSize: 16,
  },
  arrowIcon: {
    fontSize: 22,
    color: '#6C757D',
  },
  signOutButton: {
    backgroundColor: '#DC3545',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
