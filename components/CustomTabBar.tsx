import React, { useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { User, Home, Dumbbell, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../hooks/theme-context';

const AnimatedView = Animated.createAnimatedComponent(View);

interface TabItem {
  route: string;
  icon: LucideIcon;
  label: string;
}

const tabs: TabItem[] = [
    { route: 'courses-list', icon: Dumbbell, label: 'دوره‌ها' },
    { route: 'index', icon: Home, label: 'خانه' },
    { route: 'myaccount', icon: User, label: 'حساب کاربری' },
];

// Helper to match route names (handles both 'myaccount' and 'myaccount/index')
function matchesRoute(tabRoute: string, routeName: string): boolean {
  if (tabRoute === routeName) return true;
  // Handle nested routes like 'myaccount/index' matching 'myaccount'
  if (tabRoute === 'myaccount' && routeName.startsWith('myaccount')) return true;
  // Handle courses-list route
  if (tabRoute === 'courses-list' && (routeName === 'courses-list' || routeName.startsWith('courses-list'))) return true;
  return false;
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  // Colors matching Next.js design
  const backgroundColor = isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(248, 250, 252, 0.8)'; // bg-[#18181B]/80 or bg-[#F8FAFC]/80
  const borderColor = isDark ? '#3F3F46' : '#E4E4E7'; // dark:border-zinc-700 or border-gray-200
  const primaryColor = '#8B5CF6'; // primary purple
  const inactiveTextColor = isDark ? '#9CA3AF' : '#6B7280'; // text-gray-500 dark:text-gray-400

  // Get visible tab routes - show all routes that match our tab definitions
  // Order them according to our tabs array order
  const routesToShow = tabs
    .map((tab) => state.routes.find((route) => matchesRoute(tab.route, route.name)))
    .filter((route): route is typeof state.routes[0] => route !== undefined);
  
  // Fallback: if no matches, show all routes (for debugging)
  const finalRoutesToShow = routesToShow.length > 0 ? routesToShow : state.routes;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom-10,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          width: '50%',
          maxWidth: 400, // max-w-sm equivalent
          borderRadius: 9999, // rounded-full
          borderTopWidth: 1,
          borderTopColor: borderColor,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 12,
          overflow: 'visible', // Allow circle to overflow when animating up
        }}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 0 : 0} // Backdrop blur works better on iOS
          tint={isDark ? 'dark' : 'light'}
          style={{
            backgroundColor: backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            paddingTop: 4, // Extra padding at top for circle animation
            paddingBottom: 4,
            paddingHorizontal: 4,
            minHeight: 50,
            borderRadius: 9999, // rounded-full for BlurView
            overflow: 'visible', // Allow circle to overflow
          }}
        >
          {finalRoutesToShow.map((route) => {
            const isFocused = state.index === state.routes.findIndex((r) => r.key === route.key);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // Match route name (handles nested routes)
            const tabItem = tabs.find((tab) => matchesRoute(tab.route, route.name));

            if (!tabItem) return null;

            const IconComponent = tabItem.icon;

            return (
              <TabButton
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                primaryColor={primaryColor}
                inactiveTextColor={inactiveTextColor}
              >
                <IconComponent />
              </TabButton>
            );
          }).filter(Boolean)}
        </BlurView>
      </View>
    </View>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  primaryColor: string;
  inactiveTextColor: string;
}

function TabButton({
  children,
  onPress,
  onLongPress,
  isFocused,
  primaryColor,
  inactiveTextColor,
}: TabButtonProps) {
  // Animation values
  const circleScale = useSharedValue(isFocused ? 1 : 0);
  const circleTranslateY = useSharedValue(isFocused ? -16 : 0); // -translate-y-4 = -16px
  const circleOpacity = useSharedValue(isFocused ? 1 : 0);
  const iconSize = useSharedValue(isFocused ? 28 : 24); // h-7 w-7 = 28px, h-6 w-6 = 24px
  const iconTranslateY = useSharedValue(isFocused ? -16 : 0); // -translate-y-4 = -16px
  const iconColor = useSharedValue(isFocused ? 1 : 0); // 1 = white, 0 = gray

  useEffect(() => {
    const duration = 300; // duration-300 = 300ms
    
    circleScale.value = withTiming(isFocused ? 1 : 0, { duration });
    circleTranslateY.value = withTiming(isFocused ? -16 : 0, { duration });
    circleOpacity.value = withTiming(isFocused ? 1 : 0, { duration });
    iconSize.value = withTiming(isFocused ? 28 : 24, { duration });
    iconTranslateY.value = withTiming(isFocused ? -16 : 0, { duration });
    iconColor.value = withTiming(isFocused ? 1 : 0, { duration });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Animated circle background
  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: circleTranslateY.value },
        { scale: circleScale.value },
      ],
      opacity: circleOpacity.value,
    };
  });

  // Animated icon
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: iconTranslateY.value }],
    };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    return {
      width: iconSize.value,
      height: iconSize.value,
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated circular background */}
        <AnimatedView
          style={[
            {
              position: 'absolute',
              width: 48, // h-12 w-12 = 48px
              height: 48,
              borderRadius: 24,
              backgroundColor: primaryColor,
              shadowColor: primaryColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
            circleStyle,
          ]}
        />
        
        {/* Animated icon */}
        <AnimatedView
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            },
            iconStyle,
          ]}
        >
          <AnimatedView
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
              },
              iconContainerStyle,
            ]}
          >
            {React.cloneElement(children as React.ReactElement, {
              size: iconSize.value,
              color: isFocused ? '#FFFFFF' : inactiveTextColor,
            } as any)}
          </AnimatedView>
        </AnimatedView>
      </View>
    </TouchableOpacity>
  );
}
