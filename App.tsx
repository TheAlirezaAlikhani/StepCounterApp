import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Button, View, NativeModules, ScrollView } from 'react-native';

import './global.css';

// 🔹 Get native module
const { StepCounter } = NativeModules;

export default function App() {
  return (
    <ScrollView>
    <View style={{ flex: 1, marginTop: 60 }}>
      
      <ScreenContent title="Home" path="App.tsx" />

      <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
        <Button
          title="Start Background Step Service"
          onPress={() => {
            console.log('Starting service');
            StepCounter.startService();
          }}
        />

        <View style={{ height: 20 }} />

        <Button
          title="Stop Background Step Service"
          onPress={() => {
            console.log('Stopping service');
            StepCounter.stopService();
          }}
        />
      </View>

      <StatusBar style="auto" />
    </View>
    </ScrollView>
  );
}