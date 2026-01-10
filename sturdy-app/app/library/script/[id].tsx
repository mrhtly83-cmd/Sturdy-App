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
import { getScript, deleteScript, updateScript } from '@/lib/queries';
import { formatDate } from '@/lib/utils';
import { colors, spacing, radius } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ScriptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScript();
  }, [id]);

  const loadScript = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await getScript(id);
      setScript(data);
    } catch (error) {
      console.error('Error loading script:', error);
      Alert.alert('Error', 'Failed to load script');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!script) return;

    const textToCopy = `
**Validation:**
${script.validation}

**Reframe:**
${script.reframe}

**What to Say:**
${script.script_text}

**Why This Works:**
${script.psych_insight}
    `.trim();

    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Copied!', 'Script copied to clipboard');
  };

  const handleMarkHelpful = async (helpful: boolean) => {
    if (!script) return;

    try {
      await updateScript(script.id, { user_helpful: helpful });
      setScript({ ...script, user_helpful: helpful });
      Alert.alert('Thank you!', 'Your feedback helps us improve');
    } catch (error) {
      console.error('Error updating script:', error);
      Alert.alert('Error', 'Failed to save feedback');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Script',
      'Are you sure you want to delete this script?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScript(id);
              router.back();
            } catch (error) {
              console.error('Error deleting script:', error);
              Alert.alert('Error', 'Failed to delete script');
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

  if (!script) {
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
              <ThemedText type="title">{script.children?.name || 'Child'}</ThemedText>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                {formatDate(script.created_at)}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.primary[100] }]}>
              <ThemedText type="body" style={{ color: colors.primary[700] }}>
                {script.tone}
              </ThemedText>
            </View>
          </View>

          {/* Situation */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Situation
            </ThemedText>
            <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
              {script.situation}
            </ThemedText>
          </AnimatedCard>

          {/* Validation */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              💗 Validation
            </ThemedText>
            <ThemedText type="body">{script.validation}</ThemedText>
          </AnimatedCard>

          {/* Reframe */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              🔄 Reframe
            </ThemedText>
            <ThemedText type="body">{script.reframe}</ThemedText>
          </AnimatedCard>

          {/* Script */}
          <AnimatedCard style={[styles.section, styles.scriptSection]}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              💬 What to Say
            </ThemedText>
            <ThemedText type="body" style={styles.scriptText}>
              {script.script_text}
            </ThemedText>
          </AnimatedCard>

          {/* Insight */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              🧠 Why This Works
            </ThemedText>
            <ThemedText type="body">{script.psych_insight}</ThemedText>
          </AnimatedCard>

          {/* Actions */}
          <View style={styles.actions}>
            <AnimatedButton
              label="Copy Script"
              variant="primary"
              size="lg"
              onPress={handleCopy}
            />

            <View style={styles.feedbackRow}>
              <ThemedText type="bodyStrong">Was this helpful?</ThemedText>
              <View style={styles.feedbackButtons}>
                <AnimatedButton
                  label={script.user_helpful === true ? '👍 Yes' : '👍'}
                  variant={script.user_helpful === true ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => handleMarkHelpful(true)}
                />
                <AnimatedButton
                  label={script.user_helpful === false ? '👎 No' : '👎'}
                  variant={script.user_helpful === false ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => handleMarkHelpful(false)}
                />
              </View>
            </View>

            <AnimatedButton
              label="Delete Script"
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
  scriptSection: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
    borderWidth: 2,
  },
  scriptText: {
    fontSize: 18,
    lineHeight: 28,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  feedbackRow: {
    gap: spacing.sm,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
