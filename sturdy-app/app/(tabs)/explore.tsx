import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Gradients, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/lib/auth-context';

const utilities = [
  'Spacing scale (4-28)',
  'Radii (10-24)',
  'Soft/medium shadows',
  'Glass + card surfaces',
  'Responsive typography',
  'Moti micro-interactions',
];

export default function TabTwoScreen() {
  const { user, signOut } = useAuth();
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView variant="plain" style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Gradients.accent[0], Gradients.accent[1], Colors[theme].background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedCard variant="glass" radius="lg" shadow="medium">
          <BlurView intensity={40} tint={theme === 'light' ? 'light' : 'dark'} style={styles.header}>
            <View style={styles.headerRow}>
              <View style={{ gap: Spacing.xs }}>
                <ThemedText type="headline">Design system</ThemedText>
                <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                  Explore the new calming palette, responsive type, and motion primitives.
                </ThemedText>
              </View>
              <LinearGradient colors={Gradients.warm} style={styles.avatarGradient}>
                <ThemedText type="title" style={{ color: '#0F172A' }}>
                  {user?.email?.charAt(0).toUpperCase() ?? 'S'}
                </ThemedText>
              </LinearGradient>
            </View>
          </BlurView>
        </AnimatedCard>

        <AnimatedCard delay={80}>
          <ThemedText type="headline">Utilities & tokens</ThemedText>
          <View style={styles.utilityGrid}>
            {utilities.map((item) => (
              <ThemedView key={item} variant="muted" radius="pill" style={styles.utilityPill}>
                <ThemedText type="caption" style={{ color: Colors[theme].mutedText }}>
                  {item}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
          <Collapsible title="Responsive helpers">
            <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
              Use `responsiveFont`, `responsiveSpacing`, and `useResponsiveValue` from the new
              helper to adapt padding, sizing, and type to any screen.
            </ThemedText>
          </Collapsible>
        </AnimatedCard>

        <AnimatedCard delay={140}>
          <ThemedText type="headline">Motion-ready components</ThemedText>
          <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginBottom: Spacing.sm }}>
            Cards, buttons, and accordions ship with built-in fade/scale transitions via Moti and
            Reanimated.
          </ThemedText>
          <View style={styles.row}>
            <AnimatedButton label="Primary" onPress={() => {}} />
            <AnimatedButton variant="ghost" label="Ghost" onPress={() => {}} />
          </View>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <ThemedText type="headline">Account</ThemedText>
          <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
            Signed in as {user?.email ?? 'guest'}
          </ThemedText>
          <AnimatedButton
            variant="ghost"
            label="Sign out"
            onPress={async () => {
              await signOut();
            }}
            style={{ marginTop: Spacing.sm }}
          />
        </AnimatedCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.gutter,
    gap: Spacing.lg,
    paddingBottom: Spacing.gutter * 1.5,
  },
  header: {
    borderRadius: 18,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  utilityPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
});
