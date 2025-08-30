import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/constants/Theme';
import { animations, createPressAnimation, springConfig } from '@/utils/animations';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

type GiftCardProps = {
  gift: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    occasion?: string;
    isAiSuggested: boolean;
    isPurchased: boolean;
  };
  onPress: () => void;
  index: number;
  isVisible?: boolean;
};

export function AnimatedGiftCard({ 
  gift, 
  onPress, 
  index = 0,
  isVisible = true
}: GiftCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for press feedback
  const { pressIn, pressOut } = createPressAnimation(scaleAnim);
  
  useEffect(() => {
    if (isVisible) {
      // Staggered entrance animation
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          animations.fadeIn(opacityAnim, {
            duration: 400,
            useNativeDriver: true,
          }),
          animations.slideInUp(translateYAnim, 50, {
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            ...springConfig.default,
          }),
        ]),
      ]).start();
    }
  }, [isVisible, index]);
  
  // Determine card style based on gift properties
  const getCardStyle = () => {
    if (gift.isAiSuggested) {
      return styles.aiCard;
    } else if (gift.isPurchased) {
      return styles.purchasedCard;
    } else {
      return styles.regularCard;
    }
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [
            { translateY: translateYAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <View style={[styles.card, getCardStyle()]}>
          {gift.isAiSuggested ? (
            <LinearGradient
              colors={[theme.colors.secondary.dark, theme.colors.secondary.base]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <CardContent gift={gift} isAiSuggested={true} />
            </LinearGradient>
          ) : (
            <CardContent gift={gift} isAiSuggested={false} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

// Extracted card content component
function CardContent({ gift, isAiSuggested }: { gift: GiftCardProps['gift'], isAiSuggested: boolean }) {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.topRow}>
        <ThemedText 
          type="h5" 
          color={isAiSuggested ? "neutral.white" : "neutral.charcoal"}
          numberOfLines={1}
          style={styles.title}
        >
          {gift.name}
        </ThemedText>
        
        {gift.isPurchased && (
          <View style={styles.purchasedBadge}>
            <ThemedText type="caption" color="neutral.white">
              ✓
            </ThemedText>
          </View>
        )}
        
        {isAiSuggested && !gift.isPurchased && (
          <View style={styles.aiBadge}>
            <ThemedText type="caption" color="neutral.white">
              AI
            </ThemedText>
          </View>
        )}
      </View>
      
      {gift.description && (
        <ThemedText 
          type="body2" 
          color={isAiSuggested ? "neutral.lightGrey" : "neutral.darkGrey"}
          numberOfLines={2}
          style={styles.description}
        >
          {gift.description}
        </ThemedText>
      )}
      
      <View style={styles.bottomRow}>
        {gift.occasion && (
          <View style={[
            styles.occasionTag,
            { backgroundColor: isAiSuggested ? 'rgba(255,255,255,0.2)' : theme.colors.neutral.lightGrey }
          ]}>
            <ThemedText 
              type="caption" 
              color={isAiSuggested ? "neutral.white" : "neutral.charcoal"}
            >
              {gift.occasion}
            </ThemedText>
          </View>
        )}
        
        {gift.price !== undefined && (
          <ThemedText 
            type="h6" 
            color={isAiSuggested ? "neutral.white" : "primary.base"}
          >
            ${gift.price.toFixed(2)}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: theme.spacing.md,
    alignSelf: 'center',
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minHeight: 150,
    overflow: 'hidden',
  },
  regularCard: {
    backgroundColor: theme.colors.neutral.white,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  aiCard: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  purchasedCard: {
    backgroundColor: theme.colors.neutral.offWhite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  description: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  occasionTag: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
  },
  purchasedBadge: {
    backgroundColor: theme.colors.primary.base,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadge: {
    backgroundColor: theme.colors.secondary.dark,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.full,
  },
});
