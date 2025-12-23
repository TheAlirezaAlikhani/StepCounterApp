import React, { useState, useRef } from 'react';
import { View, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface SimpleCarouselProps {
  slides: React.ReactNode[];
  className?: string;
}

export function SimpleCarousel({ slides, className }: SimpleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (slideWidth === 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };


  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setSlideWidth(width);
  };

  return (
    <View className={`pb-6 ${className || ''}`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={slideWidth > 0}
        decelerationRate="normal"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={onLayout}
        bounces={false}
      >
        {slides.map((slide, index) => (
          <View
          className='p-2'
            key={index}
            style={{ width: slideWidth }}
          >
            {slide}
          </View>
        ))}
      </ScrollView>

      <View className="flex-row-reverse justify-center items-center gap-2">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex
                ? 'bg-black dark:bg-white'
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
