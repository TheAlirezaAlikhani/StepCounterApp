import { use, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

interface AuthContextType {
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

/**
 * Hook to access the authentication session.
 * Must be used within a SessionProvider.
 */
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

/**
 * SessionProvider wraps the app and provides authentication context.
 * Uses expo-secure-store for secure token storage on native devices.
 */
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  console.log('🔐 [SessionProvider] State:', { isLoading, hasSession: !!session });

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          console.log('🔑 [SessionProvider] signIn called');
          console.log('   Token length:', token.length);
          // Store the session token securely
          setSession(token);
          console.log('✅ [SessionProvider] Session stored');
        },
        signOut: () => {
          console.log('🚪 [SessionProvider] signOut called');
          // Clear the session
          setSession(null);
          console.log('✅ [SessionProvider] Session cleared');
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

