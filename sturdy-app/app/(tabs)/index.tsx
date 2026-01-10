import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';

import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { colors, spacing, radius, typography, gradients as themeGradients } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/lib/auth-context';
import { getScripts, getProfile } from '@/lib/queries';
import { formatRelativeTime, truncateText } from '@/lib/utils';

const quickActions = [
  {
    title: 'Get SOS Script',
    description: 'Generate calm words for this moment',
    icon: '🆘',
    color: colors.primary[500],
    route: '/scripts/new',
  },
  {
    title: 'Create What If Plan',
    description: 'Prepare for recurring struggles',
    icon: '📋',
    color: colors.secondary[500],
    route: '/plans/new',
  },
  {
    title: 'View Library',
    description: 'Browse your saved scripts & plans',
    icon: '📚',
    color: colors.accent[500],
    route: '/library',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const { user } = useAuth();
  
  const [userName, setUserName] = useState('');
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [profile, scripts] = await Promise.all([
        getProfile(user.id),
        getScripts(user.id, 3),
      ]);
      
      setUserName(profile.email?.split('@')[0] || 'there');
      setRecentScripts(scripts || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GradientBackground colors={[themeGradients.primary[0], themeGradients.primary[1], Colors[theme].background]} />
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Welcome Section */}
          <AnimatedContainer animation="fadeIn" delay={100}>
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeHeader}>
                <HelloWave />
                <ThemedText type="title">
                  Hi, {userName}!
                </ThemedText>
              </View>
              <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                What do you need help with today?
              </ThemedText>
            </View>
          </AnimatedContainer>

          {/* Quick Actions */}
          <AnimatedContainer animation="slideUp" delay={200}>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <AnimatedCard
                  key={action.title}
                  pressable
                  onPress={() => router.push(action.route as any)}
                  style={styles.actionCard}
                >
                  <View style={styles.actionCardContent}>
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                    <View style={styles.actionTextContainer}>
                      <ThemedText type="headline">{action.title}</ThemedText>
                      <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
                        {action.description}
                      </ThemedText>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>
          </AnimatedContainer>

          {/* Recent Scripts */}
          {recentScripts.length > 0 && (
            <AnimatedContainer animation="slideUp" delay={300}>
              <AnimatedCard>
                <View style={styles.sectionHeader}>
                  <ThemedText type="headline">Recent Scripts</ThemedText>
                  <AnimatedButton
                    label="View All"
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push('/library')}
                  />
                </View>
                
                <View style={styles.scriptsContainer}>
                  {recentScripts.map((script, index) => (
                    <AnimatedCard
                      key={script.id}
                      pressable
                      onPress={() => router.push(`/library/script/${script.id}` as any)}
                      style={styles.scriptCard}
                    >
                      <ThemedText type="bodyStrong" numberOfLines={1}>
                        {script.children?.name || 'Child'}
                      </ThemedText>
                      <ThemedText type="body" numberOfLines={2} style={{ color: Colors[theme].mutedText }}>
                        {truncateText(script.situation || '', 80)}
                      </ThemedText>
                      <ThemedText type="footnote" style={{ color: Colors[theme].mutedText }}>
                        {formatRelativeTime(script.created_at)}
                      </ThemedText>
                    </AnimatedCard>
                  ))}
                </View>
              </AnimatedCard>
            </AnimatedContainer>
          )}

          {/* Safety Notice */}
          <AnimatedContainer animation="fadeIn" delay={400}>
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

const styles = StyleSheet.create({
  welcomeSection: {
    gap: spacing.sm,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionsContainer: {
    gap: spacing.md,
  },
  actionCard: {
    padding: spacing.lg,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: typography.fontSize['4xl'],
  },
  actionTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scriptsContainer: {
    gap: spacing.sm,
  },
  scriptCard: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  safetyNotice: {
    padding: spacing.md,
  },
});
