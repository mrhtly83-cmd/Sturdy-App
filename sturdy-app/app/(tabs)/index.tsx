import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Collapsible } from '@/components/ui/collapsible';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Gradients, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const highlights = [
  {
    title: 'Guided scripts',
    description: 'Generate calm, attachment-informed words in seconds.',
  },
  {
    title: 'Responsive layouts',
    description: 'Feels at home on phones and tablets with adaptive spacing.',
  },
  {
    title: 'Soothing visuals',
    description: 'Glass surfaces, soft gradients, and micro-interactions.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView variant="plain" style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Gradients.primary[0], Gradients.primary[1], Colors[theme].background]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: Spacing.gutter,
            paddingBottom: Spacing.gutter * 1.5,
            gap: Spacing.lg,
          }}
        >
          <AnimatedCard variant="glass" radius="lg" shadow="medium">
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
                  onPress={() => router.push('/(auth)/signup')}
                />
                <AnimatedButton
                  variant="ghost"
                  label="I already have an account"
                  onPress={() => router.push('/(auth)/login')}
                />
              </View>
              <View style={styles.badgesRow}>
                <Badge text="Attachment Theory" />
                <Badge text="IFS-informed" />
                <Badge text="Responsive layouts" />
              </View>
            </BlurView>
          </AnimatedCard>

          <View style={styles.row}>
            {highlights.map((item, index) => (
              <AnimatedCard key={item.title} delay={index * 80} style={{ flex: 1 }}>
                <ThemedText type="headline">{item.title}</ThemedText>
                <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                  {item.description}
                </ThemedText>
              </AnimatedCard>
            ))}
          </View>

          <AnimatedCard delay={180}>
            <ThemedText type="headline">Micro-interactions & motion</ThemedText>
            <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
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
            </Collapsible>
          </AnimatedCard>

          <AnimatedCard delay={240}>
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

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 320 }}
          >
            <ThemedText type="footnote" style={{ color: Colors[theme].mutedText, textAlign: 'center' }}>
              Safety first: Sturdy is coaching, not therapy. Crisis? In the US, call 988 or text 741741.
            </ThemedText>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Badge({ text }: { text: string }) {
  const theme = useColorScheme() ?? 'light';
  return (
    <ThemedView
      variant="glass"
      radius="pill"
      style={{
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors[theme].border,
      }}
    >
      <ThemedText type="callout" style={{ color: Colors[theme].mutedText }}>
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
    borderRadius: 20,
    padding: Spacing.xl,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroTitle: {
    marginTop: Spacing.sm,
  },
  heroCtas: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
});
