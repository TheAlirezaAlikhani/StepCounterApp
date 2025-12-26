import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Animated, ColorSchemeName } from 'react-native';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../../hooks/theme-context';
import { useRouter } from 'expo-router';
import { SearchInput } from '../../../components/SearchInput';
import { Text } from '../../../components/ui/Text';

const faqItems = [
  {
    question: "چگونه می‌توانم یک برنامه تمرینی جدید دریافت کنم؟",
    answer:
      "برای دریافت برنامه تمرینی جدید، به بخش «برنامه‌ها» در صفحه اصلی بروید و روی دکمه «دریافت برنامه جدید» کلیک کنید. سپس اطلاعات درخواستی را تکمیل کرده تا برنامه متناسب با اهداف شما طراحی شود.",
  },
  {
    question: "آیا امکان تغییر برنامه غذایی وجود دارد؟",
    answer:
      "بله، شما می‌توانید از طریق بخش «برنامه غذایی» درخواست تغییرات دهید. تیم پشتیبانی ما پس از بررسی، تغییرات لازم را اعمال خواهد کرد.",
  },
  {
    question: "چگونه می‌توانم اشتراک خود را تمدید کنم؟",
    answer:
      "برای تمدید اشتراک، به بخش «حساب کاربری» و سپس «پرداخت‌ها» مراجعه کنید. در آنجا می‌توانید طرح‌های مختلف را مشاهده و اشتراک خود را تمدید نمایید.",
  },
  {
    question: "اطلاعات پرداخت من امن است؟",
    answer:
      "بله، ما از درگاه‌های پرداخت امن و معتبر استفاده می‌کنیم و اطلاعات شما به صورت رمزنگاری شده منتقل می‌شود تا امنیت کامل اطلاعات شما تضمین گردد.",
  },
  {
    question: "در صورت بروز مشکل با چه کسی تماس بگیرم؟",
    answer:
      "شما می‌توانید از طریق بخش «ارتباط با ما» در صفحه حساب کاربری، با تیم پشتیبانی ما در تماس باشید. ما در اسرع وقت به سوالات و مشکلات شما رسیدگی خواهیم کرد.",
  },
  {
    question: "چگونه می توانم پیشرفت خود را پیگیری کنم؟",
    answer:
      "در صفحه اصلی اپلیکیشن، بخشی به نام «گزارش پیشرفت» وجود دارد که در آن می‌توانید نمودارهای مربوط به وزن، سایز و سایر شاخص‌های بدنی خود را مشاهده و پیشرفت خود را دنبال کنید.",
  },
];

interface FAQItemProps {
  item: {
    question: string;
    answer: string;
  };
  theme: ColorSchemeName;
}

function FAQItem({ item, theme }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust based on content
  });

  return (
    <View className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden mb-4">
      <TouchableOpacity
        onPress={toggleAccordion}
        className="px-4 py-4 flex-row items-center justify-between"
      >
        <Text weight="semiBold" className="text-sm  flex-1" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
          {item.question}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <ChevronDown size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={{
          height: heightInterpolate,
          overflow: 'hidden',
        }}
      >
        <View className="px-4 pb-4">
          <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
            {item.answer}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function FAQPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = faqItems.filter(
    (item) =>
      item.question.includes(searchQuery) || item.answer.includes(searchQuery)
  );

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F7FAFC' }}>
      <View className="max-w-md mx-auto flex-1">
        {/* Header */}
        <View className="p-6 flex-row items-center justify-between w-full">
          <Text weight="bold" className="text-2xl" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            سوالات متداول
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
          {/* Search */}
          <View className="mb-4">
            <SearchInput
              placeholder="جستجو در سوالات..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* FAQ Items */}
          <View>
            {filteredItems.map((item, index) => (
              <FAQItem key={index} item={item} theme={theme} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
