import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ThemedText } from '@/components/themed-text';
import { VideoBackground } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { createChild } from '@/lib/queries';
import { NeurotypeType } from '@/lib/types';
import { colors, spacing, radius } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [neurotype, setNeurotype] = useState<NeurotypeType>('Neurotypical');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});

  const neurotypes: NeurotypeType[] = ['Neurotypical', 'ADHD', 'Autism', 'Other'];

  const validate = () => {
    const newErrors: { name?: string; birthDate?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your child\'s name';
    }

    const today = new Date();
    if (birthDate > today) {
      newErrors.birthDate = 'Birth date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to continue');
      return;
    }

    setLoading(true);
    try {
      await createChild(
        user.id,
        name.trim(),
        birthDate.toISOString().split('T')[0],
        neurotype
      );

      // Navigate to dashboard
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error creating child:', error);
      Alert.alert('Error', 'Failed to save child information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <VideoBackground 
      videoSource={null} // User needs to add onboarding.mp4 to assets/videos/
      showMuteToggle={true}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatedCard variant="glass" style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Welcome to Sturdy! 👋
            </ThemedText>
            
            <ThemedText type="body" style={[styles.subtitle, { color: Colors[theme].mutedText }]}>
              Let's start by adding your first child. You can add more children later in Settings.
            </ThemedText>

            <View style={styles.form}>
              <AnimatedInput
                label="Child's Name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
                autoComplete="name"
              />

              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  Birth Date
                </ThemedText>
                <AnimatedButton
                  label={formatDate(birthDate)}
                  variant="outline"
                  size="md"
                  onPress={() => setShowDatePicker(true)}
                />
                {errors.birthDate && (
                  <ThemedText type="footnote" style={styles.errorText}>
                    {errors.birthDate}
                  </ThemedText>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1990, 0, 1)}
                />
              )}

              <View style={styles.inputGroup}>
                <ThemedText type="bodyStrong" style={styles.label}>
                  Neurotype
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
                    selectedValue={neurotype}
                    onValueChange={(value) => setNeurotype(value as NeurotypeType)}
                    style={[
                      styles.picker,
                      { color: theme === 'dark' ? colors.gray[50] : colors.gray[900] },
                    ]}
                  >
                    {neurotypes.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              </View>

              <AnimatedButton
                label="Continue"
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              />
            </View>

            <ThemedText type="footnote" style={[styles.note, { color: Colors[theme].mutedText }]}>
              This information helps us provide age-appropriate and personalized guidance.
            </ThemedText>
          </AnimatedCard>
        </ScrollView>
      </SafeAreaView>
    </VideoBackground>
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
  submitButton: {
    marginTop: spacing.md,
  },
  note: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
  },
});
