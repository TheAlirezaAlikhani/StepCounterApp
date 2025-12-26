import React from 'react';
import { View, ScrollView, Alert, Pressable, Image } from 'react-native';
import { useTheme } from '../../../hooks/theme-context';
import { useRouter } from 'expo-router';
import { useSession } from '../../../context/ctx';
import {
  User,
  Lock,
  Dumbbell,
  ClipboardList,
  CreditCard,
  MessageCircle,
  HelpCircle,
  LogOut,
  ChevronLeft
} from 'lucide-react-native';
import { Text } from '../../../components/ui/Text';

export default function MyAccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { signOut } = useSession();
  const isDark = theme === 'dark';

  // Mock user data - replace with actual user data
  const user = {
    display_name: "کاربر نمونه",
    email: "user@example.com",
    acf: {
      profile_image: {
        thumb: "https://via.placeholder.com/80x80"
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "خروج از حساب",
      "آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟",
      [
        { text: "لغو", style: "cancel" },
        {
          text: "خروج",
          style: "destructive",
          onPress: () => {
            // Sign out - this clears the session and redirects to auth
            signOut();
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/myaccount/profile-edit');
  };

  const handleChangePassword = () => {
    Alert.alert('اطلاع', 'این قابلیت به زودی اضافه خواهد شد');
  };

  const handleGoalsAndSpecs = () => {
    Alert.alert('اطلاع', 'این قابلیت به زودی اضافه خواهد شد');
  };

  const handleActiveCourses = () => {
    router.push('/myaccount/active-courses');
  };

  const handlePaymentHistory = () => {
    router.push('/myaccount/payment-history');
  };

  const handleContactUs = () => {
    router.push('/contact-us');
  };

  const handleFAQ = () => {
    router.push('/faq');
  };

  // Theme colors matching Next.js project
  const colors = {
    background: isDark ? '#121212' : '#f7fafc',
    surface: isDark ? '#18181B' : '#FFFFFF',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#8B5CF6',
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="  flex-1">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {/* User Info */}
            <View className="flex-row items-center gap-4 mb-4 mt-4">
              <View 
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
              >
                {user.acf?.profile_image?.thumb ? (
                  <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_pIIlFzwaCh7zW3LKaHWihfEOCkIZlmy_X5sL0qLOp0jUT2dw5CqvbhQ-aYGWztSdTVP4q4avSsI3RSuHG2OnwZ20kOfs-ZQaShbUh_-5QT8luko66l4X8HH6KdBKAEBz5PtabN9MTVmMlWvET7UHFg8BHjw5k7ROMPp_i6IVPQ2R8MDnrK8opWlgoyHOzhLCV6iUQtEjIMjkPS0btHzv4-ooslBlixWyX-1PXeuGVDEMFPpjvGrBQTd5KWaRU9lpuUTFmya98ds" }}
                    className="w-20 h-20 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <User size={36} color="#64748B" />
                )}
              </View>
              <View className="flex-1">
                <Text 
                  weight="bold"
                  className="text-xl"
                  style={{ color: colors.textPrimary }}
                >
                  {user.display_name || "کاربر"}
                </Text>
                <Text 
                  className="text-sm"
                  style={{ color: colors.textMuted }}
                >
                  {user.email || "user@example.com"}
                </Text>
              </View>
            </View>

            {/* Account Sections */}
            <View className="gap-4">
              {/* User Information Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text 
                  weight="bold"
                  className="mb-4 text-base"
                  style={{ color: colors.textPrimary }}
                >
                  اطلاعات کاربری
                </Text>
                <View className="gap-2">
                  <Pressable 
                    onPress={handleEditProfile} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <User size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        ویرایش پروفایل
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>

                  <Pressable 
                    onPress={handleChangePassword} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <Lock size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        تغییر رمز عبور
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              {/* Physical Information Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text 
                  weight="bold"
                  className="mb-4 text-base"
                  style={{ color: colors.textPrimary }}
                >
                  مشخصات بدنی
                </Text>
                <View className="gap-2">
                  <Pressable 
                    onPress={handleGoalsAndSpecs} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <Dumbbell size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        اهداف و مشخصات
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              {/* Programs and Payments Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text 
                  weight="bold"
                  className="mb-4 text-base"
                  style={{ color: colors.textPrimary }}
                >
                  برنامه‌ها و پرداخت‌ها
                </Text>
                <View className="gap-2">
                  <Pressable 
                    onPress={handleActiveCourses} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <ClipboardList size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        برنامه‌های فعال
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>

                  <Pressable 
                    onPress={handlePaymentHistory} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <CreditCard size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        تاریخچه پرداخت‌ها
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              {/* Support Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text 
                  weight="bold"
                  className="mb-4 text-base"
                  style={{ color: colors.textPrimary }}
                >
                  پشتیبانی
                </Text>
                <View className="gap-2">
                  <Pressable 
                    onPress={handleContactUs} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <MessageCircle size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        ارتباط با ما
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>

                  <Pressable 
                    onPress={handleFAQ} 
                    className="flex-row items-center justify-between p-3 rounded-lg active:opacity-70"
                  >
                    <View className="flex-row items-center gap-4">
                      <HelpCircle size={24} color={colors.primary} />
                      <Text 
                        weight="medium"
                        className="text-sm"
                        style={{ color: colors.textPrimary }}
                      >
                        سوالات متداول
                      </Text>
                    </View>
                    <ChevronLeft size={24} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Logout Button - matching Next.js simple style */}
            <View className="pt-4">
              <Pressable
                onPress={handleLogout}
                className="flex-row items-center justify-center p-3 rounded-lg gap-2 active:opacity-70"
                android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}
              >
                <LogOut size={24} color="#EF4444" />
                <Text weight="bold" className="text-red-500">
                  خروج از حساب
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
