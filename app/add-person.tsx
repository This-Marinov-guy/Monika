import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AddPersonScreen() {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string>('');
  const [birthdate, setBirthdate] = useState('');
  
  const [errors, setErrors] = useState<{
    name?: string;
    label?: string;
    birthdate?: string;
  }>({});
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      label?: string;
      birthdate?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!label.trim()) {
      newErrors.label = 'Label is required';
    }
    
    if (birthdate) {
      // Simple date validation (YYYY-MM-DD format)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(birthdate)) {
        newErrors.birthdate = 'Please use YYYY-MM-DD format';
      } else {
        const date = new Date(birthdate);
        if (isNaN(date.getTime())) {
          newErrors.birthdate = 'Invalid date';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      // In a real app, this would save the person to a database
      // For this demo, we'll just navigate back to the people list
      router.push('/');
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Add New Person' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.form}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.personImage} />
            ) : (
              <ThemedView style={styles.placeholderImage}>
                <ThemedText style={styles.placeholderText}>Add Photo</ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Name</ThemedText>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
            />
            {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Label (e.g., Girlfriend, Mom, Best Friend)</ThemedText>
            <TextInput
              style={[styles.input, errors.label ? styles.inputError : null]}
              value={label}
              onChangeText={setLabel}
              placeholder="Enter label"
            />
            {errors.label && <ThemedText style={styles.errorText}>{errors.label}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Preferences (comma separated)</ThemedText>
            <TextInput
              style={styles.input}
              value={preferences}
              onChangeText={setPreferences}
              placeholder="Books, Hiking, Photography"
              multiline
            />
          </ThemedView>
          
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Birthday (YYYY-MM-DD)</ThemedText>
            <TextInput
              style={[styles.input, errors.birthdate ? styles.inputError : null]}
              value={birthdate}
              onChangeText={setBirthdate}
              placeholder="1990-01-31"
            />
            {errors.birthdate && <ThemedText style={styles.errorText}>{errors.birthdate}</ThemedText>}
          </ThemedView>
          
          <ThemedView style={styles.flowerOptionsContainer}>
            <ThemedText style={styles.sectionTitle}>Flower Schedule Options</ThemedText>
            <ThemedText style={styles.helperText}>
              You can set up flower scheduling options after creating the person.
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
              <ThemedText style={styles.saveButtonText}>Save Person</ThemedText>
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  personImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6C757D',
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
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    color: '#DC3545',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  flowerOptionsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  helperText: {
    fontSize: 14,
    color: '#6C757D',
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
