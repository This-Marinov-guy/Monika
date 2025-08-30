import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Person } from '@/models/Person';

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

export default function AddGiftScreen() {
  const { personId } = useLocalSearchParams<{ personId?: string }>();
  
  const [person, setPerson] = useState<Person | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [occasion, setOccasion] = useState('');
  const [url, setUrl] = useState('');
  
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});
  
  // If personId is provided, fetch the person
  useEffect(() => {
    if (personId) {
      const foundPerson = SAMPLE_PEOPLE.find(p => p.id === personId);
      if (foundPerson) {
        setPerson(foundPerson);
      }
    }
  }, [personId]);
  
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      price?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Gift name is required';
    }
    
    if (price && isNaN(parseFloat(price))) {
      newErrors.price = 'Price must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      // In a real app, this would save the gift to a database
      // For this demo, we'll just navigate back
      
      if (personId) {
        router.push(`/person/${personId}`);
      } else {
        router.push('/gifts');
      }
    }
  };
  
  const occasionOptions = [
    'birthday', 
    'anniversary', 
    'christmas', 
    'valentines', 
    'graduation', 
    'wedding', 
    'other'
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: 'Add Gift Idea' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.form}>
          {person && (
            <ThemedView style={styles.personContainer}>
              <ThemedText style={styles.forText}>For: {person.name}</ThemedText>
            </ThemedView>
          )}
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Gift Name</ThemedText>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={setName}
              placeholder="Enter gift name"
            />
            {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Description (optional)</ThemedText>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter gift description"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Price (optional)</ThemedText>
            <TextInput
              style={[styles.input, errors.price ? styles.inputError : null]}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="numeric"
            />
            {errors.price && <ThemedText style={styles.errorText}>{errors.price}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Occasion</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.occasionSelector}>
              {occasionOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.occasionOption,
                    occasion === option ? styles.occasionOptionSelected : null
                  ]}
                  onPress={() => setOccasion(option)}
                >
                  <ThemedText
                    style={[
                      styles.occasionText,
                      occasion === option ? styles.occasionTextSelected : null
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>URL Link (optional)</ThemedText>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com/product"
              keyboardType="url"
              autoCapitalize="none"
            />
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
              <ThemedText style={styles.saveButtonText}>Save Gift</ThemedText>
            </TouchableOpacity>
          </ThemedView>
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
  form: {
    padding: 16,
  },
  personContainer: {
    backgroundColor: '#E9ECEF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  forText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
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
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    marginTop: 4,
  },
  occasionSelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  occasionOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'white',
  },
  occasionOptionSelected: {
    borderColor: '#5AA9E6',
    backgroundColor: '#5AA9E6',
  },
  occasionText: {
    color: '#6C757D',
  },
  occasionTextSelected: {
    color: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
