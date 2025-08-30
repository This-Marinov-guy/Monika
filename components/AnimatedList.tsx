import { theme } from '@/constants/Theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    FlatList,
    FlatListProps,
    ListRenderItem,
    StyleSheet,
    ViewStyle
} from 'react-native';

type AnimatedListProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  horizontal?: boolean;
  delay?: number;
  itemSpacing?: number;
  animationDirection?: 'up' | 'down' | 'left' | 'right';
} & Omit<FlatListProps<T>, 'renderItem' | 'data' | 'keyExtractor'>;

export function AnimatedList<T>({ 
  data, 
  renderItem, 
  keyExtractor,
  style,
  contentContainerStyle,
  horizontal = false,
  delay = 50,
  itemSpacing = theme.spacing.md,
  animationDirection = 'up',
  ...rest
}: AnimatedListProps<T>) {
  // Animation values for each item
  const animatedValues = useRef<Animated.Value[]>([]);
  
  // Initialize animation values if needed
  useEffect(() => {
    if (animatedValues.current.length !== data.length) {
      animatedValues.current = data.map(() => new Animated.Value(0));
    }
  }, [data]);
  
  // Run entrance animations
  useEffect(() => {
    const animations = animatedValues.current.map((value, index) => {
      return Animated.timing(value, {
        toValue: 1,
        duration: 300,
        delay: index * delay,
        useNativeDriver: true,
      });
    });
    
    Animated.stagger(delay, animations).start();
  }, [data, delay]);
  
  // Get transform based on animation direction
  const getTransform = (animValue: Animated.Value) => {
    const distance = 50;
    
    switch (animationDirection) {
      case 'up':
        return [{
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [distance, 0],
          })
        }];
      case 'down':
        return [{
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-distance, 0],
          })
        }];
      case 'left':
        return [{
          translateX: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [distance, 0],
          })
        }];
      case 'right':
        return [{
          translateX: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-distance, 0],
          })
        }];
    }
  };
  
  // Wrap the renderItem function to add animations
  const animatedRenderItem: ListRenderItem<T> = ({ item, index, ...rest }) => {
    const animValue = animatedValues.current[index] || new Animated.Value(1);
    
    return (
      <Animated.View
        style={[
          horizontal ? styles.horizontalItem : styles.verticalItem,
          {
            marginRight: horizontal ? itemSpacing : 0,
            marginBottom: horizontal ? 0 : itemSpacing,
            opacity: animValue,
            transform: getTransform(animValue),
          },
        ]}
      >
        {renderItem({ item, index, ...rest })}
      </Animated.View>
    );
  };
  
  return (
    <FlatList
      data={data}
      renderItem={animatedRenderItem}
      keyExtractor={keyExtractor}
      style={[styles.list, style]}
      contentContainerStyle={[
        horizontal ? styles.horizontalContent : styles.verticalContent,
        contentContainerStyle,
      ]}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  horizontalContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  verticalContent: {
    padding: theme.spacing.md,
  },
  horizontalItem: {
    // No specific styles needed
  },
  verticalItem: {
    width: '100%',
  },
});
