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
  switch(appState) {
    case States.POMODORO_RUNNING:
      backgroundStyle.push(styles.pomodoroRunning);
      break;
    case States.POMODORO_ENDED:
      backgroundStyle.push(styles.pomodoroEnded);
      break;
    case States.BREAK_RUNNING:
      backgroundStyle.push(styles.pomodoroBreakRunning);
      break;
    case States.BREAK_END:
      backgroundStyle.push(styles.pomodoroBreakEnded);
      break;
    case States.DEFAULT:
    default:
      backgroundStyle.push(styles.pomodoroDefault);
      break;
  }
  return (
    <View style={backgroundStyle}>
      <Text>Tomate!</Text>
      <Pressable onPress={() => {
        if (appState === States.DEFAULT || appState === States.BREAK_END) {
          const now = new Date();
          console.log('Pomodoro started!', now);
          setAppState(States.POMODORO_RUNNING);
          setTimeout(() => {
            setAppState(States.POMODORO_ENDED);
          }, 1000 * 60 * 25)
        }
      }}>
        <Text>Press!</Text>
      </Pressable>
      <Pressable onPress={() => {
        if (appState === States.DEFAULT || appState === States.POMODORO_ENDED) {
          const now = new Date();
          console.log('Break-ing!', now);
          setAppState(States.BREAK_RUNNING);
          setTimeout(() => {
            setAppState(States.BREAK_END);
          }, 1000 * 60 * 5)
        }
      }}>
        <Text>Break!</Text>
      </Pressable>
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
  pomodoroDefault: {
    backgroundColor: 'grey'
  },
  pomodoroRunning: {
    backgroundColor: 'red',
  },
  pomodoroEnded: {
    backgroundColor: 'green'
  },
  pomodoroBreakRunning: {
    backgroundColor: 'blue',
  },
  pomodoroBreakEnded: {
    backgroundColor: 'purple'
  }
});
