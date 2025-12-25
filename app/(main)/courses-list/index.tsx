import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../../hooks/theme-context';
import { useRouter } from 'expo-router';
import { SearchInput } from '../../../components/SearchInput';
import { CourseCard } from '../../../components/CourseCard';

const courses = [
  {
    id: 1,
    title: "تمرین قدرتی ران",
    description: "تمرینات موثر برای تقویت عضلات ران.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlvNqK_MHG-rUk2v1SL8TtZJ0u6ZApWSOQwHKe-uAlMDouoKo2IxQBCakNgj2f7cCo2zuYoAVLGfUcGJeA6ZoGoVqVPdpYHqwhW9NgJqAIT7CqHG0OAqH0FCjiRAmVCZmdohWGJNG7C54l8zYTdCPyCyujWHznsgopEX-b-LnaKpeVqOZBkOs6-yvBhXbuWzlf0VzOLz4NQDrmEvKL07MGYYP7PE_7heYNUJlOrVZLrWI2oil_7GQ2A8RUYks-L_LNG5QSHw0NoY",
    level: "متوسط",
    duration: "۱۰ دقیقه",
    progress: 75,
    isFavorite: false,
  },
  {
    id: 2,
    title: "تمرین با دمبل",
    description: "قدرت بالاتنه خود را افزایش دهید.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQnf63UthioFIPBU-aaFKKp19-X5YoBNqJL0eZ7CmhUAefjC0K-xVcxbg_oK-lLcu7-uELrmiO3q7rWxhdBKYsVQLwl9Mvnn8r_t_oKEN7Ryf_NuehT5jzkEeE5lnSCP_rjuDN6RkdRbPbiMx0Z6MlG2nCqKnogkR5PoUkB6ndqN6n3ONyI8ZXh7wIuldcZCEgE9n0H5j1_L7-_ovpzjooZ2i9HBtFTgJW_8gw9G5F0VTvT2OoaxsxHnLf-lRGfKr1dIzyhBsyf_Y",
    level: "آسان",
    duration: "۱۰ دقیقه",
    progress: null,
    isFavorite: false,
  },
  {
    id: 3,
    title: "تقویت بازوها",
    description: "بدون نیاز به وسیله، بازوهایتان را قوی کنید.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf8tZpJ0_ZQjncP-JiajzqadFXpr8MPw1GC7UGBQwzGv6vgLs6rvlnAnsS2jq38YdzjTs-bTwgY0mo4sRWfYCM66pmgGlMjMWY0rVvqccjvdVvxdWWohDzoh8Su0OkZE1s6_IC53MsCH32fwD-XhdA8ZQY-qY3DrTWa-Xk83TSNVZ-VffWYQjAt7t3fRursh5-SbLVsuXF87L-SkX6XOKCHkgIB9Zvzz1pjloQX9W--7j5NmBtn2IH3QKU607hGQCAiwCgiXdoLjY",
    level: "آسان",
    duration: "۸ دقیقه",
    progress: null,
    isFavorite: false,
  },
  {
    id: 4,
    title: "یوگای صبحگاهی",
    description: "روز خود را با انرژی و آرامش شروع کنید.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYQqDzwUrJ6cdd432G4yxJl7ATIY0vNPGYm702cIxPYQARCzPWfGLcyXKWJ6jis60bdUQOoBDWewVvHm27SkUM1SOQ2i8kg0pbEFDaToNGbZNcDLOsXYSfz2RRVh-EMw2DAdlfhnEjf2y-YAyCbVt3hOEmRka0NDAHLuepvoiGaA-2jCQN2jdBnFiT-AQhpg0dZcIirnh8bhme1Pafv4eIyR4j_eoSV5IBtQV2b-2KV2qz1yVqzFXFBgNDpeGOi5ps476vBvN2ImE",
    level: "متوسط",
    duration: "۱۵ دقیقه",
    progress: null,
    isFavorite: true,
  },
];

const filterChips = [
  { id: "all", label: "تمام دوره‌ها", active: true },
  { id: "special", label: "دوره‌های ویژه شما", active: false },
  { id: "weight-gain", label: "افزایش وزن", active: false },
  { id: "correction", label: "حرکات اصلاحی", active: false },
  { id: "special-courses", label: "دوره‌های خاص", active: false },
  { id: "weight-loss", label: "کاهش وزن", active: false },
];

export default function CourseListPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(courses.filter((c) => c.isFavorite).map((c) => c.id))
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F8FAFC' }}>
      <View className="max-w-md mx-auto flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <View className="px-6 py-4">
            {/* Header */}
            <View className="p-6 flex-row items-center justify-between w-full">
              <Text className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
                تمام دوره‌ها
              </Text>
              <View
                className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700"
                onTouchEnd={handleBackPress}
              >
                <ChevronLeft size={24} color={theme === 'dark' ? '#ffffff' : '#111827'} />
              </View>
            </View>

            {/* Search */}
            <View className="mb-4">
              <SearchInput
                placeholder="جستجو در دوره‌ها..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Chips */}
            <View className="mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-6 px-6 "
              >
                <View className="flex-row gap-2">
                  {filterChips.map((chip) => (
                    <View
                      key={chip.id}
                      className={`p-3 rounded-full border ${
                        activeFilter === chip.id
                          ? 'bg-primary border-primary'
                          : 'bg-gray-100 dark:bg-zinc-800 border-0'
                      }`}
                      onTouchEnd={() => setActiveFilter(chip.id)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          activeFilter === chip.id
                            ? 'text-white'
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {chip.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Course Cards */}
            <View className="gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{ ...course, isFavorite: favorites.has(course.id) }}
                  theme={theme || 'light'}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}