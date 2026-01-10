import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { getChildren, deleteChild } from '@/lib/queries';
import { Child } from '@/lib/types';
import { calculateAge, formatDate } from '@/lib/utils';
import { colors, spacing, radius } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChildren();
  }, [user]);

  const loadChildren = async () => {
    if (!user) return;

    try {
      const data = await getChildren(user.id);
      setChildren(data);
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChildren();
  };

  const handleDeleteChild = (childId: string, childName: string) => {
    Alert.alert(
      'Delete Child',
      `Are you sure you want to delete ${childName}? This will also delete all associated scripts and plans.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChild(childId);
              loadChildren();
              Alert.alert('Success', 'Child deleted successfully');
            } catch (error) {
              console.error('Error deleting child:', error);
              Alert.alert('Error', 'Failed to delete child');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ThemedText type="title" style={styles.header}>
            Settings ⚙️
          </ThemedText>

          {/* User Profile */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Your Profile
            </ThemedText>
            <View style={styles.profileInfo}>
              <ThemedText type="bodyStrong">Email</ThemedText>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                {user?.email || 'Not available'}
              </ThemedText>
            </View>
          </AnimatedCard>

          {/* Children Management */}
          <AnimatedCard style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="headline">Your Children</ThemedText>
              <AnimatedButton
                label="Add Child"
                variant="ghost"
                size="sm"
                onPress={() => router.push('/onboarding')}
              />
            </View>

            {children.length === 0 ? (
              <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginTop: spacing.sm }}>
                No children added yet. Add one to get started!
              </ThemedText>
            ) : (
              <View style={styles.childrenList}>
                {children.map((child) => (
                  <AnimatedCard key={child.id} style={styles.childCard}>
                    <View style={styles.childInfo}>
                      <View style={{ flex: 1 }}>
                        <ThemedText type="bodyStrong">{child.name}</ThemedText>
                        <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                          Age: {calculateAge(child.birth_date)} • {child.neurotype}
                        </ThemedText>
                        <ThemedText type="footnote" style={{ color: Colors[theme].mutedText }}>
                          Birth date: {child.birth_date ? formatDate(child.birth_date) : 'Not set'}
                        </ThemedText>
                      </View>
                      <AnimatedButton
                        label="Delete"
                        variant="ghost"
                        size="sm"
                        onPress={() => handleDeleteChild(child.id, child.name || 'this child')}
                      />
                    </View>
                  </AnimatedCard>
                ))}
              </View>
            )}
          </AnimatedCard>

          {/* App Settings */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              App Settings
            </ThemedText>
            
            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <ThemedText type="bodyStrong">Notifications</ThemedText>
                <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                  Coming soon
                </ThemedText>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <ThemedText type="bodyStrong">Default Tone</ThemedText>
                <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                  Coming soon
                </ThemedText>
              </View>
            </View>
          </AnimatedCard>

          {/* Safety Resources */}
          <AnimatedCard style={styles.section}>
            <ThemedText type="headline" style={styles.sectionTitle}>
              Safety Resources
            </ThemedText>
            <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginBottom: spacing.sm }}>
              Sturdy is coaching, not therapy. In a crisis:
            </ThemedText>
            <View style={styles.resourcesList}>
              <ThemedText type="body">🇺🇸 US: Call 988 (Suicide & Crisis Lifeline)</ThemedText>
              <ThemedText type="body">💬 Text 741741 (Crisis Text Line)</ThemedText>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText, marginTop: spacing.sm }}>
                For immediate danger, call 911 or your local emergency services.
              </ThemedText>
            </View>
          </AnimatedCard>

          {/* Sign Out */}
          <AnimatedButton
            label="Sign Out"
            variant="ghost"
            size="lg"
            onPress={handleSignOut}
            style={styles.signOutButton}
          />

          <ThemedText type="footnote" style={[styles.version, { color: Colors[theme].mutedText }]}>
            Sturdy v1.0.0 • Built with ❤️ for parents
          </ThemedText>
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
    marginBottom: spacing.xl,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileInfo: {
    gap: spacing.xs,
  },
  childrenList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  childCard: {
    padding: spacing.md,
  },
  childInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  resourcesList: {
    gap: spacing.xs,
  },
  signOutButton: {
    marginTop: spacing.xl,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
