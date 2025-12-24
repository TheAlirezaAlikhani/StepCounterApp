import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface WheelPickerProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  onDateChange,
  initialDate = new Date(),
}) => {
  const [date, setDate] = useState(initialDate);

  // For now, just display the date without picker functionality
  // You can add a simple date input or calendar component later if needed
  const displayDate = date.toLocaleDateString();

  return (
    <View>
      <Text style={{ fontSize: 16, padding: 10 }}>
        Selected Date: {displayDate}
      </Text>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
        Date picker functionality removed to avoid Android compatibility issues
      </Text>
    </View>
  );
};

