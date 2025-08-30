import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GiftIdea, Person } from '@/models/Person';

// Sample data for demonstration - using the same data from index.tsx
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

type GiftWithPerson = GiftIdea & {
  personId: string;
  personName: string;
};

export default function GiftsScreen() {
  // Transform gift ideas to include the person they're for
  const allGifts: GiftWithPerson[] = SAMPLE_PEOPLE.flatMap(person => 
    person.giftIdeas.map(gift => ({
      ...gift,
      personId: person.id,
      personName: person.name
    }))
  );
  
  const [gifts, setGifts] = useState<GiftWithPerson[]>(allGifts);
  
  const navigateToGiftDetail = (gift: GiftWithPerson) => {
    router.push({
      pathname: `/gift-detail/${gift.id}`,
      params: { personId: gift.personId }
    });
  };
  
  const renderGiftItem = ({ item }: { item: GiftWithPerson }) => (
    <TouchableOpacity 
      style={styles.giftCard} 
      onPress={() => navigateToGiftDetail(item)}
    >
      <ThemedView style={styles.giftCardContent}>
        <ThemedView style={styles.giftInfo}>
          <ThemedText type="subtitle">{item.name}</ThemedText>
          {item.description && (
            <ThemedText style={styles.giftDescription}>{item.description}</ThemedText>
          )}
          <ThemedView style={styles.giftMeta}>
            {item.price && (
              <ThemedText style={styles.giftPrice}>${item.price.toFixed(2)}</ThemedText>
            )}
            {item.occasion && (
              <ThemedView style={styles.occasionContainer}>
                <ThemedText style={styles.occasionText}>{item.occasion}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          <ThemedText style={styles.personText}>For: {item.personName}</ThemedText>
          {item.isAiSuggested && (
            <ThemedView style={styles.aiSuggestedContainer}>
              <ThemedText style={styles.aiSuggestedText}>AI Suggested</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#5AA9E6', dark: '#2C79B9' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Gift Ideas</ThemedText>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-gift')}>
            <ThemedText style={styles.addButtonText}>+</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.filtersContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <ThemedText style={styles.filterTextActive}>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>AI Suggested</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <ThemedText style={styles.filterText}>Purchased</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <FlatList
          data={gifts}
          renderItem={renderGiftItem}
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
    backgroundColor: '#5AA9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },
  filterButtonActive: {
    backgroundColor: '#5AA9E6',
  },
  filterText: {
    fontSize: 14,
    color: '#6C757D',
  },
  filterTextActive: {
    fontSize: 14,
    color: 'white',
  },
  listContainer: {
    gap: 16,
  },
  giftCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  giftCardContent: {
    padding: 16,
  },
  giftInfo: {
    gap: 4,
  },
  giftDescription: {
    fontSize: 14,
    color: '#6C757D',
  },
  giftMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  giftPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4BB675',
  },
  occasionContainer: {
    backgroundColor: '#E9ECEF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  occasionText: {
    fontSize: 12,
    color: '#6C757D',
  },
  personText: {
    fontSize: 14,
    color: '#343A40',
    marginTop: 8,
  },
  aiSuggestedContainer: {
    backgroundColor: '#8FDCAF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  aiSuggestedText: {
    fontSize: 12,
    color: '#2A744A',
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
