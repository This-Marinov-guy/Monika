import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GiftIdea, Person } from '@/models/Person';
import { getAiGiftSuggestions } from '@/services/aiService';

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

export default function AiGiftSuggestionsScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [giftSuggestions, setGiftSuggestions] = useState<GiftIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('any');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 500 });
  
  useEffect(() => {
    // In a real app, you would fetch this data from a database or API
    const foundPerson = SAMPLE_PEOPLE.find(p => p.id === personId);
    if (foundPerson) {
      setPerson(foundPerson);
      loadGiftSuggestions(foundPerson);
    }
  }, [personId]);
  
  const loadGiftSuggestions = async (targetPerson: Person, occasion: string = 'any') => {
    setLoading(true);
    try {
      const suggestions = await getAiGiftSuggestions(
        targetPerson,
        occasion !== 'any' ? occasion : undefined,
        priceRange
      );
      setGiftSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI gift suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOccasionChange = (occasion: string) => {
    setSelectedOccasion(occasion);
    if (person) {
      loadGiftSuggestions(person, occasion);
    }
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    const newRange = { min, max };
    setPriceRange(newRange);
    if (person) {
      loadGiftSuggestions(person, selectedOccasion, newRange);
    }
  };
  
  const addGiftToPerson = (gift: GiftIdea) => {
    // In a real app, you would save this to a database or API
    // For this demo, we'll just navigate back to the person detail screen
    router.push(`/person/${personId}`);
  };
  
  const renderGiftItem = ({ item }: { item: GiftIdea }) => (
    <ThemedView style={styles.giftCard}>
      <ThemedView style={styles.giftCardContent}>
        <ThemedText style={styles.giftName}>{item.name}</ThemedText>
        {item.description && (
          <ThemedText style={styles.giftDescription}>{item.description}</ThemedText>
        )}
        {item.price && (
          <ThemedText style={styles.giftPrice}>${item.price.toFixed(2)}</ThemedText>
        )}
        {item.occasion && item.occasion !== 'any' && (
          <ThemedView style={styles.occasionContainer}>
            <ThemedText style={styles.occasionText}>{item.occasion}</ThemedText>
          </ThemedView>
        )}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => addGiftToPerson(item)}
        >
          <ThemedText style={styles.addButtonText}>Add to Gift Ideas</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
  
  if (!person) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText>Person not found</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: `Gift Ideas for ${person.name}` }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">AI Gift Suggestions</ThemedText>
          <ThemedText style={styles.subheaderText}>
            Based on {person.name}'s preferences: {person.preferences?.join(', ')}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.filtersContainer}>
          <ThemedText style={styles.filterLabel}>Occasion:</ThemedText>
          <ThemedView style={styles.occasionFilters}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedOccasion === 'any' ? styles.filterButtonActive : null]}
              onPress={() => handleOccasionChange('any')}
            >
              <ThemedText style={selectedOccasion === 'any' ? styles.filterTextActive : styles.filterText}>Any</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedOccasion === 'birthday' ? styles.filterButtonActive : null]}
              onPress={() => handleOccasionChange('birthday')}
            >
              <ThemedText style={selectedOccasion === 'birthday' ? styles.filterTextActive : styles.filterText}>Birthday</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, selectedOccasion === 'anniversary' ? styles.filterButtonActive : null]}
              onPress={() => handleOccasionChange('anniversary')}
            >
              <ThemedText style={selectedOccasion === 'anniversary' ? styles.filterTextActive : styles.filterText}>Anniversary</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedText style={styles.filterLabel}>Price Range:</ThemedText>
          <ThemedView style={styles.priceFilters}>
            <TouchableOpacity 
              style={[styles.filterButton, priceRange.max === 50 ? styles.filterButtonActive : null]}
              onPress={() => handlePriceRangeChange(0, 50)}
            >
              <ThemedText style={priceRange.max === 50 ? styles.filterTextActive : styles.filterText}>Under $50</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, (priceRange.min === 50 && priceRange.max === 100) ? styles.filterButtonActive : null]}
              onPress={() => handlePriceRangeChange(50, 100)}
            >
              <ThemedText style={(priceRange.min === 50 && priceRange.max === 100) ? styles.filterTextActive : styles.filterText}>$50-$100</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, priceRange.min === 100 ? styles.filterButtonActive : null]}
              onPress={() => handlePriceRangeChange(100, 1000)}
            >
              <ThemedText style={priceRange.min === 100 ? styles.filterTextActive : styles.filterText}>$100+</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4BB675" />
            <ThemedText style={styles.loadingText}>Getting AI recommendations...</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={giftSuggestions}
            renderItem={renderGiftItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.giftListContainer}
            ListEmptyComponent={
              <ThemedView style={styles.emptyContainer}>
                <ThemedText>No gift suggestions found for the selected filters</ThemedText>
              </ThemedView>
            }
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  subheaderText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  occasionFilters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priceFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterButtonActive: {
    backgroundColor: '#5AA9E6',
    borderColor: '#5AA9E6',
  },
  filterText: {
    fontSize: 14,
    color: '#6C757D',
  },
  filterTextActive: {
    fontSize: 14,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  giftListContainer: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  giftCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  giftCardContent: {
    padding: 16,
  },
  giftName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  giftDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  giftPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4BB675',
    marginBottom: 8,
  },
  occasionContainer: {
    backgroundColor: '#E9ECEF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  occasionText: {
    fontSize: 12,
    color: '#6C757D',
  },
  addButton: {
    backgroundColor: '#4BB675',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
