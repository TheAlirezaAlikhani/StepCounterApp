import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ColorSchemeName } from 'react-native';
import { ChevronLeft, Dumbbell, UtensilsCrossed, Activity } from 'lucide-react-native';
import { useTheme } from '../../../hooks/theme-context';
import { useRouter } from 'expo-router';

const activeCourses = [
  {
    title: "برنامه ۱۲ هفته‌ای چربی‌سوزی",
    endDate: "پایان برنامه: ۱۲ شهریور ۱۴۰۳",
    progress: 75,
    icon: Dumbbell,
  },
  {
    title: "رژیم غذایی کتوژنیک",
    endDate: "پایان برنامه: ۳۰ مرداد ۱۴۰۳",
    progress: 40,
    icon: UtensilsCrossed,
  },
  {
    title: "دوره آمادگی برای دو ماراتن",
    endDate: "پایان برنامه: ۱۵ مهر ۱۴۰۳",
    progress: 10,
    icon: Activity,
  },
];

interface CourseCardProps {
  course: {
    title: string;
    endDate: string;
    progress: number;
    icon: any;
  };
  theme: ColorSchemeName;
}

function CourseCard({ course, theme }: CourseCardProps) {
  const IconComponent = course.icon;

  return (
    <TouchableOpacity className="bg-white dark:bg-zinc-800 p-4 rounded-2xl mb-4 border border-transparent active:shadow-lg dark:active:shadow-xl">
      <View className="flex-row items-center gap-4 mb-4">
        <View className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
          <IconComponent size={28} color={theme === 'dark' ? '#a855f7' : '#8B5CF6'} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            {course.title}
          </Text>
          <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
            {course.endDate}
          </Text>
        </View>
      </View>
      <View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
            پیشرفت
          </Text>
          <Text className="text-sm font-bold" style={{ color: theme === 'dark' ? '#a855f7' : '#8B5CF6' }}>
            {course.progress}٪
          </Text>
        </View>
        <View className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5">
          <View
            className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full"
            style={{ width: `${course.progress}%` }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ActiveCoursesPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F7FAFC' }}>
      <View className="max-w-md mx-auto flex-1">
        {/* Header */}
        <View className="p-6 flex-row items-center justify-between w-full">
          <Text className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            برنامه‌های فعال
          </Text>
          <TouchableOpacity
            onPress={handleBackPress}
            className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700"
          >
            <ChevronLeft size={24} color={theme === 'dark' ? '#ffffff' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-6 pb-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="gap-4">
            {activeCourses.map((course, index) => (
              <CourseCard key={index} course={course} theme={theme} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
