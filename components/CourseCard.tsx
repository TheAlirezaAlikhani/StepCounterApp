import React from 'react';
import { View, Text, Image, ColorSchemeName } from 'react-native';
import { Heart, Clock, Signal, SignalLow, SignalMedium } from 'lucide-react-native';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  level: string;
  duration: string;
  progress: number | null;
  isFavorite: boolean;
}

interface CourseCardProps {
  course: Course;
  theme: ColorSchemeName;
  onToggleFavorite: (id: number) => void;
}

export function CourseCard({ course, theme, onToggleFavorite }: CourseCardProps) {
  const getLevelIcon = (level: string) => {
    if (level === "آسان") return SignalLow;
    if (level === "متوسط") return SignalMedium;
    return Signal;
  };

  const LevelIcon = getLevelIcon(course.level);

  return (
    <View className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-800/50 p-4">
      {course.progress !== null ? (
        // Course with progress
        <View>
          <View className="flex-row gap-4">
            <View className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden">
              <Image
                source={{ uri: course.image }}
                className="h-28 w-28"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-between">
              <View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="font-bold text-lg" style={{ color: theme === 'dark' ? '#e5e7eb' : '#1f2937' }}>
                    {course.title}
                  </Text>
                  <View
                    className="h-8 w-8 rounded-full bg-white/30 dark:bg-zinc-700/50 items-center justify-center"
                    onTouchEnd={() => onToggleFavorite(course.id)}
                  >
                    <Heart
                      size={19}
                      color={course.isFavorite ? '#8B5CF6' : '#6b7280'}
                      fill={course.isFavorite ? '#8B5CF6' : 'transparent'}
                    />
                  </View>
                </View>
                <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  {course.description}
                </Text>
                <View className="flex-row items-center gap-3 mt-2">
                  <View className="flex-row items-center gap-1">
                    <LevelIcon size={16} color="#6b7280" />
                    <Text className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                      {course.level}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color="#6b7280" />
                    <Text className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                      {course.duration}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-4">
            <View className="mb-1 flex-row justify-between">
              <Text className="text-xs" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                پیشرفت کاربر
              </Text>
              <Text className="text-xs" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                {course.progress}٪
              </Text>
            </View>
            <View className="h-2 w-full rounded-full bg-gray-200 dark:bg-zinc-700">
              <View
                className="h-2 rounded-full bg-primary"
                style={{ width: course.progress ? `${course.progress}%` : '0%' }}
              />
            </View>
          </View>
        </View>
      ) : (
        // Course without progress
        <View className="flex-row items-start justify-between">
          <View className="flex-row gap-4 flex-1">
            <View className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden">
              <Image
                source={{ uri: course.image }}
                className="h-28 w-28"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="font-bold text-lg" style={{ color: theme === 'dark' ? '#e5e7eb' : '#1f2937' }}>
                  {course.title}
                </Text>
                <View
                  className="h-8 w-8 rounded-full bg-white/30 dark:bg-zinc-700/50 items-center justify-center"
                  onTouchEnd={() => onToggleFavorite(course.id)}
                >
                  <Heart
                    size={19}
                    color={course.isFavorite ? '#8B5CF6' : '#6b7280'}
                    fill={course.isFavorite ? '#8B5CF6' : 'transparent'}
                  />
                </View>
              </View>
              <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                {course.description}
              </Text>
              <View className="flex-row items-center gap-3 mt-3">
                <View className="flex-row items-center gap-1">
                  <LevelIcon size={14} color="#6b7280" />
                  <Text className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                    {course.level}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                    {course.duration}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
