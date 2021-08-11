import AsyncStorage from '@react-native-community/async-storage';
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

  EVENT_LIST_INITIALIZED: 5,
}

const EVENT_CODE_TO_NAME: any = {
  1: 'POMODORO_STARTED',
  2: 'POMODORO_ENDED',
  3: 'BREAK_STARTED',
  4: 'BREAK_ENDED',

  5: 'EVENT_LIST_INITIALIZED',
}

export default function App() {
  const [appState, setAppState] = useState<number>(States.DEFAULT);
  const prevAppState = usePrevious(appState);
  const [logList, setLogList] = useState<Event[]>([]);
  const backgroundStyle: any[] = [styles.container];
  applyStyle(backgroundStyle, appState);

  useEffect(() => {
    async function initEventList() {
      console.log('initEventList');
      const eventList: string | null = await AsyncStorage.getItem('eventList');
      if (eventList) {
        try {
          const parsedList = JSON.parse(eventList);
          console.log('initEventList: setting initial list of size', parsedList.length);
          const newList = [{code: EVENT_CODE.EVENT_LIST_INITIALIZED, timestamp: new Date()}, ...parsedList];
          setLogList(newList);
        } catch(err) {
          console.log('initEventList: error parsing', eventList, err);
        }
      }
    }
    initEventList();
  }, [])

  useEffect(() => {
    function setTimerAndThenFireEvent(eventCode: number, duration: number, newState: number) {
      setTimeout(() => {
        const newList = [{code: eventCode, timestamp: new Date()}, ...logList];
        setLogList(newList);
        AsyncStorage.setItem('eventList', JSON.stringify(newList));
        setAppState(newState);
        if (Platform.OS === 'web') {
          window.alert(EVENT_CODE_TO_NAME[eventCode]);
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
          const newList = [{code: EVENT_CODE.POMODORO_STARTED, timestamp: new Date()}, ...logList];
          setLogList(newList);
          AsyncStorage.setItem('eventList', JSON.stringify(newList));
          setAppState(States.POMODORO_RUNNING);
        }
      }}>
        <Text>Press!</Text>
      </Pressable>
      <Pressable style={[styles.basicButton, styles.startBreakButton]} onPress={() => {
        if (appState !== States.BREAK_RUNNING) {
          const newList = [{code: EVENT_CODE.BREAK_STARTED, timestamp: new Date()}, ...logList];
          setLogList(newList);
          AsyncStorage.setItem('eventList', JSON.stringify(newList));
          setAppState(States.BREAK_RUNNING);
        }
      }}>
        <Text>Break!</Text>
      </Pressable>
      <View>{logList.map(event => (
        <Text>{EVENT_CODE_TO_NAME[event.code] + ' | ' + new Date(event.timestamp).toISOString()}</Text>
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
