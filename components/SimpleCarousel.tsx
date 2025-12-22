import React, { useState, useRef } from 'react';
import { View, ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface SimpleCarouselProps {
  slides: React.ReactNode[];
  className?: string;
}

export function SimpleCarousel({ slides, className }: SimpleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * 300, // Approximate slide width
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View className={`max-w-3xl mx-auto pb-6 ${className || ''}`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="overflow-hidden"
      >
        <View className="flex-row">
          {slides.map((slide, index) => (
            <View
              key={index}
              className="shrink-0 min-w-0 pr-4 basis-full"
            >
              {slide}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row justify-center items-center gap-2">
        {slides.map((_, index) => (
          <Pressable
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex
                ? 'bg-black dark:bg-white'
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </View>
  );
}
