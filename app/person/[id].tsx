import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GiftIdea, ImportantDate, Person } from '@/models/Person';
import { formatDate } from '@/utils/dateUtils';

// Sample people data (same as in tabs)
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

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data from a database or API
    const foundPerson = SAMPLE_PEOPLE.find(p => p.id === id);
    if (foundPerson) {
      setPerson(foundPerson);
    }
  }, [id]);
  
  if (!person) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  
  const renderImportantDateItem = ({ item }: { item: ImportantDate }) => (
    <ThemedView style={styles.dateCard}>
      <ThemedView style={styles.dateInfo}>
        <ThemedText style={styles.dateTypeText}>
          {item.type === 'birthday' ? 'Birthday' : 
           item.type === 'anniversary' ? 'Anniversary' : 
           item.name || 'Custom Date'}
        </ThemedText>
        <ThemedText style={styles.dateValue}>{formatDate(item.date)}</ThemedText>
      </ThemedView>
      
      <TouchableOpacity style={styles.editButton} onPress={() => router.push(`/edit-date/${item.id}?personId=${person.id}`)}>
        <ThemedText style={styles.editButtonText}>Edit</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
  
  const renderGiftItem = ({ item }: { item: GiftIdea }) => (
    <TouchableOpacity 
      style={styles.giftCard} 
      onPress={() => router.push(`/gift-detail/${item.id}?personId=${person.id}`)}
    >
      <ThemedView style={styles.giftInfo}>
        <ThemedText style={styles.giftName}>{item.name}</ThemedText>
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
        {item.isAiSuggested && (
          <ThemedView style={styles.aiSuggestedContainer}>
            <ThemedText style={styles.aiSuggestedText}>AI Suggested</ThemedText>
          </ThemedView>
        )}
        {item.isPurchased && (
          <ThemedView style={styles.purchasedContainer}>
            <ThemedText style={styles.purchasedText}>Purchased</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
  
  return (
    <>
      <Stack.Screen options={{ title: person.name }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <Image 
            source={{ uri: person.image }}
            style={styles.personImage}
            contentFit="cover"
          />
          
          <ThemedView style={styles.personInfo}>
            <ThemedText type="title">{person.name}</ThemedText>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.labelText}>{person.label}</ThemedText>
            </ThemedView>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => router.push(`/edit-person/${person.id}`)}
            >
              <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        
        <TouchableOpacity 
          style={styles.notificationSettingsButton}
          onPress={() => router.push(`/reminder-settings?personId=${person.id}`)}
        >
          <ThemedText style={styles.notificationSettingsText}>
            Notification Settings
          </ThemedText>
          <ThemedView style={styles.notificationSettingsBadges}>
            <ThemedView style={styles.notificationBadge}>
              <ThemedText style={styles.notificationBadgeText}>Push</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.notificationBadge, styles.calendarBadge]}>
              <ThemedText style={styles.notificationBadgeText}>Calendar</ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
        
        {person.preferences && person.preferences.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Preferences</ThemedText>
            <ThemedView style={styles.preferencesContainer}>
              {person.preferences.map((preference, index) => (
                <ThemedView key={index} style={styles.preferenceTag}>
                  <ThemedText style={styles.preferenceText}>{preference}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}
        
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">Important Dates</ThemedText>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push(`/add-date?personId=${person.id}`)}
            >
              <ThemedText style={styles.addButtonText}>+</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {person.importantDates.length > 0 ? (
            <FlatList
              data={person.importantDates}
              renderItem={renderImportantDateItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} // Disable scrolling as it's already inside ScrollView
              contentContainerStyle={styles.datesContainer}
            />
          ) : (
            <ThemedText style={styles.emptyText}>No important dates added yet</ThemedText>
          )}
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">Gift Ideas</ThemedText>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push(`/add-gift?personId=${person.id}`)}
            >
              <ThemedText style={styles.addButtonText}>+</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {person.giftIdeas.length > 0 ? (
            <FlatList
              data={person.giftIdeas}
              renderItem={renderGiftItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} // Disable scrolling as it's already inside ScrollView
              contentContainerStyle={styles.giftsContainer}
            />
          ) : (
            <ThemedText style={styles.emptyText}>No gift ideas added yet</ThemedText>
          )}
          
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={() => router.push(`/ai-gift-suggestions?personId=${person.id}`)}
          >
            <ThemedText style={styles.aiButtonText}>Get AI Gift Suggestions</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle">Flower Schedule</ThemedText>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => router.push(`/flower-settings/${person.id}`)}
            >
              <ThemedText style={styles.editButtonText}>Edit</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          {person.flowerSchedule ? (
            <ThemedView style={styles.flowerScheduleContainer}>
              <ThemedView style={styles.flowerSettingRow}>
                <ThemedText>Women's Day (March 8)</ThemedText>
                <ThemedText>{person.flowerSchedule.enableWomensDay ? '✓' : '✗'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flowerSettingRow}>
                <ThemedText>Valentine's Day (Feb 14)</ThemedText>
                <ThemedText>{person.flowerSchedule.enableValentinesDay ? '✓' : '✗'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flowerSettingRow}>
                <ThemedText>Birthday</ThemedText>
                <ThemedText>{person.flowerSchedule.enableBirthday ? '✓' : '✗'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flowerSettingRow}>
                <ThemedText>Anniversary</ThemedText>
                <ThemedText>{person.flowerSchedule.enableAnniversary ? '✓' : '✗'}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.flowerSettingRow}>
                <ThemedText>Random flowers per month</ThemedText>
                <ThemedText>{person.flowerSchedule.randomDates}</ThemedText>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedView style={styles.flowerScheduleContainer}>
              <ThemedText style={styles.emptyText}>No flower schedule set up</ThemedText>
              <TouchableOpacity 
                style={styles.setupButton} 
                onPress={() => router.push(`/flower-settings/${person.id}`)}
              >
                <ThemedText style={styles.setupButtonText}>Set Up Schedule</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
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
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationSettingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginTop: 16,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  notificationSettingsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343A40',
  },
  notificationSettingsBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  notificationBadge: {
    backgroundColor: '#4BB675',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  calendarBadge: {
    backgroundColor: '#5AA9E6',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  personImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
  },
  personInfo: {
    flex: 1,
    marginLeft: 16,
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
  labelText: {
    fontSize: 12,
    color: '#6C757D',
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  preferenceTag: {
    backgroundColor: '#E9ECEF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  preferenceText: {
    fontSize: 14,
    color: '#343A40',
  },
  datesContainer: {
    marginTop: 8,
    gap: 8,
  },
  dateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  dateInfo: {
    flex: 1,
  },
  dateTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343A40',
  },
  dateValue: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  giftsContainer: {
    marginTop: 8,
    gap: 12,
  },
  giftCard: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  giftInfo: {
    gap: 4,
  },
  giftName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
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
  aiSuggestedContainer: {
    backgroundColor: '#8FDC9F',
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
  purchasedContainer: {
    backgroundColor: '#7BBCEF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  purchasedText: {
    fontSize: 12,
    color: '#2C79B9',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4BB675',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  editButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 12,
    color: '#6C757D',
  },
  emptyText: {
    fontSize: 14,
    color: '#6C757D',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  aiButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#5AA9E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  flowerScheduleContainer: {
    marginTop: 8,
    gap: 8,
  },
  flowerSettingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  setupButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8C8DC',
    borderRadius: 8,
    alignItems: 'center',
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#803D52',
  },
});
