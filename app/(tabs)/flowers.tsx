import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Person } from '@/models/Person';
import { daysUntil, formatDate, getValentinesDayDate, getWomensDayDate } from '@/utils/dateUtils';

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

// For demonstration purposes, let's create some upcoming flower dates
const CURRENT_YEAR = new Date().getFullYear();

type FlowerDate = {
  id: string;
  personId: string;
  personName: string;
  personImage?: string;
  date: string;
  occasion: string;
};

export default function FlowersScreen() {
  const [people] = useState<Person[]>(SAMPLE_PEOPLE);
  
  // Generate flower dates for each person
  const flowerDates: FlowerDate[] = useMemo(() => {
    const dates: FlowerDate[] = [];
    const today = new Date();
    
    people.forEach(person => {
      if (!person.flowerSchedule) return;
      
      // Women's Day
      if (person.flowerSchedule.enableWomensDay) {
        const womensDayDate = getWomensDayDate(CURRENT_YEAR);
        // If this year's Women's Day has passed, use next year
        const finalDate = new Date(womensDayDate) < today 
          ? getWomensDayDate(CURRENT_YEAR + 1) 
          : womensDayDate;
        
        dates.push({
          id: `wd-${person.id}`,
          personId: person.id,
          personName: person.name,
          personImage: person.image,
          date: finalDate,
          occasion: "Women's Day"
        });
      }
      
      // Valentine's Day
      if (person.flowerSchedule.enableValentinesDay) {
        const valentinesDate = getValentinesDayDate(CURRENT_YEAR);
        // If this year's Valentine's Day has passed, use next year
        const finalDate = new Date(valentinesDate) < today 
          ? getValentinesDayDate(CURRENT_YEAR + 1) 
          : valentinesDate;
        
        dates.push({
          id: `vd-${person.id}`,
          personId: person.id,
          personName: person.name,
          personImage: person.image,
          date: finalDate,
          occasion: "Valentine's Day"
        });
      }
      
      // Birthday
      if (person.flowerSchedule.enableBirthday) {
        const birthdayDate = person.importantDates.find(date => date.type === 'birthday');
        if (birthdayDate) {
          // Extract month and day from the birthdate
          const birthDate = new Date(birthdayDate.date);
          const month = birthDate.getMonth();
          const day = birthDate.getDate();
          
          // Create date for this year's birthday
          let thisYearBirthday = new Date(CURRENT_YEAR, month, day);
          // If birthday has passed this year, use next year's birthday
          if (thisYearBirthday < today) {
            thisYearBirthday = new Date(CURRENT_YEAR + 1, month, day);
          }
          
          dates.push({
            id: `bd-${person.id}`,
            personId: person.id,
            personName: person.name,
            personImage: person.image,
            date: thisYearBirthday.toISOString().split('T')[0],
            occasion: "Birthday"
          });
        }
      }
      
      // Anniversary
      if (person.flowerSchedule.enableAnniversary) {
        const anniversaryDate = person.importantDates.find(date => date.type === 'anniversary');
        if (anniversaryDate) {
          // Extract month and day from the anniversary date
          const annDate = new Date(anniversaryDate.date);
          const month = annDate.getMonth();
          const day = annDate.getDate();
          
          // Create date for this year's anniversary
          let thisYearAnniversary = new Date(CURRENT_YEAR, month, day);
          // If anniversary has passed this year, use next year's anniversary
          if (thisYearAnniversary < today) {
            thisYearAnniversary = new Date(CURRENT_YEAR + 1, month, day);
          }
          
          dates.push({
            id: `an-${person.id}`,
            personId: person.id,
            personName: person.name,
            personImage: person.image,
            date: thisYearAnniversary.toISOString().split('T')[0],
            occasion: "Anniversary"
          });
        }
      }
      
      // Random dates would be generated here using generateRandomFlowerDates utility
      // For demo purposes, we'll just add one random date
      if (person.flowerSchedule.randomDates > 0) {
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30) + 7); // Random date 7-37 days from now
        
        dates.push({
          id: `rd-${person.id}`,
          personId: person.id,
          personName: person.name,
          personImage: person.image,
          date: randomDate.toISOString().split('T')[0],
          occasion: "Just Because"
        });
      }
    });
    
    // Sort by date (closest first)
    return dates.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [people]);

  const navigateToFlowerDetail = (flower: FlowerDate) => {
    router.push({
      pathname: `/flower-detail/${flower.id}`,
      params: { personId: flower.personId }
    });
  };
  
  const renderFlowerDateItem = ({ item }: { item: FlowerDate }) => {
    const daysLeft = daysUntil(item.date);
    
    return (
      <TouchableOpacity 
        style={styles.flowerCard} 
        onPress={() => navigateToFlowerDetail(item)}
      >
        <ThemedView style={styles.flowerCardContent}>
          {item.personImage && (
            <Image 
              source={{ uri: item.personImage }}
              style={styles.personImage}
              contentFit="cover"
            />
          )}
          <ThemedView style={styles.flowerInfo}>
            <ThemedText type="subtitle">{item.personName}</ThemedText>
            <ThemedView style={styles.occasionContainer}>
              <ThemedText style={styles.occasionText}>{item.occasion}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.dateText}>{formatDate(item.date)}</ThemedText>
            <ThemedText 
              style={[styles.daysText, daysLeft <= 3 ? styles.urgentText : null]}
            >
              {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `${daysLeft} days left`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F8C8DC', dark: '#803D52' }} // Light pink for flowers
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Flower Schedule</ThemedText>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/flower-settings')}>
            <ThemedText style={styles.settingsButtonText}>⚙️</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {flowerDates.length > 0 ? (
          <FlatList
            data={flowerDates}
            renderItem={renderFlowerDateItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false} // Disable scrolling since it's already in ParallaxScrollView
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No upcoming flower dates scheduled</ThemedText>
          </ThemedView>
        )}
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
  },
  listContainer: {
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  flowerCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  flowerCardContent: {
    flexDirection: 'row',
    padding: 0,
  },
  personImage: {
    width: 80,
    height: 100,
  },
  flowerInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  occasionContainer: {
    backgroundColor: '#F8C8DC', // Light pink
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  occasionText: {
    fontSize: 12,
    color: '#803D52', // Darker pink
  },
  dateText: {
    fontSize: 14,
    color: '#343A40',
  },
  daysText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4BB675',
    marginTop: 4,
  },
  urgentText: {
    color: '#DC3545',
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
