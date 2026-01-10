/**
 * Google Sign-In Helper for Supabase OAuth
 * Handles Google authentication flow and token exchange
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from './supabase';

/**
 * Configure Google Sign-In with Web Client ID
 * Must be called before using Google Sign-In
 * 
 * @param webClientId - Google OAuth Web Client ID from Google Cloud Console
 */
export function configureGoogleSignIn(webClientId: string) {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
  });
}

/**
 * Sign in with Google and authenticate with Supabase
 * 
 * @returns Promise with session data or error
 */
export async function signInWithGoogle() {
  try {
    // Check if device supports Google Play Services (Android)
    await GoogleSignin.hasPlayServices();

    // Trigger Google Sign-In flow
    const userInfo = await GoogleSignin.signIn();

    // Extract ID token from Google response
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    // Exchange Google ID token for Supabase session
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    // Handle specific error cases
    if (error.code === 'SIGN_IN_CANCELLED') {
      return { data: null, error: { message: 'Sign-in cancelled by user' } };
    }
    
    if (error.code === 'IN_PROGRESS') {
      return { data: null, error: { message: 'Sign-in already in progress' } };
    }
    
    if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      return { data: null, error: { message: 'Google Play Services not available' } };
    }

    // Generic error
    return { 
      data: null, 
      error: { 
        message: error.message || 'Google Sign-In failed. Please try again.' 
      } 
    };
  }
}

/**
 * Sign out from Google (clears Google session)
 */
export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
}

/**
 * Check if user is currently signed in with Google
 */
export async function isSignedInWithGoogle(): Promise<boolean> {
  try {
    const user = await GoogleSignin.getCurrentUser();
    return user !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get current Google user info (if signed in)
 */
export async function getCurrentGoogleUser() {
  try {
    return await GoogleSignin.getCurrentUser();
  } catch (error) {
    return null;
  }
}
