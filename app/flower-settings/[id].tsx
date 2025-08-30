import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlowerSchedule, Person } from '@/models/Person';

// Sample people data (same as in other screens)
const SAMPLE_PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    label: 'Girlfriend',
    image: 'https://picsum.photos/id/64/200',
    preferences: ['Books', 'Hiking', 'Photography'],
    importantDates: [
      {
        id: '101',
        type: 'birthday',
        date: '1995-05-15',
        reminderDays: [1, 7, 30]
      },
      {
        id: '102',
        type: 'anniversary',
        date: '2022-09-22',
        reminderDays: [1, 7, 30]
      }
    ],
    giftIdeas: [
      {
        id: '201',
        name: 'DSLR Camera',
        description: 'Canon EOS Rebel T7',
        price: 449.99,
        occasion: 'birthday'
      },
      {
        id: '202',
        name: 'Hiking Boots',
        description: 'Waterproof trail boots',
        price: 120,
        occasion: 'anniversary'
      }
    ],
    flowerSchedule: {
      enableWomensDay: true,
      enableValentinesDay: true,
      enableBirthday: true,
      enableAnniversary: true,
      randomDates: 2,
      reminderDays: [1, 3]
    }
  },
  {
    id: '2',
    name: 'Mom',
    label: 'Family',
    image: 'https://picsum.photos/id/76/200',
    preferences: ['Gardening', 'Cooking', 'Reading'],
    importantDates: [
      {
        id: '103',
        type: 'birthday',
        date: '1965-11-03',
        reminderDays: [1, 7, 30]
      }
    ],
    giftIdeas: [
      {
        id: '203',
        name: 'Gardening Kit',
        description: 'Premium gardening tools set',
        price: 89.99,
        occasion: 'birthday'
      }
    ],
    flowerSchedule: {
      enableWomensDay: true,
      enableValentinesDay: false,
      enableBirthday: true,
      enableAnniversary: false,
      randomDates: 1,
      reminderDays: [1, 3]
    }
  }
];

export default function FlowerSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [flowerSchedule, setFlowerSchedule] = useState<FlowerSchedule>({
    enableWomensDay: false,
    enableValentinesDay: false,
    enableBirthday: false,
    enableAnniversary: false,
    randomDates: 0,
    reminderDays: [1, 3]
  });
  
  // Reminder days input as a string for easier editing
  const [reminderDaysInput, setReminderDaysInput] = useState<string>('');
  
  // Get person data
  useEffect(() => {
    const foundPerson = SAMPLE_PEOPLE.find(p => p.id === id);
    if (foundPerson) {
      setPerson(foundPerson);
      
      // Initialize flower schedule from person data if available
      if (foundPerson.flowerSchedule) {
        setFlowerSchedule(foundPerson.flowerSchedule);
        setReminderDaysInput(foundPerson.flowerSchedule.reminderDays.join(', '));
      }
    }
  }, [id]);
  
  const handleToggleSwitch = (field: keyof FlowerSchedule, value: boolean) => {
    setFlowerSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleRandomDatesChange = (value: string) => {
    const number = parseInt(value, 10);
    if (!isNaN(number) && number >= 0) {
      setFlowerSchedule(prev => ({
        ...prev,
        randomDates: number
      }));
    } else if (value === '') {
      setFlowerSchedule(prev => ({
        ...prev,
        randomDates: 0
      }));
    }
  };
  
  const handleReminderDaysChange = (value: string) => {
    setReminderDaysInput(value);
    
    // Parse the comma-separated list of days
    const daysArray = value.split(',')
      .map(day => parseInt(day.trim(), 10))
      .filter(day => !isNaN(day) && day > 0);
    
    // Update the flower schedule with the parsed days
    if (daysArray.length > 0) {
      setFlowerSchedule(prev => ({
        ...prev,
        reminderDays: daysArray
      }));
    } else {
      setFlowerSchedule(prev => ({
        ...prev,
        reminderDays: [1] // Default to at least 1 day reminder
      }));
    }
  };
  
  const handleSave = () => {
    // In a real app, this would save the flower schedule to a database
    // For this demo, we'll just navigate back to the person detail page
    router.push(`/person/${id}`);
  };
  
  if (!person) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: `Flower Schedule: ${person.name}` }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle">
            Configure when to give flowers to {person.name}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Special Dates</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Women's Day (March 8)</ThemedText>
            <Switch
              value={flowerSchedule.enableWomensDay}
              onValueChange={(value) => handleToggleSwitch('enableWomensDay', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={flowerSchedule.enableWomensDay ? '#4BB675' : '#FFF'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Valentine's Day (February 14)</ThemedText>
            <Switch
              value={flowerSchedule.enableValentinesDay}
              onValueChange={(value) => handleToggleSwitch('enableValentinesDay', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={flowerSchedule.enableValentinesDay ? '#4BB675' : '#FFF'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Birthday</ThemedText>
            <Switch
              value={flowerSchedule.enableBirthday}
              onValueChange={(value) => handleToggleSwitch('enableBirthday', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={flowerSchedule.enableBirthday ? '#4BB675' : '#FFF'}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Anniversary</ThemedText>
            <Switch
              value={flowerSchedule.enableAnniversary}
              onValueChange={(value) => handleToggleSwitch('enableAnniversary', value)}
              trackColor={{ false: '#E9ECEF', true: '#8FDC9F' }}
              thumbColor={flowerSchedule.enableAnniversary ? '#4BB675' : '#FFF'}
              disabled={!person.importantDates.some(date => date.type === 'anniversary')}
            />
          </ThemedView>
          
          {!person.importantDates.some(date => date.type === 'anniversary') && (
            <ThemedText style={styles.helperText}>
              No anniversary date set. Add an anniversary date in the person's profile.
            </ThemedText>
          )}
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Random Flower Surprises</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Number of random flowers per month:</ThemedText>
            <TextInput
              style={styles.numberInput}
              value={flowerSchedule.randomDates.toString()}
              onChangeText={handleRandomDatesChange}
              keyboardType="number-pad"
              maxLength={1}
            />
          </ThemedView>
          
          <ThemedText style={styles.helperText}>
            Random dates will be generated each month to surprise {person.name} with flowers.
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Reminder Settings</ThemedText>
          
          <ThemedText style={styles.label}>Days before to send reminders:</ThemedText>
          <TextInput
            style={styles.input}
            value={reminderDaysInput}
            onChangeText={handleReminderDaysChange}
            placeholder="1, 3, 7"
            keyboardType="number-pad"
          />
          
          <ThemedText style={styles.helperText}>
            Enter days separated by commas. For example: 1, 3, 7 will send reminders 7 days before, 3 days before, and 1 day before.
          </ThemedText>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  numberInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    padding: 8,
    width: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 8,
    fontStyle: 'italic',
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
