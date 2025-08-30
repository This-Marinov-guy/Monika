import { theme } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Card } from './Card';
import DefaultProfileImage from './DefaultProfileImage';
import { EnhancedButton } from './EnhancedButton';
import { ThemedText } from './ThemedText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type PersonCardProps = {
  person: {
    id: string;
    name: string;
    label: string;
    image?: string;
    preferences?: string[];
  };
  onSwipeLeft?: (id: string) => void;
  onSwipeRight?: (id: string) => void;
  onViewDetails?: (id: string) => void;
};

export function PersonCard({ 
  person, 
  onSwipeLeft, 
  onSwipeRight,
  onViewDetails
}: PersonCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp'
  });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipeRight(gesture.dy);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipeLeft(gesture.dy);
        } else {
          resetPosition();
        }
      }
    })
  ).current;
  
  const forceSwipeRight = (dy: number) => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: dy },
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      onSwipeRight && onSwipeRight(person.id);
    });
  };
  
  const forceSwipeLeft = (dy: number) => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: dy },
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      onSwipeLeft && onSwipeLeft(person.id);
    });
  };
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true
    }).start();
  };
  
  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate }
    ]
  };
  
  return (
    <Animated.View 
      style={[styles.container, cardStyle]} 
      {...panResponder.panHandlers}
    >
      <Card variant="profile" style={styles.card}>
        {person.image ? (
          <Image source={{ uri: person.image }} style={styles.image} />
        ) : (
          <DefaultProfileImage size={SCREEN_WIDTH - 32} name={person.name} />
        )}
        
        {/* Gradient overlay at the bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.infoContainer}>
            <ThemedText type="h2" color="neutral.white" style={styles.name}>
              {person.name}
            </ThemedText>
            <ThemedText type="body1" color="neutral.lightGrey" style={styles.label}>
              {person.label}
            </ThemedText>
            
            {/* Preferences tags */}
            {person.preferences && person.preferences.length > 0 && (
              <View style={styles.preferencesContainer}>
                {person.preferences.slice(0, 3).map((pref, index) => (
                  <View key={index} style={styles.preferenceTag}>
                    <ThemedText type="caption" color="neutral.white">
                      {pref}
                    </ThemedText>
                  </View>
                ))}
                {person.preferences.length > 3 && (
                  <ThemedText type="caption" color="neutral.lightGrey">
                    +{person.preferences.length - 3} more
                  </ThemedText>
                )}
              </View>
            )}
          </View>
        </LinearGradient>
        
        {/* View details button */}
        <View style={styles.detailsButtonContainer}>
          <EnhancedButton
            title="View"
            variant="action"
            onPress={() => onViewDetails && onViewDetails(person.id)}
            rightIcon={<Text style={styles.buttonIcon}>→</Text>}
          />
        </View>
        
        {/* Like and dislike indicators */}
        <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
          <ThemedText type="h3" color="primary.base" style={styles.likeText}>
            LIKE
          </ThemedText>
        </Animated.View>
        
        <Animated.View style={[styles.dislikeContainer, { opacity: dislikeOpacity }]}>
          <ThemedText type="h3" color="error" style={styles.dislikeText}>
            NOPE
          </ThemedText>
        </Animated.View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  card: {
    height: SCREEN_WIDTH * 1.4,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
  infoContainer: {
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: 32,
    marginBottom: theme.spacing.xxs,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  preferenceTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  detailsButtonContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 18,
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    transform: [{ rotate: '15deg' }],
    borderWidth: 3,
    borderColor: theme.colors.primary.base,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.xs,
  },
  dislikeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 3,
    borderColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.xs,
  },
  likeText: {
    fontWeight: '800',
  },
  dislikeText: {
    fontWeight: '800',
  },
});