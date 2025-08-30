import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Reminder } from '@/models/Reminder';
import { formatDate } from '@/utils/dateUtils';

// Sample reminders for demonstration
const SAMPLE_REMINDERS: Reminder[] = [
  {
    id: '1',
    personId: '1',
    personName: 'Sarah Johnson',
    title: 'Birthday Gift',
    description: 'Buy DSLR Camera',
    date: '2023-05-15', // Update with future date for demo
    type: 'gift',
    isRead: false
  },
  {
    id: '2',
    personId: '1',
    personName: 'Sarah Johnson',
    title: "Valentine's Day Flowers",
    description: 'Remember to get roses',
    date: '2023-02-14', // Update with future date for demo
    type: 'flowers',
    isRead: true
  },
  {
    id: '3',
    personId: '2',
    personName: 'Mom',
    title: 'Birthday Gift',
    description: 'Gardening Kit',
    date: '2023-11-03', // Update with future date for demo
    type: 'gift',
    isRead: false
  },
  {
    id: '4',
    personId: '2',
    personName: 'Mom',
    title: "Women's Day Flowers",
    description: 'Get her favorite tulips',
    date: '2023-03-08', // Update with future date for demo
    type: 'flowers',
    isRead: false
  }
];

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>(SAMPLE_REMINDERS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'gift' | 'flowers'>('all');
  
  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !reminder.isRead;
    return reminder.type === filter;
  });
  
  const markAsRead = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, isRead: true } : reminder
    ));
  };
  
  const navigateToReminderDetail = (reminder: Reminder) => {
    markAsRead(reminder.id);
    
    if (reminder.type === 'gift') {
      router.push({
        pathname: `/gift-detail/${reminder.id}`,
        params: { personId: reminder.personId, fromReminder: true }
      });
    } else {
      router.push({
        pathname: `/flower-detail/${reminder.id}`,
        params: { personId: reminder.personId, fromReminder: true }
      });
    }
  };
  
  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <TouchableOpacity 
      style={[styles.reminderCard, item.isRead ? styles.readCard : null]} 
      onPress={() => navigateToReminderDetail(item)}
    >
      <ThemedView style={styles.reminderCardContent}>
        <ThemedView style={styles.reminderInfo}>
          <ThemedView style={styles.reminderHeader}>
            <ThemedText type="subtitle">{item.title}</ThemedText>
            {!item.isRead && (
              <ThemedView style={styles.unreadBadge} />
            )}
          </ThemedView>
          
          <ThemedText style={styles.personText}>For: {item.personName}</ThemedText>
          
          {item.description && (
            <ThemedText style={styles.descriptionText}>{item.description}</ThemedText>
          )}
          
          <ThemedView style={styles.reminderMeta}>
            <ThemedText style={styles.dateText}>{formatDate(item.date)}</ThemedText>
            <ThemedView 
              style={[
                styles.typeContainer, 
                item.type === 'gift' ? styles.giftTypeContainer : styles.flowersTypeContainer
              ]}
            >
              <ThemedText 
                style={[
                  styles.typeText,
                  item.type === 'gift' ? styles.giftTypeText : styles.flowersTypeText
                ]}
              >
                {item.type === 'gift' ? 'Gift' : 'Flowers'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#CED4DA', dark: '#343A40' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
                 <ThemedView style={styles.header}>
           <ThemedText type="title">Reminders</ThemedText>
           <TouchableOpacity 
             style={styles.settingsButton} 
             onPress={() => router.push('/reminder-settings')}
             accessibilityLabel="Notification Settings"
           >
             <ThemedText style={styles.settingsButtonText}>⚙️</ThemedText>
           </TouchableOpacity>
         </ThemedView>
         
         <TouchableOpacity 
           style={styles.notificationSettingsButton}
           onPress={() => router.push('/reminder-settings')}
         >
           <ThemedText style={styles.notificationSettingsText}>
             Notification Preferences (Push & Calendar)
           </ThemedText>
           <ThemedText style={styles.arrowIcon}>›</ThemedText>
         </TouchableOpacity>
        
        <ThemedView style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' ? styles.filterButtonActive : null]}
            onPress={() => setFilter('all')}
          >
            <ThemedText style={filter === 'all' ? styles.filterTextActive : styles.filterText}>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'unread' ? styles.filterButtonActive : null]}
            onPress={() => setFilter('unread')}
          >
            <ThemedText style={filter === 'unread' ? styles.filterTextActive : styles.filterText}>Unread</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'gift' ? styles.filterButtonActive : null]}
            onPress={() => setFilter('gift')}
          >
            <ThemedText style={filter === 'gift' ? styles.filterTextActive : styles.filterText}>Gifts</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'flowers' ? styles.filterButtonActive : null]}
            onPress={() => setFilter('flowers')}
          >
            <ThemedText style={filter === 'flowers' ? styles.filterTextActive : styles.filterText}>Flowers</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {filteredReminders.length > 0 ? (
          <FlatList
            data={filteredReminders}
            renderItem={renderReminderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false} // Disable scrolling since it's already in ParallaxScrollView
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No reminders found</ThemedText>
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
    marginBottom: 8,
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
  notificationSettingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  notificationSettingsText: {
    fontSize: 14,
    color: '#343A40',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#6C757D',
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
    backgroundColor: '#6C757D',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  reminderCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#17A2B8',
  },
  readCard: {
    opacity: 0.7,
    borderLeftColor: '#CED4DA',
  },
  reminderCardContent: {
    padding: 16,
  },
  reminderInfo: {
    gap: 4,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC3545',
  },
  personText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343A40',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  reminderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6C757D',
  },
  typeContainer: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  giftTypeContainer: {
    backgroundColor: '#8FDC9F',
  },
  flowersTypeContainer: {
    backgroundColor: '#F8C8DC',
  },
  typeText: {
    fontSize: 12,
  },
  giftTypeText: {
    color: '#2A744A',
  },
  flowersTypeText: {
    color: '#803D52',
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
