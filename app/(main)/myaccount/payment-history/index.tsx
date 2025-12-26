import React from 'react';
import { View, ScrollView, TouchableOpacity, ColorSchemeName } from 'react-native';
import { ChevronLeft, CreditCard, Dumbbell, GraduationCap } from 'lucide-react-native';
import { useTheme } from '../../../../hooks/theme-context';
import { useRouter } from 'expo-router';
import { Text } from '../../../../components/ui/Text';

const paymentData = [
  {
    period: "این ماه",
    payments: [
      {
        title: "برنامه غذایی ۳ ماهه",
        date: "۱۸ تیر ۱۴۰۳",
        amount: "۴۵۰,۰۰۰ تومان",
        icon: CreditCard,
      },
      {
        title: "برنامه تمرینی شخصی",
        date: "۵ تیر ۱۴۰۳",
        amount: "۲۵۰,۰۰۰ تومان",
        icon: Dumbbell,
      },
    ],
  },
  {
    period: "خرداد ۱۴۰۳",
    payments: [
      {
        title: "دوره آموزشی یوگا",
        date: "۲۲ خرداد ۱۴۰۳",
        amount: "۱۸۰,۰۰۰ تومان",
        icon: GraduationCap,
      },
      {
        title: "تمدید اشتراک ماهانه",
        date: "۱ خرداد ۱۴۰۳",
        amount: "۹۹,۰۰۰ تومان",
        icon: CreditCard,
      },
    ],
  },
  {
    period: "اردیبهشت ۱۴۰۳",
    payments: [
      {
        title: "اشتراک ماه اول",
        date: "۱ اردیبهشت ۱۴۰۳",
        amount: "۹۹,۰۰۰ تومان",
        icon: CreditCard,
      },
    ],
  },
];

interface PaymentItemProps {
  payment: {
    title: string;
    date: string;
    amount: string;
    icon: any;
  };
  theme: ColorSchemeName;
}

function PaymentItem({ payment, theme }: PaymentItemProps) {
  const IconComponent = payment.icon;

  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
          <IconComponent size={20} color={theme === 'dark' ? '#a855f7' : '#8B5CF6'} />
        </View>
        <View>
          <Text weight="semiBold" className="text-sm mb-1" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            {payment.title}
          </Text>
          <Text className="text-xs" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
            {payment.date}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <Text weight="bold" className="text-sm" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
          {payment.amount}
        </Text>
        <ChevronLeft size={16} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
      </View>
    </TouchableOpacity>
  );
}

interface PaymentSectionProps {
  section: {
    period: string;
    payments: {
      title: string;
      date: string;
      amount: string;
      icon: any;
    }[];
  };
  theme: ColorSchemeName;
}

function PaymentSection({ section, theme }: PaymentSectionProps) {
  return (
    <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl mb-4">
      <Text weight="bold" className="mb-4 text-base" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
        {section.period}
      </Text>
      <View className="divide-y divide-gray-200 dark:divide-zinc-700">
        {section.payments.map((payment, index) => (
          <PaymentItem key={index} payment={payment} theme={theme} />
        ))}
      </View>
    </View>
  );
}

export default function PaymentHistoryPage() {
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
          <Text weight="bold" className="text-2xl" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            تاریخچه پرداخت‌ها
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
          <View>
            {paymentData.map((section, index) => (
              <PaymentSection key={index} section={section} theme={theme} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
