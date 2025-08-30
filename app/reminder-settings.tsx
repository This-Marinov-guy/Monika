import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ReminderSettings } from '@/models/Reminder';

// Default settings
const DEFAULT_SETTINGS: ReminderSettings = {
  enablePushNotifications: true,
  enableCalendarNotifications: false,
  defaultReminderDays: [1, 7, 30],
  defaultFlowerReminderDays: [1, 3]
};

// Sample people data (same as in other screens)
const SAMPLE_PEOPLE = [
  {
    id: '1',
    name: 'Sarah Johnson',
    label: 'Girlfriend',
    // ... other properties
  },
  {
    id: '2',
    name: 'Mom',
    label: 'Family',
    // ... other properties
  }
];

export default function ReminderSettingsScreen() {
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [personName, setPersonName] = useState<string | null>(null);
  
  useEffect(() => {
    if (personId) {
      // In a real app, fetch person-specific settings
      // For demo, find the name and set it
      const person = SAMPLE_PEOPLE.find(p => p.id === personId);
      if (person) {
        setPersonName(person.name);
      }
    }
  }, [personId]);
  
  const handleToggleSetting = (setting: keyof ReminderSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleConnectGoogle = () => {
    // In a real app, this would open Google OAuth flow
    // For this demo, we'll just toggle the state
    setIsGoogleConnected(!isGoogleConnected);
  };
  
  const handleSave = () => {
    // In a real app, this would save settings to storage/database
    // For this demo, we'll just go back
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ title: personName ? `${personName}'s Notifications` : 'Notification Settings' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle">
            {personName 
              ? `Configure notifications for ${personName}`
              : 'Configure how you receive notifications and reminders'}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Push Notifications</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Enable Push Notifications</ThemedText>
            <Switch
              value={settings.enablePushNotifications}
              onValueChange={(value) => handleToggleSetting('enablePushNotifications', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={settings.enablePushNotifications ? '#4BB675' : '#FFF'}
            />
          </ThemedView>
          
          <ThemedText style={styles.helperText}>
            Receive notifications on your device for upcoming gifts and flowers.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Google Calendar Integration</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Add events to Google Calendar</ThemedText>
            <Switch
              value={settings.enableCalendarNotifications}
              onValueChange={(value) => handleToggleSetting('enableCalendarNotifications', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={settings.enableCalendarNotifications ? '#4BB675' : '#FFF'}
              disabled={!isGoogleConnected}
            />
          </ThemedView>
          
          {!isGoogleConnected ? (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectGoogle}
            >
              <ThemedText style={styles.connectButtonText}>Connect Google Account</ThemedText>
            </TouchableOpacity>
          ) : (
            <>
              <ThemedView style={styles.googleConnectedContainer}>
                <ThemedText style={styles.googleConnectedText}>
                  ✓ Connected to Google Calendar
                </ThemedText>
                <TouchableOpacity onPress={handleConnectGoogle}>
                  <ThemedText style={styles.disconnectText}>Disconnect</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              <ThemedText style={styles.helperText}>
                Events will be added to your primary calendar with reminders.
              </ThemedText>
            </>
          )}
        </ThemedView>
        
        <ThemedView style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Save Settings</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  helperText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    fontStyle: 'italic',
  },
  connectButton: {
    backgroundColor: '#5AA9E6',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  connectButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  googleConnectedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  googleConnectedText: {
    color: '#28A745',
    fontWeight: '500',
  },
  disconnectText: {
    color: '#6C757D',
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#4BB675',
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6C757D',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
