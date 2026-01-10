import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { BlurView } from '@/components/ui/BlurView';
import { colors, spacing, radius, typography } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const { signIn, signInWithOAuth, signInWithGoogleOAuth } = useAuth();
  const theme = useColorScheme() ?? 'dark';

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    const { error } = await signInWithOAuth(provider);
    setLoading(false);

    if (error) {
      Alert.alert('OAuth Failed', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogleOAuth();
    setGoogleLoading(false);

    if (error) {
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background.dark, colors.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <AnimatedContainer animation="fadeIn" delay={100}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[colors.primary[400], colors.primary[600]]}
                style={styles.logoGradient}
              >
                <Text style={styles.logoIcon}>✓</Text>
              </LinearGradient>
              <Text style={styles.logoText}>STURDY</Text>
              <Text style={styles.subtitle}>Welcome back</Text>
            </View>
          </AnimatedContainer>

          {/* Login Form */}
          <AnimatedContainer animation="slideUp" delay={200}>
            <BlurView intensity="light" tint="dark" style={styles.formCard}>
              <View style={styles.formContent}>
                <Text style={styles.formTitle}>Sign in to continue</Text>

                <AnimatedInput
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                  error={emailError}
                />

                <AnimatedInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!loading}
                  error={passwordError}
                />

                <AnimatedButton
                  label="Forgot password?"
                  variant="ghost"
                  size="sm"
                  style={styles.forgotButton}
                  onPress={() => Alert.alert('Coming Soon', 'Password reset will be available soon')}
                />

                <AnimatedButton
                  label="Sign In"
                  variant="primary"
                  size="lg"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading || googleLoading}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onPress={handleGoogleSignIn}
                  loading={googleLoading}
                  disabled={loading || googleLoading}
                  style={styles.googleButton}
                >
                  <View style={styles.googleButtonContent}>
                    <Text style={styles.googleLogo}>G</Text>
                    <Text style={styles.googleButtonText}>
                      {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Text>
                  </View>
                </AnimatedButton>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or try other methods</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.oauthContainer}>
                  <AnimatedButton
                    variant="outline"
                    size="md"
                    style={{ flex: 1 }}
                    onPress={() => handleOAuthLogin('apple')}
                    disabled={loading || googleLoading}
                  >
                    <Text style={styles.oauthText}>Apple</Text>
                  </AnimatedButton>
                </View>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <AnimatedButton
                    label="Sign Up"
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push('/(auth)/signup')}
                    disabled={loading || googleLoading}
                  />
                </View>
              </View>
            </BlurView>
          </AnimatedContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoIcon: {
    color: '#fff',
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  logoText: {
    color: '#fff',
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.gray[400],
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
  formCard: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  formContent: {
    padding: spacing.xl,
  },
  formTitle: {
    color: '#fff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: colors.gray[400],
    fontSize: typography.fontSize.sm,
    marginHorizontal: spacing.md,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  googleLogo: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  oauthContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  oauthText: {
    color: '#fff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: colors.gray[400],
    fontSize: typography.fontSize.sm,
  },
});
