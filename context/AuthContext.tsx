import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { getSession, getUser } from '@/services/authService';
import { supabase } from '@/services/supabaseClient';

// Types
type AuthContextType = {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  signOut: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  initialized: false,
  signOut: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize the auth state
    const initializeAuth = async () => {
      try {
        const currentSession = await getSession();
        setSession(currentSession);
        
        if (currentSession) {
          const currentUser = await getUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);

        if (newSession) {
          const newUser = await getUser();
          setUser(newUser);
          
          // Navigate to home when signed in
          if (event === 'SIGNED_IN') {
            router.replace('/');
          }
        } else {
          setUser(null);
          
          // Navigate to login when signed out
          if (event === 'SIGNED_OUT') {
            router.replace('/auth/login');
          }
        }
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        initialized,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
