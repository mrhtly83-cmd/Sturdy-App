import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

interface VideoBackgroundProps {
  videoSource: any | null; // require() import, { uri: string }, or null for gradient only
  showMuteToggle?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  children?: React.ReactNode;
  fallbackGradient?: readonly [string, string, ...string[]];
}

/**
 * VideoBackground - Reusable video background component with gradient overlay
 * 
 * Features:
 * - Auto-playing, looping video
 * - Mute/unmute toggle (defaults to muted)
 * - Loading state with spinner
 * - Focus management (pauses when screen loses focus)
 * - Graceful error handling with fallback
 * - Gradient overlay for text readability
 * 
 * @param videoSource - Video source (use require() for local files)
 * @param showMuteToggle - Show mute/unmute button (default: true)
 * @param gradientColors - Overlay gradient colors (default: dark blue-gray)
 * @param children - Content to render on top of video
 * @param fallbackGradient - Gradient to show if video fails (default: dark blue-gray)
 */
export default function VideoBackground({ 
  videoSource, 
  showMuteToggle = true,
  gradientColors = [
    'rgba(15, 23, 42, 0.85)',  // Dark blue-gray (semi-transparent)
    'rgba(15, 23, 42, 0.95)',  // Darker at bottom
  ],
  fallbackGradient = [
    '#0F172A',  // Dark blue-gray (solid)
    '#1E293B',  // Lighter blue-gray
  ],
  children 
}: VideoBackgroundProps) {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(!!videoSource); // Only show loading if we have a video
  const [hasError, setHasError] = useState(false);

  // Play/pause video based on screen focus
  useFocusEffect(
    useCallback(() => {
      if (!hasError && videoSource) {
        videoRef.current?.playAsync();
      }
      
      return () => {
        if (videoSource) {
          videoRef.current?.pauseAsync();
        }
      };
    }, [hasError, videoSource])
  );

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: string) => {
    console.warn('Video failed to load:', error);
    setIsLoading(false);
    setHasError(true);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // Optional: handle playback status updates
    if (status.isLoaded && status.didJustFinish) {
      // Video finished playing, will loop automatically
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background - only render if videoSource is provided and no error */}
      {videoSource && !hasError && (
        <Video
          ref={videoRef}
          source={videoSource}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted={isMuted}
          onLoad={handleLoad}
          onError={handleError}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      )}
      
      {/* Gradient Overlay or Fallback Background */}
      <LinearGradient
        colors={hasError || !videoSource ? fallbackGradient : gradientColors}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Loading Indicator */}
      {isLoading && videoSource && !hasError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8A80" />
        </View>
      )}
      
      {/* Mute Toggle Button */}
      {showMuteToggle && videoSource && !hasError && !isLoading && (
        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => setIsMuted(!isMuted)}
          accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
          accessibilityRole="button"
        >
          <Ionicons 
            name={isMuted ? 'volume-mute' : 'volume-high'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      )}

      {/* Content on top of video */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  muteButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
    // Glassmorphism effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
