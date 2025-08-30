import { Card } from '@/components/Card';
import { EnhancedButton } from '@/components/EnhancedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample flower schedule data
const SAMPLE_FLOWER_SCHEDULES = [
  {
    id: '1',
    personId: '1',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    nextDelivery: '2024-03-08',
    daysUntil: 5,
    occasion: "Women's Day",
    flowerType: 'Red Roses',
    isRecurring: true,
    estimatedCost: 45,
    status: 'scheduled'
  },
  {
    id: '2',
    personId: '3',
    personName: 'Sarah Williams',
    personImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    nextDelivery: '2024-03-18',
    daysUntil: 15,
    occasion: 'Birthday',
    flowerType: 'Mixed Bouquet',
    isRecurring: true,
    estimatedCost: 65,
    status: 'scheduled'
  },
  {
    id: '3',
    personId: '1',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    nextDelivery: '2024-05-12',
    daysUntil: 69,
    occasion: 'Birthday',
    flowerType: 'Pink Tulips',
    isRecurring: true,
    estimatedCost: 55,
    status: 'scheduled'
  },
  {
    id: '4',
    personId: '5',
    personName: 'Lisa Rodriguez',
    personImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    nextDelivery: '2024-06-15',
    daysUntil: 103,
    occasion: 'Anniversary',
    flowerType: 'White Lilies',
    isRecurring: true,
    estimatedCost: 75,
    status: 'scheduled'
  },
  {
    id: '5',
    personId: '2',
    personName: 'Michael Chen',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    nextDelivery: '2024-02-28',
    daysUntil: -2,
    occasion: 'Random Surprise',
    flowerType: 'Sunflowers',
    isRecurring: false,
    estimatedCost: 35,
    status: 'delivered'
  }
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'All', icon: 'flower' },
  { key: 'upcoming', label: 'Upcoming', icon: 'time' },
  { key: 'recurring', label: 'Recurring', icon: 'repeat' },
  { key: 'delivered', label: 'Delivered', icon: 'checkmark-circle' }
];

