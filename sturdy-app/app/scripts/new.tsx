import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { getChildren } from '@/lib/queries';
import { ToneType, Child } from '@/lib/types';
import { colors, spacing, radius, typography } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function NewScriptScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState<ToneType>('Calm');
  const [loading, setLoading] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(true);

  const tones: ToneType[] = ['Calm', 'Playful', 'Firm', 'Empathetic'];

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
    if (!situation.trim()) {
      Alert.alert('Required', 'Please describe what\'s happening');
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
      // Call API route to generate script
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          situation: situation.trim(),
          childId: selectedChildId,
          tone,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const script = await response.json();
      
      // Navigate to script result screen with the script data
      router.push({
        pathname: '/library/script/[id]',
        params: { id: script.id },
      });
    } catch (error) {
      console.error('Error generating script:', error);
      Alert.alert('Error', 'Failed to generate script. Please try again.');
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
              You need to add at least one child before generating scripts.
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
              Get SOS Script 🆘
            </ThemedText>
            
            <ThemedText type="body" style={[styles.subtitle, { color: Colors[theme].mutedText }]}>
              Describe what's happening right now. We'll give you calm, evidence-based words to say.
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

              {/* Situation Text Area */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  What's happening?
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
                    value={situation}
                    onChangeText={setSituation}
                    placeholder="E.g., My child is having a meltdown at the grocery store..."
                    placeholderTextColor={theme === 'dark' ? colors.gray[500] : colors.gray[400]}
                    multiline
                    numberOfLines={6}
                    style={[
                      styles.textArea,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Tone Selector */}
              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  Tone
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
                    selectedValue={tone}
                    onValueChange={(value) => setTone(value as ToneType)}
                    style={[
                      styles.picker,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                  >
                    {tones.map((t) => (
                      <Picker.Item key={t} label={t} value={t} />
                    ))}
                  </Picker>
                </View>
              </View>

              <AnimatedButton
                label="Generate Script"
                variant="primary"
                size="lg"
                onPress={handleGenerate}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              />
            </View>

            <ThemedText type="footnote" style={[styles.note, { color: Colors[theme].mutedText }]}>
              Your script will be saved to your library. This usually takes 5-10 seconds.
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
    minHeight: 120,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  note: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
