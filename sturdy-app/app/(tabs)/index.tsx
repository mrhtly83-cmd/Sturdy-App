import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Collapsible } from '@/components/ui/collapsible';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Gradients, Spacing } from '@/constants/theme';
import { colors, spacing, radius, typography, gradients as themeGradients } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const highlights = [
  {
    title: 'Guided scripts',
    description: 'Generate calm, attachment-informed words in seconds.',
    icon: '📝',
  },
  {
    title: 'Responsive layouts',
    description: 'Feels at home on phones and tablets with adaptive spacing.',
    icon: '📱',
  },
  {
    title: 'Soothing visuals',
    description: 'Glass surfaces, soft gradients, and micro-interactions.',
    icon: '✨',
  },
];

const features = [
  { label: 'Attachment Theory', color: colors.secondary[500] },
  { label: 'IFS-informed', color: colors.primary[500] },
  { label: 'Responsive design', color: colors.accent[500] },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      
      {/* Gradient Background */}
      <GradientBackground colors={[themeGradients.primary[0], themeGradients.primary[1], Colors[theme].background]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.xl,
            paddingBottom: spacing['2xl'],
            gap: spacing.lg,
          }}
        >
          {/* Hero Section */}
          <AnimatedContainer animation="fadeIn" delay={100}>
            <AnimatedCard variant="glass" radiusSize="lg" shadow="medium">
              <BlurView intensity={50} tint={theme === 'light' ? 'light' : 'dark'} style={styles.heroCard}>
                <View style={styles.heroHeader}>
                  <HelloWave />
                  <ThemedText type="caption" style={{ color: Colors[theme].mutedText }}>
                    Calm words on demand
                  </ThemedText>
                </View>
                
                <ThemedText type="display" style={styles.heroTitle}>
                  Sturdy is your pocket coach for crisis moments.
                </ThemedText>
                
                <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
                  Just describe the moment. We deliver an evidence-based script with validation,
                  reframes, and the exact words to say.
                </ThemedText>
                
                <View style={styles.heroCtas}>
                  <AnimatedButton
                    label="Generate a script"
                    variant="primary"
                    size="lg"
                    onPress={() => router.push('/(auth)/signup')}
                  />
                  <AnimatedButton
                    variant="ghost"
                    size="md"
                    label="I already have an account"
                    onPress={() => router.push('/(auth)/login')}
                  />
                </View>
                
                <View style={styles.badgesRow}>
                  {features.map((feature) => (
                    <Badge key={feature.label} text={feature.label} color={feature.color} />
                  ))}
                </View>
              </BlurView>
            </AnimatedCard>
          </AnimatedContainer>

          {/* Highlights Section */}
          <View style={styles.highlightsContainer}>
            {highlights.map((item, index) => (
              <AnimatedContainer key={item.title} animation="slideUp" delay={200 + index * 100}>
                <AnimatedCard
                  pressable
                  onPress={() => {}}
                  style={{ flex: 1 }}
                >
                  <View style={styles.highlightCard}>
                    <Text style={styles.highlightIcon}>{item.icon}</Text>
                    <ThemedText type="headline">{item.title}</ThemedText>
                    <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                      {item.description}
                    </ThemedText>
                  </View>
                </AnimatedCard>
              </AnimatedContainer>
            ))}
          </View>

          {/* Features Section */}
          <AnimatedContainer animation="slideUp" delay={500}>
            <AnimatedCard gradientBorder>
              <ThemedText type="headline">Micro-interactions & motion</ThemedText>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginTop: spacing.sm }}>
                Buttons, cards, and collapsibles now use Reanimated + Moti for subtle depth, scale,
                and fade transitions.
              </ThemedText>
              <Collapsible title="See what changed">
                <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
                  • Reanimated 3 + gesture handler installed and configured
                </ThemedText>
                <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
                  • Moti-powered buttons, cards, and accordions
                </ThemedText>
                <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
                  • Responsive spacing, typography scale, and glass surfaces
                </ThemedText>
                <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
                  • Comprehensive theme system with color palette and design tokens
                </ThemedText>
              </Collapsible>
            </AnimatedCard>
          </AnimatedContainer>

          {/* Button Variants Demo */}
          <AnimatedContainer animation="slideUp" delay={600}>
            <AnimatedCard>
              <ThemedText type="headline" style={{ marginBottom: spacing.md }}>
                Button Variants
              </ThemedText>
              <View style={styles.buttonDemoContainer}>
                <AnimatedButton label="Primary" variant="primary" size="md" onPress={() => {}} />
                <AnimatedButton label="Secondary" variant="secondary" size="md" onPress={() => {}} />
                <AnimatedButton label="Outline" variant="outline" size="md" onPress={() => {}} />
                <AnimatedButton label="Ghost" variant="ghost" size="md" onPress={() => {}} />
              </View>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginTop: spacing.md }}>
                Try tapping the buttons to feel the haptic feedback and smooth animations!
              </ThemedText>
            </AnimatedCard>
          </AnimatedContainer>

          {/* Responsive Pills */}
          <AnimatedContainer animation="fadeIn" delay={700}>
            <AnimatedCard>
              <ThemedText type="headline">Responsive examples</ThemedText>
              <View style={styles.pillRow}>
                <Pill text="Dynamic spacing" />
                <Pill text="Responsive typography" />
                <Pill text="Tablet-friendly cards" />
              </View>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                Resize the simulator to see adaptive padding, type scales, and layout shifts tuned for
                comfort on any device.
              </ThemedText>
            </AnimatedCard>
          </AnimatedContainer>

          {/* Safety Notice */}
          <AnimatedContainer animation="fadeIn" delay={800}>
            <View style={styles.safetyNotice}>
              <ThemedText type="footnote" style={{ color: Colors[theme].mutedText, textAlign: 'center' }}>
                Safety first: Sturdy is coaching, not therapy. Crisis? In the US, call 988 or text 741741.
              </ThemedText>
            </View>
          </AnimatedContainer>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Badge({ text, color }: { text: string; color?: string }) {
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView
      variant="glass"
      radius="pill"
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: color ?? Colors[theme].border,
      }}
    >
      <ThemedText type="callout" style={{ color: color ?? Colors[theme].mutedText }}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

function Pill({ text }: { text: string }) {
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView
      variant="muted"
      radius="pill"
      style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }}
    >
      <ThemedText type="caption" style={{ color: Colors[theme].mutedText }}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroTitle: {
    marginTop: spacing.sm,
  },
  heroCtas: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  highlightsContainer: {
    gap: spacing.md,
  },
  highlightCard: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  highlightIcon: {
    fontSize: typography.fontSize['4xl'],
    marginBottom: spacing.sm,
  },
  buttonDemoContainer: {
    gap: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  safetyNotice: {
    padding: spacing.md,
  },
});
