import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { User, Home, Dumbbell, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../hooks/theme-context';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  const containerWidth = useSharedValue(0);

  const isDark = theme === 'dark';

  // Clean, minimal dark mode design
  const backgroundColor = isDark ? '#1A1A1A' : '#404040';
  const borderColor = isDark ? '#2A2A2A' : '#2e2d2d';
  const activeColor = isDark ? '#8B5CF6' : '#8B5CF6';
  const inactiveColor = isDark ? '#71717A' : '#71717A';
  const activeBackgroundColor = isDark ? '#27272A' : '#343436';


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
        bottom: insets.bottom+10,
        left: 16,
        right: 16,
        alignItems: 'center',
      }}
    >
       <View
         onLayout={(e) => {
           containerWidth.value = e.nativeEvent.layout.width;
         }}
         style={{
           flexDirection: 'row',
           backgroundColor,
           borderRadius: 20,
           paddingVertical: 10,
           paddingHorizontal: 10,
           minHeight: 60,
           width: '60%',
           borderWidth: isDark ? 0 : 1,
           borderColor,
           
           boxShadow: isDark ? '0 0 20px 0 rgba(255, 255, 255, 0.15)' : '0 0 30px 0 rgba(0, 0, 0, 0.6)',
           
           gap: 8,
         }}
       >

      {finalRoutesToShow.map((route, index) => {
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
          const iconColor = isFocused ? activeColor : inactiveColor;

          return (
            <TabButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              iconColor={iconColor}
              activeColor={activeColor}
              activeBackgroundColor={activeBackgroundColor}
              isDark={isDark}
            >
              <IconComponent size={24} color={iconColor} />
            </TabButton>
          );
        })
        .filter(Boolean)}
      </View>
    </View>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  iconColor: string;
  activeColor: string;
  activeBackgroundColor: string;
  isDark: boolean;
}

function TabButton({
  children,
  onPress,
  onLongPress,
  isFocused,
  iconColor,
  activeColor,
  activeBackgroundColor,
  isDark,
}: TabButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isFocused ? 1 : 0.6);

  useEffect(() => {
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
  }, [isFocused, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

   const buttonStyle = useAnimatedStyle(() => {
     return {
       backgroundColor: isFocused ? activeBackgroundColor : 'transparent',
       borderRadius: 12,
       paddingVertical: 10,
       paddingHorizontal: 16,
     };
   });

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonStyle,
        animatedStyle,
      ]}
      activeOpacity={1}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
}

