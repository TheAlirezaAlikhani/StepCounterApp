import { SplashScreen } from 'expo-router';
import { useSession } from '../context/ctx';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * SplashScreenController manages the splash screen visibility.
 * It keeps the splash screen visible until authentication state is loaded.
 */
export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}

