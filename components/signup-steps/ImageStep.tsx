import React from 'react';
import { View, Text, Image, Dimensions, ImageSourcePropType, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import type { StepComponentProps } from './types';

const { width, height } = Dimensions.get('window');

interface ImageStepData {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const stepData: Record<1 | 2 | 3, ImageStepData> = {
  1: {
    image: require('../../assets/step1.png'),
    title: 'تمرین ویدیویی، همراه همیشگی',
    description: 'تمام تمرین‌ها به‌صورت ویدیویی و مرحله‌به‌مرحله در دسترس تو هستن تا بدون سردرگمی، هرجا هستی با لتسفیت تمرین کنی.',
  },
  2: {
    image: require('../../assets/step2.png'),
    title: 'برنامه شخصی تمرین و رژیم',
    description: 'با توجه به هدف، شرایط بدنی و سبک زندگیت، برنامه‌های تمرینی و رژیمی کاملاً شخصی‌سازی‌شده دریافت می‌کنی؛ نه نسخه‌های آماده و تکراری.',
  },
  3: {
    image: require('../../assets/step3.png'),
    title: 'شروع درست، بدون آسیب',
    description: 'در لتسفیت، تمرین فقط قوی‌تر شدن نیست. با حرکات اصلاحی تخصصی، به بدنت کمک می‌کنیم اشتباهات حرکتی رو اصلاح کنی و اصولی ورزش کنی.',
  },
};

interface ImageStepProps extends StepComponentProps {
  stepNumber?: 1 | 2 | 3;
}

export function ImageStep({ stepNumber = 1, onEnter, currentStepId = 1 }: ImageStepProps) {
  const data = stepData[stepNumber];

  // In RTL, we want the button on the Left and Dots on the Right.
  // With flex-row (RTL direction: Right -> Left):
  // 1st Item -> Right
  // 2nd Item -> Left
  // So: 1st Item = Dots, 2nd Item = Button

  return (
    <View className="flex-1 w-full relative bg-black">
      {/* Full Screen Background Image */}
      <Image
        source={data.image}
        style={{ width: width, height: height, position: 'absolute' }}
        resizeMode="cover"
      />

      {/* Dark Overlay Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
        locations={[0, 0.5, 0.9]}
        style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.9,
        }}
      />

      {/* Content Container */}
      <View className="flex-1 px-6 mb-12">
        {/* Centered Logo Area - Takes available space above text */}
        <View className="flex-1 items-center justify-center ">
          <Image
            source={require('../../assets/letsfit.png')}
            style={{ width: 160, height: 60 }}
            resizeMode="contain"
          />
          <Text  className="text-white text-2xl  mt-2 font-medium tracking-wide">
            !هرقدمت حسابـــه
          </Text>
          <Text className="text-white/80 text-md mt-1 tracking-widest font-light">
            Every Move Counts
          </Text>
        </View>

        {/* Bottom Content Wrapper */}
        <View className="mb-12">
          {/* Text Content */}
          <View className="mb-10">
            <Text className="text-white text-2xl font-bold mb-4 leading-tight ">
              {data.title}
            </Text>
            <Text className="text-gray-300 text-base leading-7 font-light ">
              {data.description}
            </Text>
          </View>

          {/* Bottom Navigation Area */}
          <View className="flex-row items-center justify-between mt-4">
             {/* Pagination Dots - Will be on RIGHT in RTL (Start) */}
             <View className="flex-row items-center gap-2">
              {[1, 2, 3].map((step) => {
                const isActive = step === stepNumber;
                return (
                  <View
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                );
              })}
            </View>

            {/* Next Button - Will be on LEFT in RTL (End) */}
            <Pressable
              onPress={onEnter}
              className="w-14 h-14 bg-[#A855F7] rounded-xl items-center justify-center active:opacity-80"
              style={{
                shadowColor: "#A855F7",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 8
              }}
            >
              <ArrowLeft color="white" size={24} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ImageStep;
