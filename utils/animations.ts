import { theme } from '@/constants/Theme';
import { Animated, Easing } from 'react-native';

// Spring animation configurations
export const springConfig = {
  default: {
    friction: 7,
    tension: 40,
    useNativeDriver: true,
  },
  gentle: {
    friction: 4,
    tension: 20,
    useNativeDriver: true,
  },
  wobbly: {
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  },
  stiff: {
    friction: 10,
    tension: 100,
    useNativeDriver: true,
  },
};

// Timing animation configurations
export const timingConfig = {
  default: {
    duration: theme.animations.timing.default,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    useNativeDriver: true,
  },
  quick: {
    duration: theme.animations.timing.quick,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    useNativeDriver: true,
  },
  slow: {
    duration: theme.animations.timing.slow,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    useNativeDriver: true,
  },
  accelerate: {
    duration: theme.animations.timing.default,
    easing: Easing.bezier(0.4, 0.0, 1, 1),
    useNativeDriver: true,
  },
  decelerate: {
    duration: theme.animations.timing.default,
    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    useNativeDriver: true,
  },
};

// Animation presets
export const animations = {
  // Fade animations
  fadeIn: (value: Animated.Value, config = timingConfig.default) => {
    return Animated.timing(value, {
      toValue: 1,
      ...config,
    });
  },
  
  fadeOut: (value: Animated.Value, config = timingConfig.default) => {
    return Animated.timing(value, {
      toValue: 0,
      ...config,
    });
  },
  
  // Scale animations
  scaleIn: (value: Animated.Value, config = springConfig.default) => {
    return Animated.spring(value, {
      toValue: 1,
      ...config,
    });
  },
  
  scaleOut: (value: Animated.Value, config = springConfig.default) => {
    return Animated.spring(value, {
      toValue: 0.8,
      ...config,
    });
  },
  
  // Bounce animation
  bounce: (value: Animated.Value, toValue = 1.2, config = springConfig.wobbly) => {
    return Animated.sequence([
      Animated.spring(value, {
        toValue,
        ...config,
      }),
      Animated.spring(value, {
        toValue: 1,
        ...config,
      }),
    ]);
  },
  
  // Pulse animation
  pulse: (value: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 300,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 300,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]);
  },
  
  // Slide animations
  slideInUp: (value: Animated.Value, fromValue = 100, config = timingConfig.default) => {
    value.setValue(fromValue);
    return Animated.timing(value, {
      toValue: 0,
      ...config,
    });
  },
  
  slideInDown: (value: Animated.Value, fromValue = -100, config = timingConfig.default) => {
    value.setValue(fromValue);
    return Animated.timing(value, {
      toValue: 0,
      ...config,
    });
  },
  
  slideInLeft: (value: Animated.Value, fromValue = -100, config = timingConfig.default) => {
    value.setValue(fromValue);
    return Animated.timing(value, {
      toValue: 0,
      ...config,
    });
  },
  
  slideInRight: (value: Animated.Value, fromValue = 100, config = timingConfig.default) => {
    value.setValue(fromValue);
    return Animated.timing(value, {
      toValue: 0,
      ...config,
    });
  },
  
  // Stagger animations
  stagger: (animations: Animated.CompositeAnimation[], delay = 100) => {
    return Animated.stagger(delay, animations);
  },
  
  // Sequence animations
  sequence: (animations: Animated.CompositeAnimation[]) => {
    return Animated.sequence(animations);
  },
  
  // Parallel animations
  parallel: (animations: Animated.CompositeAnimation[]) => {
    return Animated.parallel(animations);
  },
};

// Animation hooks
export function useAnimatedValue(initialValue: number = 0) {
  return new Animated.Value(initialValue);
}

// Interpolation helpers
export function interpolateColor(
  animValue: Animated.Value,
  inputRange: number[],
  outputRange: string[]
) {
  return animValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
}

// Animation utility for button press feedback
export function createPressAnimation(scaleValue: Animated.Value) {
  const pressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      ...springConfig.stiff,
    }).start();
  };
  
  const pressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      ...springConfig.stiff,
    }).start();
  };
  
  return { pressIn, pressOut };
}

// Loop animation
export function createLoopAnimation(
  value: Animated.Value,
  config = {
    min: 0.9,
    max: 1.1,
    duration: 1500,
  }
) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: config.max,
        duration: config.duration / 2,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: config.min,
        duration: config.duration / 2,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ])
  );
}
