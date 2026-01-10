import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { getChildren } from '@/lib/queries';
import { configureGoogleSignIn } from '@/lib/google-auth';

// Google Sign-In Configuration
const GOOGLE_WEB_CLIENT_ID = '26234553124-ch542hp71c0qe8rce76alf32vga7lfs4.apps.googleusercontent.com';

// Configure Google Sign-In on app mount
configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { session, loading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    async function checkOnboardingStatus() {
      if (session && user && !inAuthGroup && !inOnboarding) {
        setCheckingOnboarding(true);
        try {
          const children = await getChildren(user.id);
          if (children.length === 0) {
            // No children, redirect to onboarding
            router.replace('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    }

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Check if onboarding is needed
      checkOnboardingStatus();
    }
  }, [session, loading, segments, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