export default function FlowersScreen() {
  const [flowerSchedules] = useState(SAMPLE_FLOWER_SCHEDULES);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filteredSchedules = flowerSchedules.filter(schedule => {
    switch (selectedFilter) {
      case 'upcoming':
        return schedule.daysUntil >= 0 && schedule.status === 'scheduled';
      case 'recurring':
        return schedule.isRecurring;
      case 'delivered':
        return schedule.status === 'delivered';
      default:
        return true;
    }
  });
  
  const upcomingSchedules = flowerSchedules.filter(s => s.daysUntil >= 0 && s.daysUntil <= 30).sort((a, b) => a.daysUntil - b.daysUntil);
  const totalCost = filteredSchedules.reduce((sum, schedule) => sum + schedule.estimatedCost, 0);
  const scheduledCount = flowerSchedules.filter(s => s.status === 'scheduled').length;
  
  const renderFlowerCard = ({ item }: { item: typeof SAMPLE_FLOWER_SCHEDULES[0] }) => {
    const isOverdue = item.daysUntil < 0 && item.status === 'scheduled';
    const isUrgent = item.daysUntil >= 0 && item.daysUntil <= 7 && item.status === 'scheduled';
    
    return (
      <TouchableOpacity 
        style={styles.flowerCardContainer}
        onPress={() => router.push(`/flower-settings/${item.personId}`)}
        activeOpacity={0.9}
      >
        <Card variant={item.status === 'delivered' ? "subtle" : "elevated"} style={[
          styles.flowerCard,
          isOverdue && styles.overdueCard,
          isUrgent && styles.urgentCard
        ]}>
          <View style={styles.cardHeader}>
            <View style={styles.personSection}>
              <Image source={{ uri: item.personImage }} style={styles.personImage} />
              <View style={styles.personInfo}>
                <ThemedText type="h6" color="neutral.charcoal" style={styles.personName}>
                  {item.personName}
                </ThemedText>
                <ThemedText type="body2" color="neutral.darkGrey">
                  {item.occasion}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.statusSection}>
              {item.status === 'delivered' && (
                <View style={styles.deliveredBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                </View>
              )}
              {isOverdue && (
                <View style={styles.overdueBadge}>
                  <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                </View>
              )}
              {isUrgent && (
                <View style={styles.urgentBadge}>
                  <Ionicons name="time" size={16} color={theme.colors.warning} />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.flowerDetails}>
            <View style={styles.flowerTypeContainer}>
              <Ionicons name="flower" size={20} color={theme.colors.secondary.base} />
              <ThemedText type="body1" color="neutral.charcoal" style={styles.flowerType}>
                {item.flowerType}
              </ThemedText>
            </View>
            
            <View style={styles.flowerMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={theme.colors.neutral.darkGrey} />
                <ThemedText type="caption" color="neutral.darkGrey" style={styles.metaText}>
                  {new Date(item.nextDelivery).toLocaleDateString()}
                </ThemedText>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="cash-outline" size={14} color={theme.colors.neutral.darkGrey} />
                <ThemedText type="caption" color="neutral.darkGrey" style={styles.metaText}>
                  ${item.estimatedCost}
                </ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.daysContainer}>
              {item.status === 'delivered' ? (
                <ThemedText type="body2" color="success">
                  Delivered
                </ThemedText>
              ) : isOverdue ? (
                <ThemedText type="body2" color="error">
                  {Math.abs(item.daysUntil)} days overdue
                </ThemedText>
              ) : (
                <ThemedText type="body2" color={isUrgent ? "warning" : "primary.base"}>
                  {item.daysUntil === 0 ? 'Today' : `${item.daysUntil} days`}
                </ThemedText>
              )}
            </View>
            
            {item.isRecurring && (
              <View style={styles.recurringBadge}>
                <Ionicons name="repeat" size={12} color={theme.colors.neutral.darkGrey} />
                <ThemedText type="caption" color="neutral.darkGrey" style={styles.badgeText}>
                  Recurring
                </ThemedText>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const renderUpcomingItem = ({ item }: { item: typeof SAMPLE_FLOWER_SCHEDULES[0] }) => (
    <TouchableOpacity 
      style={styles.upcomingItem}
      onPress={() => router.push(`/flower-settings/${item.personId}`)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.secondary.light, theme.colors.secondary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.upcomingGradient}
      >
        <View style={styles.upcomingContent}>
          <View style={styles.upcomingInfo}>
            <ThemedText type="h6" color="neutral.white">
              {item.personName}
            </ThemedText>
            <ThemedText type="body2" color="neutral.lightGrey">
              {item.flowerType} • {item.occasion}
            </ThemedText>
          </View>
          <View style={styles.upcomingDays}>
            <ThemedText type="h4" color="neutral.white">
              {item.daysUntil}
            </ThemedText>
            <ThemedText type="caption" color="neutral.lightGrey">
              days
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  return (
    <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.secondary.base, theme.colors.primary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText type="h1" color="neutral.white" style={styles.headerTitle}>
              Flowers
            </ThemedText>
            <ThemedText type="body1" color="neutral.lightGrey" style={styles.headerSubtitle}>
              Schedule and track flower deliveries
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.addScheduleButton}
            onPress={() => router.push('/add-flower-schedule')}
          >
            <Ionicons name="add" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="secondary.base" style={styles.statValue}>
              {scheduledCount}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Scheduled
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="primary.base" style={styles.statValue}>
              ${totalCost}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Monthly Cost
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="warning" style={styles.statValue}>
              {upcomingSchedules.length}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              This Month
            </ThemedText>
          </Card>
        </View>
      </View>
      
      {/* Upcoming Section */}
      {upcomingSchedules.length > 0 && (
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" color="neutral.charcoal">
              Next 30 Days
            </ThemedText>
            <TouchableOpacity>
              <ThemedText type="body2" color="secondary.base">
                View Calendar
              </ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingSchedules}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderUpcomingItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.upcomingList}
          />
        </View>
      )}
      
      {/* Filter Buttons */}
      <View style={styles.filtersSection}>
        <FlatList
          data={FILTER_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(item.key)}
            >
              <Ionicons 
                name={item.icon as any} 
                size={16} 
                color={selectedFilter === item.key ? theme.colors.neutral.white : theme.colors.neutral.charcoal} 
              />
              <ThemedText 
                type="caption" 
                color={selectedFilter === item.key ? "neutral.white" : "neutral.charcoal"}
                style={styles.filterText}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {/* Flower Schedules */}
      <View style={styles.schedulesSection}>
        <FlatList
          data={filteredSchedules}
          renderItem={renderFlowerCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.schedulesList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="flower-outline" size={48} color={theme.colors.neutral.grey} />
              <ThemedText type="h5" color="neutral.darkGrey" style={styles.emptyTitle}>
                No flower schedules found
              </ThemedText>
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.emptySubtitle}>
                Set up automatic flower deliveries for your loved ones
              </ThemedText>
              <EnhancedButton
                title="Add Schedule"
                variant="primary"
                onPress={() => router.push('/add-flower-schedule')}
                style={styles.emptyButton}
              />
            </View>
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  headerSubtitle: {
    opacity: 0.9,
  },
  addScheduleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xxs,
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  statValue: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  upcomingSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  upcomingList: {
    paddingBottom: theme.spacing.sm,
  },
  upcomingItem: {
    width: 220,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  upcomingGradient: {
    padding: theme.spacing.md,
  },
  upcomingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingDays: {
    alignItems: 'center',
  },
  filtersSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  filtersList: {
    paddingBottom: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.lightGrey,
    marginRight: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.secondary.base,
  },
  filterText: {
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  schedulesSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  schedulesList: {
    paddingBottom: theme.spacing.xl,
  },
  flowerCardContainer: {
    marginBottom: theme.spacing.md,
  },
  flowerCard: {
    padding: theme.spacing.md,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  personSection: {
    flexDirection: 'row',
    flex: 1,
  },
  personImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
  },
  personInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  personName: {
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  deliveredBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overdueBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerDetails: {
    marginBottom: theme.spacing.sm,
  },
  flowerTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  flowerType: {
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  flowerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: theme.spacing.xxs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysContainer: {
    flex: 1,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.lightGrey,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    marginLeft: theme.spacing.xxs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: theme.spacing.lg,
  },
});
