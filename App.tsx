import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const States = {
  DEFAULT: 1,
  POMODORO_RUNNING: 2,
  POMODORO_ENDED: 3,
  BREAK_RUNNING: 4,
  BREAK_END: 5,
}

const POMODORO_DURATION_IN_MILLIS = 1000 * 60 * 25;
const BREAK_DURATION_IN_MILLIS = 1000 * 60 * 5;

// const POMODORO_DURATION_IN_MILLIS = 1000;
// const BREAK_DURATION_IN_MILLIS = 1000;

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface Event {
  code: number;
  timestamp: Date;
}

const EVENT_CODE = {
  POMODORO_STARTED: 1,
  POMODORO_ENDED: 2,
  BREAK_STARTED: 3,
  BREAK_ENDED: 4,
}

const EVENT_CODE_TO_NAME: any = {
  1: 'POMODORO_STARTED',
  2: 'POMODORO_ENDED',
  3: 'BREAK_STARTED',
  4: 'BREAK_ENDED',
}

export default function App() {
  const [appState, setAppState] = useState<number>(States.DEFAULT);
  const prevAppState = usePrevious(appState);
  const [logList, setLogList] = useState<Event[]>([]);
  const backgroundStyle: any[] = [styles.container];
  applyStyle(backgroundStyle, appState);

  useEffect(() => {
    function setTimerAndThenFireEvent(eventCode: number, duration: number, newState: number) {
      setTimeout(() => {
        setLogList([{code: eventCode, timestamp: new Date()}, ...logList]);
        setAppState(newState);
        if (Platform.OS === 'web') {
          window.alert(eventCode)
        } else {
          Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
          );
        }
      }, duration);
    }
    if (prevAppState !== States.POMODORO_RUNNING && appState === States.POMODORO_RUNNING) {
      setTimerAndThenFireEvent(EVENT_CODE.POMODORO_ENDED, POMODORO_DURATION_IN_MILLIS, States.POMODORO_ENDED);
    } else if (prevAppState !== States.BREAK_RUNNING && appState === States.BREAK_RUNNING) {
      setTimerAndThenFireEvent(EVENT_CODE.BREAK_ENDED, BREAK_DURATION_IN_MILLIS, States.BREAK_END);
    }
  }, [appState, logList]);

  return (
    <View style={backgroundStyle}>
      <Text>Tomate!</Text>
      <Pressable style={[styles.basicButton, styles.startPomodoroButton]} onPress={() => {
        if (appState !== States.POMODORO_RUNNING) {
          setLogList([{code: EVENT_CODE.POMODORO_STARTED, timestamp: new Date()}, ...logList]);
          setAppState(States.POMODORO_RUNNING);
        }
      }}>
        <Text>Press!</Text>
      </Pressable>
      <Pressable style={[styles.basicButton, styles.startBreakButton]} onPress={() => {
        if (appState !== States.BREAK_RUNNING) {
          setLogList([{code: EVENT_CODE.BREAK_STARTED, timestamp: new Date()}, ...logList]);
          setAppState(States.BREAK_RUNNING);
        }
      }}>
        <Text>Break!</Text>
      </Pressable>
      <View>{logList.map(event => (
        <Text>{EVENT_CODE_TO_NAME[event.code] + ' | ' + event.timestamp.toString()}</Text>
      ))}</View>
      <StatusBar style="auto" />
    </View>
  );
}

function applyStyle(backgroundStyle: any[], appState: number) {
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
  },
  basicButton: {
    margin: 10,
    backgroundColor: 'white',
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black'
  },
  startPomodoroButton: {
    backgroundColor: 'red',
  },
  startBreakButton: {
    backgroundColor: 'blue',
  }
});
