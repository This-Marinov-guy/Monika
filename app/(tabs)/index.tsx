import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/Card';
import { EnhancedButton } from '@/components/EnhancedButton';
import { PersonCard } from '@/components/PersonCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';

// Sample data
const SAMPLE_PEOPLE = [
  {
    id: '1',
    name: 'Emma Johnson',
    label: 'Girlfriend',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Books', 'Travel', 'Coffee', 'Photography', 'Hiking'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    label: 'Best Friend',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gaming', 'Movies', 'Tech', 'Cooking'],
  },
  {
    id: '3',
    name: 'Sarah Williams',
    label: 'Mom',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Gardening', 'Cooking', 'Reading'],
  },
  {
    id: '4',
    name: 'David Thompson',
    label: 'Dad',
    image: 'https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    preferences: ['Golf', 'History', 'Whiskey'],
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const [people, setPeople] = useState(SAMPLE_PEOPLE);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleSwipeLeft = (id: string) => {
    setCurrentIndex(currentIndex + 1);
  };
  
  const handleSwipeRight = (id: string) => {
    setCurrentIndex(currentIndex + 1);
  };
  
  const handleViewDetails = (id: string) => {
    router.push(`/person/${id}`);
  };
  
  const renderCards = () => {
    if (currentIndex >= people.length) {
      return (
        <Card variant="elevated" style={styles.noMoreCardsCard}>
          <ThemedText type="h4" color="neutral.charcoal" style={styles.noMoreCardsText}>
            No more people to show
          </ThemedText>
          <ThemedText type="body1" color="neutral.darkGrey" style={styles.noMoreCardsSubtext}>
            Add more people to your catalog
          </ThemedText>
          <EnhancedButton
            title="Add Person"
            variant="gradient"
            onPress={() => router.push('/add-person')}
            style={styles.addButton}
          />
        </Card>
      );
    }
    
    return people
      .map((person, i) => {
        if (i < currentIndex) return null;
        
        if (i === currentIndex) {
          return (
            <PersonCard
              key={person.id}
              person={person}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onViewDetails={handleViewDetails}
            />
          );
        }
        
        // Next card in stack (shown behind current)
        if (i === currentIndex + 1) {
          return (
            <Animated.View
              key={person.id}
              style={[styles.nextCardContainer]}
            >
              <PersonCard
                person={person}
                onViewDetails={handleViewDetails}
              />
            </Animated.View>
          );
        }
        
        return null;
      })
      .reverse();
  };
  
  return (
    <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary.base, theme.colors.secondary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <ThemedText type="h2" color="neutral.white" style={styles.headerTitle}>
          People
        </ThemedText>
        <TouchableOpacity 
          style={styles.addPersonButton}
          onPress={() => router.push('/add-person')}
        >
          <ThemedText type="h3" color="neutral.white">+</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {renderCards()}
      </View>
      
      {/* Bottom Action Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={() => handleSwipeLeft(people[currentIndex].id)}
          >
            <ThemedText type="h2" color="error">×</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleSwipeRight(people[currentIndex].id)}
          >
            <ThemedText type="h2" color="primary.base">♥</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Recent People */}
        <View style={styles.recentContainer}>
          <ThemedText type="h6" color="neutral.darkGrey" style={styles.recentTitle}>
            Recent
          </ThemedText>
          <FlatList
            data={people.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.recentPersonContainer}
                onPress={() => router.push(`/person/${item.id}`)}
              >
                <View style={styles.recentPersonImageContainer}>
                  {item.image ? (
                    <View style={styles.recentPersonImage}>
                      <ThemedText type="body2" color="neutral.white">
                        {item.name.charAt(0)}
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.recentPersonImage}>
                      <ThemedText type="body2" color="neutral.white">
                        {item.name.charAt(0)}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText type="caption" color="neutral.charcoal" style={styles.recentPersonName}>
                  {item.name.split(' ')[0]}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 120,
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  addPersonButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, // Overlap with header
  },
  nextCardContainer: {
    position: 'absolute',
    top: 8,
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  bottomContainer: {
    paddingBottom: 30,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: theme.spacing.md,
  },
  likeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.primary.base,
  },
  dislikeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  recentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  recentTitle: {
    marginBottom: theme.spacing.sm,
  },
  recentPersonContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  recentPersonImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: theme.spacing.xxs,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPersonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPersonName: {
    textAlign: 'center',
  },
  noMoreCardsCard: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH * 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    marginBottom: theme.spacing.sm,
  },
  noMoreCardsSubtext: {
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    marginTop: theme.spacing.md,
  },
});