import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { getChildren } from '@/lib/queries';
import { FrequencyType, Child } from '@/lib/types';
import { colors, spacing, radius, typography } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function NewPlanScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [struggle, setStruggle] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('Daily');
  const [triggers, setTriggers] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);

  const frequencies: FrequencyType[] = ['Daily', 'Weekly', 'Monthly'];

  useEffect(() => {
    loadChildren();
  }, [user]);

  const loadChildren = async () => {
    if (!user) return;
    
    setLoadingChildren(true);
    try {
      const data = await getChildren(user.id);
      setChildren(data);
      if (data.length > 0) {
        setSelectedChildId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      Alert.alert('Error', 'Failed to load children. Please try again.');
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleGenerate = async () => {
    if (!struggle.trim()) {
      Alert.alert('Required', 'Please describe the recurring struggle');
      return;
    }

    if (!selectedChildId) {
      Alert.alert('Required', 'Please select a child');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    setLoading(true);
    try {
      // Call API route to generate plan
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          struggle: struggle.trim(),
          childId: selectedChildId,
          frequency,
          triggers: triggers.trim(),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const plan = await response.json();
      
      // Navigate to plan result screen with the plan data
      router.push({
        pathname: '/library/plan/[id]',
        params: { id: plan.id },
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      Alert.alert('Error', 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingChildren) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GradientBackground />
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (children.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <GradientBackground />
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>
          <AnimatedCard style={{ padding: spacing.xl }}>
            <ThemedText type="title" style={{ textAlign: 'center', marginBottom: spacing.md }}>
              No Children Yet
            </ThemedText>
            <ThemedText type="body" style={{ textAlign: 'center', marginBottom: spacing.xl, color: Colors[theme].mutedText }}>
              You need to add at least one child before creating plans.
            </ThemedText>
            <AnimatedButton
              label="Go to Settings"
              variant="primary"
              size="lg"
              onPress={() => router.push('/(tabs)/explore')}
            />
          </AnimatedCard>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatedCard variant="glass" style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Create What If Plan 📋
            </ThemedText>
            
            <ThemedText type="body" style={[styles.subtitle, { color: Colors[theme].mutedText }]}>
              Prepare for recurring struggles with a comprehensive prevention, intervention, and de-escalation plan.
            </ThemedText>

            <View style={styles.form}>
              {/* Child Selector */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  Which child?
                </ThemedText>
                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: theme === 'dark' ? colors.gray[800] : colors.gray[100],
                      borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                    },
                  ]}
                >
                  <Picker
                    selectedValue={selectedChildId}
                    onValueChange={(value) => setSelectedChildId(value)}
                    style={[
                      styles.picker,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                  >
                    {children.map((child) => (
                      <Picker.Item key={child.id} label={child.name || 'Unnamed'} value={child.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Struggle Text Area */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  What struggle are you planning for?
                </ThemedText>
                <View
                  style={[
                    styles.textAreaContainer,
                    {
                      backgroundColor: theme === 'dark' ? colors.gray[800] : colors.gray[100],
                      borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                    },
                  ]}
                >
                  <TextInput
                    value={struggle}
                    onChangeText={setStruggle}
                    placeholder="E.g., Bedtime battles, morning transitions, screen time conflicts..."
                    placeholderTextColor={theme === 'dark' ? colors.gray[500] : colors.gray[400]}
                    multiline
                    numberOfLines={4}
                    style={[
                      styles.textArea,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Frequency Selector */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  How often does this happen?
                </ThemedText>
                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: theme === 'dark' ? colors.gray[800] : colors.gray[100],
                      borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                    },
                  ]}
                >
                  <Picker
                    selectedValue={frequency}
                    onValueChange={(value) => setFrequency(value as FrequencyType)}
                    style={[
                      styles.picker,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                  >
                    {frequencies.map((freq) => (
                      <Picker.Item key={freq} label={freq} value={freq} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Triggers Text Area */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  What triggers it? (Optional)
                </ThemedText>
                <View
                  style={[
                    styles.textAreaContainer,
                    {
                      backgroundColor: theme === 'dark' ? colors.gray[800] : colors.gray[100],
                      borderColor: theme === 'dark' ? colors.gray[700] : colors.gray[300],
                    },
                  ]}
                >
                  <TextInput
                    value={triggers}
                    onChangeText={setTriggers}
                    placeholder="E.g., Tiredness, hunger, transitions, certain activities..."
                    placeholderTextColor={theme === 'dark' ? colors.gray[500] : colors.gray[400]}
                    multiline
                    numberOfLines={3}
                    style={[
                      styles.textArea,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <AnimatedButton
                label="Generate Plan"
                variant="primary"
                size="lg"
                onPress={handleGenerate}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              />
            </View>

            <ThemedText type="footnote" style={[styles.note, { color: Colors[theme].mutedText }]}>
              Your plan will include prevention strategies, in-the-moment interventions, and de-escalation techniques.
            </ThemedText>
          </AnimatedCard>
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
  card: {
    padding: spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textAreaContainer: {
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  textArea: {
    fontSize: typography.fontSize.base,
    minHeight: 80,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  note: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
