import React from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StepCounter } from 'components/StepCounter';
import { StatusBar } from 'expo-status-bar';
import { View, ScrollView } from 'react-native';

import './global.css';

export default function App() {

  return (
    <ScrollView>
    <View style={{ flex: 1, marginTop: 60 }}>

      <ScreenContent title="Home" path="App.tsx" />

      <StepCounter />

      <StatusBar style="auto" />
    </View>
    </ScrollView>
  );
}