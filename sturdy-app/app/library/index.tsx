import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { getScripts, getPlans } from '@/lib/queries';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import { colors, spacing, radius, typography } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type TabType = 'scripts' | 'plans';

export default function LibraryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() ?? 'light';

  const [activeTab, setActiveTab] = useState<TabType>('scripts');
  const [scripts, setScripts] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    if (!user) return;

    try {
      if (activeTab === 'scripts') {
        const scriptsData = await getScripts(user.id, 50);
        setScripts(scriptsData || []);
      } else {
        const plansData = await getPlans(user.id, 50);
        setPlans(plansData || []);
      }
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tab,
          activeTab === 'scripts' && styles.activeTab,
          { borderColor: activeTab === 'scripts' ? colors.primary[500] : Colors[theme].border },
        ]}
        onPress={() => setActiveTab('scripts')}
      >
        <ThemedText
          type="bodyStrong"
          style={{
            color: activeTab === 'scripts' ? colors.primary[500] : Colors[theme].mutedText,
          }}
        >
          SOS Scripts
        </ThemedText>
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          activeTab === 'plans' && styles.activeTab,
          { borderColor: activeTab === 'plans' ? colors.secondary[500] : Colors[theme].border },
        ]}
        onPress={() => setActiveTab('plans')}
      >
        <ThemedText
          type="bodyStrong"
          style={{
            color: activeTab === 'plans' ? colors.secondary[500] : Colors[theme].mutedText,
          }}
        >
          What If Plans
        </ThemedText>
      </Pressable>
    </View>
  );

  const renderScripts = () => {
    if (scripts.length === 0) {
      return (
        <AnimatedCard style={styles.emptyCard}>
          <ThemedText type="headline" style={{ textAlign: 'center', marginBottom: spacing.md }}>
            No Scripts Yet
          </ThemedText>
          <ThemedText type="body" style={{ textAlign: 'center', marginBottom: spacing.xl, color: Colors[theme].mutedText }}>
            Generate your first SOS script to see it here.
          </ThemedText>
          <AnimatedButton
            label="Create Script"
            variant="primary"
            size="lg"
            onPress={() => router.push('/scripts/new')}
          />
        </AnimatedCard>
      );
    }

    return (
      <View style={styles.listContainer}>
        {scripts.map((script) => (
          <AnimatedCard
            key={script.id}
            pressable
            onPress={() => router.push(`/library/script/${script.id}` as any)}
            style={styles.itemCard}
          >
            <View style={styles.itemHeader}>
              <ThemedText type="bodyStrong" numberOfLines={1}>
                {script.children?.name || 'Child'}
              </ThemedText>
              <View style={[styles.badge, { backgroundColor: colors.primary[100] }]}>
                <ThemedText type="footnote" style={{ color: colors.primary[700] }}>
                  {script.tone || 'Script'}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="body" numberOfLines={3} style={{ color: Colors[theme].mutedText, marginVertical: spacing.sm }}>
              {truncateText(script.situation || '', 150)}
            </ThemedText>
            <ThemedText type="footnote" style={{ color: Colors[theme].mutedText }}>
              {formatRelativeTime(script.created_at)}
            </ThemedText>
          </AnimatedCard>
        ))}
      </View>
    );
  };

  const renderPlans = () => {
    if (plans.length === 0) {
      return (
        <AnimatedCard style={styles.emptyCard}>
          <ThemedText type="headline" style={{ textAlign: 'center', marginBottom: spacing.md }}>
            No Plans Yet
          </ThemedText>
          <ThemedText type="body" style={{ textAlign: 'center', marginBottom: spacing.xl, color: Colors[theme].mutedText }}>
            Create your first What If plan to see it here.
          </ThemedText>
          <AnimatedButton
            label="Create Plan"
            variant="secondary"
            size="lg"
            onPress={() => router.push('/plans/new')}
          />
        </AnimatedCard>
      );
    }

    return (
      <View style={styles.listContainer}>
        {plans.map((plan) => (
          <AnimatedCard
            key={plan.id}
            pressable
            onPress={() => router.push(`/library/plan/${plan.id}` as any)}
            style={styles.itemCard}
          >
            <View style={styles.itemHeader}>
              <ThemedText type="bodyStrong" numberOfLines={1}>
                {plan.children?.name || 'Child'}
              </ThemedText>
              <View style={[styles.badge, { backgroundColor: colors.secondary[100] }]}>
                <ThemedText type="footnote" style={{ color: colors.secondary[700] }}>
                  {plan.frequency || 'Plan'}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="body" numberOfLines={3} style={{ color: Colors[theme].mutedText, marginVertical: spacing.sm }}>
              {truncateText(plan.struggle || '', 150)}
            </ThemedText>
            <ThemedText type="footnote" style={{ color: Colors[theme].mutedText }}>
              {formatRelativeTime(plan.created_at)}
            </ThemedText>
          </AnimatedCard>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GradientBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText type="title">Library 📚</ThemedText>
          <ThemedText type="body" style={{ color: Colors[theme].mutedText }}>
            Your saved scripts and plans
          </ThemedText>
        </View>

        {renderTabs()}

        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === 'scripts' ? renderScripts() : renderPlans()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderWidth: 2,
  },
  container: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  listContainer: {
    gap: spacing.md,
  },
  itemCard: {
    padding: spacing.lg,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
