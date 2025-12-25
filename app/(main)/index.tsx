import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StepCounter } from '../../components/StepCounter';
import { SuggestedCourseCard } from '../../components/SuggestedCourseCard';
import { TipCard } from '../../components/TipCard';
import { NewProgramCard } from '../../components/NewProgramCard';
import { SimpleCarousel } from '../../components/SimpleCarousel';
import { SearchInput } from '../../components/SearchInput';
import { UserHeader } from '../../components/UserHeader';
import { useTheme } from '../../hooks/theme-context';

// Ensure RTL is enabled
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
}

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleAccountPress = () => {
    router.push('/myaccount');
  };

  const handleCoursesPress = () => {
    router.push('/courses-list');
  };

  // Mock user data - in real app this would come from context/hooks
  const [user] = useState({
    display_name: "کاربر جدید",
    acf: {
      profile_image: {
        thumb: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW1Z1CT09CxF1hX7oF28A4_8cfBuiw4oNWhQv68C1XDNUfmrhn-gr0I6wAlGTcoDXabOs23hEpeBU0IupWCIfaa4BGlty-2GdsDZN8YMRJL2C9OwU4WDKnLVDOTrmMxj_GXxuYZO8RI3N-m7NRgMMsq7lcRHpjfiNCgh9B2OhHG7qB46MYd_nwV1HEI-W7tgOGb2iKORBIH8grHTRdTcG7ZyHBfPwIZVgUha4IoDPj1cIn2ib7k1q4KD395kn1xS_rlcvOgWTkXwE"
      }
    }
  });
  const [isLoading] = useState(false);

  // Data from the Next.js page
  const suggestedCourses = [
    {
      id: 1,
      title: "تمرین قدرتی ران",
      duration: "۱۰ دقیقه",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlvNqK_MHG-rUk2v1SL8TtZJ0u6ZApWSOQwHKe-uAlMDouoKo2IxQBCakNgj2f7cCo2zuYoAVLGfUcGJeA6ZoGoVqVPdpYHqwhW9NgJqAIT7CqHG0OAqH0FCjiRAmVCZmdohWGJNG7C54l8zYTdCPyCyujWHznsgopEX-b-LnaKpeVqOZBkOs6-yvBhXbuWzlf0VzOLz4NQDrmEvKL07MGYYP7PE_7heYNUJlOrVZLrWI2oil_7GQ2A8RUYks-L_LNG5QSHw0NoY",
    },
    {
      id: 2,
      title: "تمرین با دمبل",
      duration: "۱۰ دقیقه",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQnf63UthioFIPBU-aaFKKp19-X5YoBNqJL0eZ7CmhUAefjC0K-xVcxbg_oK-lLcu7-uELrmiO3q7rWxhdBKYsVQLwl9Mvnn8r_t_oKEN7Ryf_NuehT5jzkEeE5lnSCP_rjuDN6RkdRbPbiMx0Z6MlG2nCqKnogkR5PoUkB6ndqN6n3ONyI8ZXh7wIuldcZCEgE9n0H5j1_L7-_ovpzjooZ2i9HBtFTgJW_8gw9G5F0VTvT2OoaxsxHnLf-lRGfKr1dIzyhBsyf_Y",
    },
    {
      id: 3,
      title: "تقویت بازوها",
      duration: "۸ دقیقه",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf8tZpJ0_ZQjncP-JiajzqadFXpr8MPw1GC7UGBQwzGv6vgLs6rvlnAnsS2jq38YdzjTs-bTwgY0mo4sRWfYCM66pmgGlMjMWY0rVvqccjvdVvxdWWohDzoh8Su0OkZE1s6_IC53MsCH32fwD-XhdA8ZQY-qY3DrTWa-Xk83TSNVZ-VffWYQjAt7t3fRursh5-SbLVsuXF87L-SkX6XOKCHkgIB9Zvzz1pjloQX9W--7j5NmBtn2IH3QKU607hGQCAiwCgiXdoLjY",
    },
  ];

  const tips = [
    {
      id: 1,
      title: "چگونه خواب کافی به چربی‌سوزی کمک می‌کند؟",
      readingTime: "زمان مطالعه: ۹ دقیقه",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnGfMdX6oKwWQyAfHjJ6GQZQoNsJK9aj8sYtPena8yGAknS4SFJTbLlTC9dAz0sM6Wxhg2k2LxB0B7anRLcpsv0Cl8hnj0nyFHqNvoDPJcZS2S_1YZ96YgodogtiZ_0REitW1gqmdyY-EOTltx0BQ1-awleOEAxbgMXNzqT2tAHW_un1jgdRYcOp_px7INXSa-O8vIk3ddV8aKz9scWoi--ghuYrMRCLfdYPfUQFfeXn_GmEQQL-06dRV3XqluW5EPw5KFdFbbtCQ",
    },
    {
      id: 2,
      title: "نقش خواب در کاهش وزن",
      readingTime: "زمان مطالعه: ۹ دقیقه",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_pIIlFzwaCh7zW3LKaHWihfEOCkIZlmy_X5sL0qLOp0jUT2dw5CqvbhQ-aYGWztSdTVP4q4avSsI3RSuHG2OnwZ20kOfs-ZQaShbUh_-5QT8luko66l4X8HH6KdBKAEBz5PtabN9MTVmMlWvET7UHFg8BHjw5k7ROMPp_i6IVPQ2R8MDnrK8opWlgoyHOzhLCV6iUQtEjIMjkPS0btHzv4-ooslBlixWyX-1PXeuGVDEMFPpjvGrBQTd5KWaRU9lpuUTFmya98ds",
    },
  ];

  const programSlides = useMemo(
    () => [
      <NewProgramCard key={0} />,
      <NewProgramCard key={1} />,
      <NewProgramCard key={2} />,
    ],
    []
  );

  return (
    <ScrollView
      className="flex-1 "
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
      style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F8FAFC' }}
    >
        <View className="px-6">
          {/* Header */}
          <UserHeader user={user} isLoading={isLoading} onToggleTheme={toggleTheme} onAccountPress={handleAccountPress} />

          {/* Search */}
          <SearchInput />

          {/* Navigation to Courses */}
          <View className="mb-4">
            <Pressable
              className="flex-row items-center justify-center p-3 rounded-xl bg-primary active:bg-primary/80"
              onPress={handleCoursesPress}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: false }}
            >
              <Text className="text-white font-semibold text-base mr-2">
                مشاهده تمام دوره‌ها
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" />
            </Pressable>
          </View>

          {/* Step Counter */}
          <View className="pb-10 pt-2">
            <StepCounter />
          </View>

         
          {/* New Program Card */}
          <SimpleCarousel slides={programSlides} />

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                دوره‌های پیشنهادی
              </Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-primary">نمایش همه</Text>
              </View>
            </View>
          </View>
          {/* Suggested Courses */}
          <View className="mb-8 -mx-6 ">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6"
              contentContainerStyle={{ paddingRight: 6 }}
            >
              {suggestedCourses.map((course) => (
                <SuggestedCourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  duration={course.duration}
                  image={course.image}
                />
              ))}
            </ScrollView>
          </View>
        <View className="px-6">
          {/* Tips and Recommendations */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                نکات و توصیه‌ها
              </Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-primary">نمایش همه</Text>
              </View>
            </View>
            <View className="space-y-4 gap-3">
              {tips.map((tip) => (
                <TipCard
                  key={tip.id}
                  id={tip.id}
                  title={tip.title}
                  readingTime={tip.readingTime}
                  image={tip.image}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
  );
}

