import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Person } from '@/models/Person';

// Sample data for demonstration
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

export default function PeopleScreen() {
  const [people, setPeople] = useState<Person[]>(SAMPLE_PEOPLE);
  
  const navigateToPersonDetail = (personId: string) => {
    router.push(`/person/${personId}`);
  };
  
  const renderPersonItem = ({ item }: { item: Person }) => (
    <TouchableOpacity 
      style={styles.personCard} 
      onPress={() => navigateToPersonDetail(item.id)}
    >
      <ThemedView style={styles.personCardContent}>
        <Image 
          source={{ uri: item.image }}
          style={styles.personImage}
          contentFit="cover"
        />
        <ThemedView style={styles.personInfo}>
          <ThemedText type="subtitle">{item.name}</ThemedText>
          <ThemedView style={styles.labelContainer}>
            <ThemedText style={styles.label}>{item.label}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.upcomingDateText}>
            {item.importantDates[0] ? 
              `Next: ${new Date(item.importantDates[0].date).toLocaleDateString()}` : 
              'No upcoming dates'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4BB675', dark: '#2A744A' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">My People</ThemedText>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-person')}>
            <ThemedText style={styles.addButtonText}>+</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <FlatList
          data={people}
          renderItem={renderPersonItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false} // Disable scrolling since it's already in ParallaxScrollView
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4BB675',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 16,
  },
  personCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  personCardContent: {
    flexDirection: 'row',
    padding: 0,
  },
  personImage: {
    width: 100,
    height: 100,
  },
  personInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  labelContainer: {
    backgroundColor: '#E9ECEF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    color: '#6C757D',
  },
  upcomingDateText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.7,
  },
});
