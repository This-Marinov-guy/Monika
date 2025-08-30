import { Card } from '@/components/Card';
import DefaultProfileImage from '@/components/DefaultProfileImage';
import { EnhancedButton } from '@/components/EnhancedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

// Sample data
const SAMPLE_PEOPLE = [
  {
    id: '1',
    name: 'Emma Johnson',
    label: 'Girlfriend',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Books', 'Travel', 'Coffee', 'Photography', 'Hiking'],
    importantDates: [
      { id: '1', type: 'birthday', date: '1995-05-12' },
      { id: '2', type: 'anniversary', date: '2020-10-15' }
    ],
    giftIdeas: [
      { id: '1', name: 'Camera Lens', description: 'Wide angle lens for her DSLR', price: 249.99, occasion: 'Birthday', isAiSuggested: false, isPurchased: false },
      { id: '2', name: 'Coffee Subscription', description: 'Monthly specialty coffee delivery', price: 89.99, occasion: 'Anniversary', isAiSuggested: true, isPurchased: false },
      { id: '3', name: 'Hiking Boots', description: 'Waterproof boots for our trips', price: 179.99, occasion: 'Christmas', isAiSuggested: true, isPurchased: true }
    ],
    flowerSchedule: {
      enableWomensDay: true,
      enableValentinesDay: true,
      enableBirthday: true,
      enableAnniversary: true,
      randomDates: 2,
      reminderDays: [1, 7]
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    label: 'Best Friend',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gaming', 'Movies', 'Tech', 'Cooking'],
    importantDates: [
      { id: '3', type: 'birthday', date: '1992-08-24' }
    ],
    giftIdeas: [
      { id: '4', name: 'Gaming Headset', description: 'Noise cancelling with surround sound', price: 129.99, occasion: 'Birthday', isAiSuggested: false, isPurchased: false },
      { id: '5', name: 'Cooking Class', description: 'Italian cuisine masterclass', price: 75, occasion: 'Christmas', isAiSuggested: true, isPurchased: false }
    ]
  },
  {
    id: '3',
    name: 'Sarah Williams',
    label: 'Mom',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gardening', 'Cooking', 'Reading'],
    importantDates: [
      { id: '6', type: 'birthday', date: '1965-03-18' }
    ],
    giftIdeas: [
      { id: '7', name: 'Gardening Set', description: 'Premium tools with carrying case', price: 89.99, occasion: 'Birthday', isAiSuggested: false, isPurchased: false },
      { id: '8', name: 'Cookbook Collection', description: 'Set of international cuisine books', price: 65, occasion: 'Christmas', isAiSuggested: true, isPurchased: true }
    ],
    flowerSchedule: {
      enableWomensDay: true,
      enableValentinesDay: false,
      enableBirthday: true,
      enableAnniversary: false,
      randomDates: 1,
      reminderDays: [1, 3]
    }
  },
  {
    id: '4',
    name: 'David Thompson',
    label: 'Dad',
    image: 'https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Golf', 'History', 'Whiskey'],
    importantDates: [
      { id: '9', type: 'birthday', date: '1962-09-05' }
    ],
    giftIdeas: [
      { id: '10', name: 'Golf Club Set', description: 'Professional irons', price: 499.99, occasion: 'Birthday', isAiSuggested: false, isPurchased: false },
      { id: '11', name: 'Whiskey Tasting Kit', description: 'Premium scotch sampler', price: 120, occasion: 'Father\'s Day', isAiSuggested: true, isPurchased: false }
    ]
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState(SAMPLE_PEOPLE.find(p => p.id === id));
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate days until date
  const daysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    
    // Set target date to this year
    targetDate.setFullYear(today.getFullYear());
    
    // If the date has already passed this year, set to next year
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Animations for the header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  if (!person) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Person not found</ThemedText>
      </ThemedView>
    );
  }
  
  const renderHeaderImage = () => {
    if (person.image) {
      return (
        <Animated.Image
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]}
          source={{ uri: person.image }}
        />
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            },
          ]}
        >
          <DefaultProfileImage size={SCREEN_WIDTH} name={person.name} />
        </Animated.View>
      );
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
        {/* Animated Header */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          {renderHeaderImage()}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
          
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText type="h4" color="neutral.white">←</ThemedText>
          </TouchableOpacity>
          
          {/* Header Content */}
          <Animated.View 
            style={[
              styles.headerContent,
              {
                opacity: imageOpacity,
              },
            ]}
          >
            <ThemedText type="h1" color="neutral.white" style={styles.personName}>
              {person.name}
            </ThemedText>
            <View style={styles.labelContainer}>
              <ThemedText type="body1" color="neutral.white" style={styles.personLabel}>
                {person.label}
              </ThemedText>
            </View>
          </Animated.View>
          
          {/* Compact Header Title (visible on scroll) */}
          <Animated.View 
            style={[
              styles.headerTitle,
              {
                opacity: headerTitleOpacity,
              },
            ]}
          >
            <ThemedText type="h4" color="neutral.white">
              {person.name}
            </ThemedText>
          </Animated.View>
        </Animated.View>
        
        {/* Content */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollViewContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {/* Preferences Section */}
          <Card variant="default" style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle} color="primary.base">
              Preferences
            </ThemedText>
            <View style={styles.preferencesContainer}>
              {person.preferences?.map((preference, index) => (
                <View key={index} style={styles.preferenceTag}>
                  <ThemedText type="body2" color="neutral.charcoal">
                    {preference}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>
          
          {/* Important Dates Section */}
          <Card variant="default" style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="h4" style={styles.sectionTitle} color="primary.base">
                Important Dates
              </ThemedText>
              <EnhancedButton
                title="Add"
                variant="outline"
                size="sm"
                onPress={() => router.push(`/add-date?personId=${person.id}`)}
                style={styles.addButton}
              />
            </View>
            
            {person.importantDates && person.importantDates.length > 0 ? (
              person.importantDates.map((date) => (
                <Card key={date.id} variant="subtle" style={styles.dateCard}>
                  <View style={styles.dateCardContent}>
                    <View>
                      <ThemedText type="h6" color="neutral.charcoal">
                        {date.type.charAt(0).toUpperCase() + date.type.slice(1)}
                      </ThemedText>
                      <ThemedText type="body2" color="neutral.darkGrey">
                        {formatDate(date.date)}
                      </ThemedText>
                    </View>
                    <View style={styles.daysContainer}>
                      <ThemedText type="h4" color={daysUntil(date.date) <= 30 ? "primary.base" : "neutral.charcoal"}>
                        {daysUntil(date.date)}
                      </ThemedText>
                      <ThemedText type="caption" color="neutral.darkGrey">
                        days
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.emptyText}>
                No important dates added yet
              </ThemedText>
            )}
          </Card>
          
          {/* Gift Ideas Section */}
          <Card variant="default" style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="h4" style={styles.sectionTitle} color="primary.base">
                Gift Ideas
              </ThemedText>
              <View style={styles.giftButtonsContainer}>
                <EnhancedButton
                  title="AI Suggest"
                  variant="gradient"
                  size="sm"
                  onPress={() => router.push(`/ai-gift-suggestions?personId=${person.id}`)}
                  style={styles.aiButton}
                  gradientColors={[theme.colors.secondary.dark, theme.colors.secondary.base]}
                />
                <EnhancedButton
                  title="Add"
                  variant="outline"
                  size="sm"
                  onPress={() => router.push(`/add-gift?personId=${person.id}`)}
                  style={styles.addButton}
                />
              </View>
            </View>
            
            {person.giftIdeas && person.giftIdeas.length > 0 ? (
              <FlatList
                data={person.giftIdeas}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.giftListContainer}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Card 
                    variant={item.isAiSuggested ? "gradient" : (item.isPurchased ? "subtle" : "elevated")}
                    style={styles.giftCard}
                    gradientColors={item.isAiSuggested ? [theme.colors.secondary.dark, theme.colors.secondary.base] : undefined}
                    onPress={() => router.push(`/gift-detail?id=${item.id}&personId=${person.id}`)}
                  >
                    <View style={styles.giftCardContent}>
                      <ThemedText 
                        type="h6" 
                        color={item.isAiSuggested ? "neutral.white" : "neutral.charcoal"}
                        numberOfLines={1}
                      >
                        {item.name}
                      </ThemedText>
                      
                      <ThemedText 
                        type="caption" 
                        color={item.isAiSuggested ? "neutral.lightGrey" : "neutral.darkGrey"}
                        style={styles.giftOccasion}
                        numberOfLines={1}
                      >
                        For: {item.occasion}
                      </ThemedText>
                      
                      <ThemedText 
                        type="body1" 
                        color={item.isAiSuggested ? "neutral.white" : "primary.base"}
                        style={styles.giftPrice}
                      >
                        ${item.price?.toFixed(2)}
                      </ThemedText>
                      
                      {item.isPurchased && (
                        <View style={styles.purchasedBadge}>
                          <ThemedText type="caption" color="neutral.white">
                            Purchased
                          </ThemedText>
                        </View>
                      )}
                      
                      {item.isAiSuggested && !item.isPurchased && (
                        <View style={styles.aiBadge}>
                          <ThemedText type="caption" color="neutral.white">
                            AI Suggested
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </Card>
                )}
              />
            ) : (
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.emptyText}>
                No gift ideas added yet
              </ThemedText>
            )}
          </Card>
          
          {/* Flower Schedule Section */}
          {person.flowerSchedule && (
            <Card variant="default" style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="h4" style={styles.sectionTitle} color="primary.base">
                  Flower Schedule
                </ThemedText>
                <EnhancedButton
                  title="Edit"
                  variant="outline"
                  size="sm"
                  onPress={() => router.push(`/flower-settings/${person.id}`)}
                  style={styles.addButton}
                />
              </View>
              
              <View style={styles.flowerScheduleContainer}>
                {person.flowerSchedule.enableBirthday && (
                  <View style={styles.flowerItem}>
                    <View style={[styles.flowerDot, { backgroundColor: theme.colors.primary.base }]} />
                    <ThemedText type="body2" color="neutral.charcoal">Birthday</ThemedText>
                  </View>
                )}
                
                {person.flowerSchedule.enableAnniversary && (
                  <View style={styles.flowerItem}>
                    <View style={[styles.flowerDot, { backgroundColor: theme.colors.primary.base }]} />
                    <ThemedText type="body2" color="neutral.charcoal">Anniversary</ThemedText>
                  </View>
                )}
                
                {person.flowerSchedule.enableValentinesDay && (
                  <View style={styles.flowerItem}>
                    <View style={[styles.flowerDot, { backgroundColor: theme.colors.primary.base }]} />
                    <ThemedText type="body2" color="neutral.charcoal">Valentine's Day</ThemedText>
                  </View>
                )}
                
                {person.flowerSchedule.enableWomensDay && (
                  <View style={styles.flowerItem}>
                    <View style={[styles.flowerDot, { backgroundColor: theme.colors.primary.base }]} />
                    <ThemedText type="body2" color="neutral.charcoal">Women's Day</ThemedText>
                  </View>
                )}
                
                {person.flowerSchedule.randomDates > 0 && (
                  <View style={styles.flowerItem}>
                    <View style={[styles.flowerDot, { backgroundColor: theme.colors.secondary.base }]} />
                    <ThemedText type="body2" color="neutral.charcoal">
                      {person.flowerSchedule.randomDates} random {person.flowerSchedule.randomDates === 1 ? 'date' : 'dates'} per month
                    </ThemedText>
                  </View>
                )}
              </View>
            </Card>
          )}
          
          {/* Bottom padding for scrolling */}
          <View style={styles.bottomPadding} />
        </Animated.ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
  },
  headerTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  personName: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  labelContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  personLabel: {
    fontWeight: '500',
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  addButton: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: theme.colors.neutral.lightGrey,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  dateCard: {
    marginBottom: theme.spacing.sm,
  },
  dateCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysContainer: {
    alignItems: 'center',
  },
  giftButtonsContainer: {
    flexDirection: 'row',
  },
  aiButton: {
    height: 36,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  giftListContainer: {
    paddingBottom: theme.spacing.sm,
  },
  giftCard: {
    width: 180,
    marginRight: theme.spacing.md,
    height: 130,
  },
  giftCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  giftOccasion: {
    marginTop: theme.spacing.xxs,
  },
  giftPrice: {
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  purchasedBadge: {
    position: 'absolute',
    top: -theme.spacing.xxs,
    right: -theme.spacing.xxs,
    backgroundColor: theme.colors.primary.base,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.xs,
  },
  aiBadge: {
    position: 'absolute',
    top: -theme.spacing.xxs,
    right: -theme.spacing.xxs,
    backgroundColor: theme.colors.secondary.base,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.xs,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  flowerScheduleContainer: {
    marginTop: theme.spacing.sm,
  },
  flowerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  flowerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  bottomPadding: {
    height: 100,
  },
});