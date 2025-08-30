import { Card } from '@/components/Card';
import DefaultProfileImage from '@/components/DefaultProfileImage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample data
const SAMPLE_PEOPLE = [
  {
    id: '1',
    name: 'Emma Johnson',
    label: 'Girlfriend',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Books', 'Travel', 'Coffee', 'Photography', 'Hiking'],
    upcomingDates: [
      { type: 'birthday', date: '2024-05-12', daysUntil: 45 }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    label: 'Best Friend',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gaming', 'Movies', 'Tech', 'Cooking'],
    upcomingDates: [
      { type: 'birthday', date: '2024-08-24', daysUntil: 149 }
    ]
  },
  {
    id: '3',
    name: 'Sarah Williams',
    label: 'Mom',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gardening', 'Cooking', 'Reading'],
    upcomingDates: [
      { type: 'birthday', date: '2024-03-18', daysUntil: 12 }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    label: 'Dad',
    image: 'https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Golf', 'History', 'Whiskey'],
    upcomingDates: [
      { type: 'birthday', date: '2024-09-05', daysUntil: 183 }
    ]
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    label: 'Sister',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Art', 'Music', 'Fashion', 'Travel'],
    upcomingDates: [
      { type: 'anniversary', date: '2024-06-15', daysUntil: 79 }
    ]
  },
  {
    id: '6',
    name: 'James Wilson',
    label: 'Brother',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Sports', 'Fitness', 'Cars', 'Technology'],
    upcomingDates: [
      { type: 'birthday', date: '2024-11-08', daysUntil: 245 }
    ]
  }
];

const UPCOMING_DATES = [
  { personId: '3', personName: 'Sarah Williams', type: 'birthday', date: '2024-03-18', daysUntil: 12 },
  { personId: '1', personName: 'Emma Johnson', type: 'birthday', date: '2024-05-12', daysUntil: 45 },
  { personId: '5', personName: 'Lisa Rodriguez', type: 'anniversary', date: '2024-06-15', daysUntil: 79 },
];

export default function HomeScreen() {
  const [people] = useState(SAMPLE_PEOPLE);
  const [upcomingDates] = useState(UPCOMING_DATES);
  
  const handleViewPerson = (id: string) => {
    router.push(`/person/${id}`);
  };
  
  const handleAddPerson = () => {
    router.push('/add-person');
  };
  
  const renderPersonCard = ({ item }: { item: typeof SAMPLE_PEOPLE[0] }) => {
    const nextDate = item.upcomingDates?.[0];
    
    return (
      <TouchableOpacity 
        style={styles.personCardContainer}
        onPress={() => handleViewPerson(item.id)}
        activeOpacity={0.9}
      >
        <Card variant="elevated" style={styles.personCard}>
          <View style={styles.cardHeader}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.personImage} />
            ) : (
              <DefaultProfileImage size={80} name={item.name} />
            )}
            <View style={styles.personInfo}>
              <ThemedText type="h5" color="neutral.charcoal" style={styles.personName}>
                {item.name}
              </ThemedText>
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.personLabel}>
                {item.label}
              </ThemedText>
              {nextDate && (
                <View style={styles.dateBadge}>
                  <ThemedText type="caption" color="primary.base">
                    {nextDate.type.charAt(0).toUpperCase() + nextDate.type.slice(1)} in {nextDate.daysUntil} days
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.preferencesContainer}>
            {item.preferences?.slice(0, 3).map((pref, index) => (
              <View key={index} style={styles.preferenceTag}>
                <ThemedText type="caption" color="neutral.charcoal">
                  {pref}
                </ThemedText>
              </View>
            ))}
            {item.preferences && item.preferences.length > 3 && (
              <ThemedText type="caption" color="neutral.darkGrey">
                +{item.preferences.length - 3} more
              </ThemedText>
            )}
          </View>
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/add-gift?personId=${item.id}`)}
            >
              <Ionicons name="gift-outline" size={16} color={theme.colors.primary.base} />
              <ThemedText type="caption" color="primary.base" style={styles.actionText}>
                Add Gift
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push(`/add-date?personId=${item.id}`)}
            >
              <Ionicons name="calendar-outline" size={16} color={theme.colors.secondary.base} />
              <ThemedText type="caption" color="secondary.base" style={styles.actionText}>
                Add Date
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const renderUpcomingDate = ({ item }: { item: typeof UPCOMING_DATES[0] }) => (
    <TouchableOpacity 
      style={styles.upcomingDateCard}
      onPress={() => handleViewPerson(item.personId)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.primary.light, theme.colors.primary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.dateGradient}
      >
        <View style={styles.dateContent}>
          <View style={styles.dateInfo}>
            <ThemedText type="h6" color="neutral.white">
              {item.personName}
            </ThemedText>
            <ThemedText type="body2" color="neutral.lightGrey">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </ThemedText>
          </View>
          <View style={styles.dateCountdown}>
            <ThemedText type="h4" color="neutral.white">
              {item.daysUntil}
            </ThemedText>
            <ThemedText type="caption" color="neutral.lightGrey">
              days
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  return (
    <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary.base, theme.colors.secondary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText type="h1" color="neutral.white" style={styles.headerTitle}>
              People
            </ThemedText>
            <ThemedText type="body1" color="neutral.lightGrey" style={styles.headerSubtitle}>
              Manage your relationships and gift-giving
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.addPersonButton}
            onPress={handleAddPerson}
          >
            <Ionicons name="add" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Upcoming Dates Section */}
      {upcomingDates.length > 0 && (
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" color="neutral.charcoal">
              Upcoming Dates
            </ThemedText>
            <TouchableOpacity>
              <ThemedText type="body2" color="primary.base">
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingDates}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderUpcomingDate}
            keyExtractor={(item) => item.personId}
            contentContainerStyle={styles.upcomingList}
          />
        </View>
      )}
      
      {/* People Grid */}
      <View style={styles.peopleSection}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4" color="neutral.charcoal">
            Your People
          </ThemedText>
          <ThemedText type="body2" color="neutral.darkGrey">
            {people.length} people
          </ThemedText>
        </View>
        
        <FlatList
          data={people}
          renderItem={renderPersonCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.peopleList}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  headerSubtitle: {
    opacity: 0.9,
  },
  addPersonButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  upcomingList: {
    paddingBottom: theme.spacing.sm,
  },
  upcomingDateCard: {
    width: 200,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  dateGradient: {
    padding: theme.spacing.md,
  },
  dateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  dateCountdown: {
    alignItems: 'center',
  },
  peopleSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  peopleList: {
    paddingBottom: theme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  personCardContainer: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  personCard: {
    height: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  personImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.sm,
  },
  personInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  personName: {
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  personLabel: {
    marginBottom: theme.spacing.xxs,
  },
  dateBadge: {
    backgroundColor: theme.colors.primary.lighter,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  preferenceTag: {
    backgroundColor: theme.colors.neutral.lightGrey,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xxs,
    marginBottom: theme.spacing.xxs,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.xs,
    backgroundColor: theme.colors.neutral.offWhite,
  },
  actionText: {
    marginLeft: theme.spacing.xxs,
    fontWeight: '500',
  },
});