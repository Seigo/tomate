import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const States = {
  DEFAULT: 1,
  POMODORO_RUNNING: 2,
  POMODORO_ENDED: 3,
  BREAK_RUNNING: 4,
  BREAK_END: 5,
}

export default function App() {
  const [appState, setAppState] = useState(States.DEFAULT);
  const backgroundStyle: any[] = [styles.container];
  if (appState === States.POMODORO_RUNNING) {
    backgroundStyle.push(styles.pomodoroRunning);
  }
  return (
    <View style={backgroundStyle}>
      <Text>Tomate!</Text>
      <Pressable onPress={() => {
        if (appState === States.DEFAULT) {
          const now = new Date();
          console.log('Pomodoro started!', now);
          setAppState(States.POMODORO_RUNNING);
        }
      }}>
      <Text>Press!</Text></Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomodoroRunning: {
    backgroundColor: 'red',
  },
});
