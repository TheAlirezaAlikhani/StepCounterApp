import { useEffect, useCallback, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
      false,
      action,
    ],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  console.log('📦 [Storage] Setting key:', key, 'value:', value ? 'exists' : 'null');
  
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
      console.log('✅ [Storage] Web localStorage updated');
    } catch (e) {
      console.error('❌ [Storage] Web localStorage error:', e);
    }
  } else {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key);
        console.log('✅ [Storage] Native AsyncStorage item removed');
      } else {
        await AsyncStorage.setItem(key, value);
        console.log('✅ [Storage] Native AsyncStorage item saved');
      }
    } catch (e) {
      console.error('❌ [Storage] Native AsyncStorage error:', e);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  // Get from storage
  useEffect(() => {
    console.log('🔍 [Storage] Loading key:', key);
    
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          const value = localStorage.getItem(key);
          console.log('📖 [Storage] Web loaded:', value ? 'exists' : 'null');
          setState(value);
        }
      } catch (e) {
        console.error('❌ [Storage] Web localStorage unavailable:', e);
        setState(null);
      }
    } else {
      AsyncStorage.getItem(key)
        .then((value: string | null) => {
          console.log('📖 [Storage] Native loaded:', value ? 'exists' : 'null');
          setState(value);
        })
        .catch((e) => {
          console.error('❌ [Storage] Native AsyncStorage error:', e);
          setState(null);
        });
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
