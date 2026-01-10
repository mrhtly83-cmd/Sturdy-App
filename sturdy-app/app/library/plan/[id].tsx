import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { getPlan, deletePlan } from '@/lib/queries';
import { formatDate } from '@/lib/utils';
import { colors, spacing, radius } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await getPlan(id);
      setPlan(data);
    } catch (error) {
      console.error('Error loading plan:', error);
      Alert.alert('Error', 'Failed to load plan');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!plan) return;

    const textToCopy = `
**${plan.children?.name || 'Child'}'s What If Plan**
Struggle: ${plan.struggle}

**Prevention Strategies:**
${plan.prevention}

**In-the-Moment Intervention:**
${plan.intervention}

**De-escalation Techniques:**
${plan.escalation}
    `.trim();

    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Copied!', 'Plan copied to clipboard');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlan(id);
              router.back();
            } catch (error) {
              console.error('Error deleting plan:', error);
              Alert.alert('Error', 'Failed to delete plan');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GradientBackground />
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="title">{plan.children?.name || 'Child'}</ThemedText>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                {formatDate(plan.created_at)}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.secondary[100] }]}>
              <ThemedText type="body" style={{ color: colors.secondary[700] }}>
                {plan.frequency}
              </ThemedText>
            </View>
          </View>

          {/* Struggle */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Recurring Struggle
            </ThemedText>
            <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
              {plan.struggle}
            </ThemedText>
          </AnimatedCard>

          {/* Triggers */}
          {plan.triggers && (
            <AnimatedCard style={styles.section}>
              <ThemedText type="headline" style={styles.sectionTitle}>
                ⚡ Triggers
              </ThemedText>
              <ThemedText type="body">{plan.triggers}</ThemedText>
            </AnimatedCard>
          )}

          {/* Prevention */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              🛡️ Prevention Strategies
            </ThemedText>
            <ThemedText type="body">{plan.prevention}</ThemedText>
          </AnimatedCard>

          {/* Intervention */}
          <AnimatedCard style={[styles.section, styles.interventionSection]}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              🎯 In-the-Moment Intervention
            </ThemedText>
            <ThemedText type="body" style={styles.interventionText}>
              {plan.intervention}
            </ThemedText>
          </AnimatedCard>

          {/* Escalation */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              🌊 De-escalation Techniques
            </ThemedText>
            <ThemedText type="body">{plan.escalation}</ThemedText>
          </AnimatedCard>

          {/* Actions */}
          <View style={styles.actions}>
            <AnimatedButton
              label="Copy Plan"
              variant="secondary"
              size="lg"
              onPress={handleCopy}
            />

            <AnimatedButton
              label="Delete Plan"
              variant="ghost"
              size="md"
              onPress={handleDelete}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  interventionSection: {
    backgroundColor: colors.secondary[50],
    borderColor: colors.secondary[200],
    borderWidth: 2,
  },
  interventionText: {
    fontSize: 18,
    lineHeight: 28,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
