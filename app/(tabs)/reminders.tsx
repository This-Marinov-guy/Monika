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

// Sample reminders data
const SAMPLE_REMINDERS = [
  {
    id: '1',
    personId: '3',
    personName: 'Sarah Williams',
    personImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    title: 'Birthday Reminder',
    description: "Sarah's birthday is coming up",
    date: '2024-03-18',
    time: '09:00',
    daysUntil: 12,
    type: 'birthday',
    isActive: true,
    hasGoogleCalendar: true,
    hasPushNotification: true,
    priority: 'high'
  },
  {
    id: '2',
    personId: '1',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    title: 'Anniversary Gift Shopping',
    description: 'Start looking for anniversary gift ideas',
    date: '2024-04-22',
    time: '10:00',
    daysUntil: 47,
    type: 'gift_shopping',
    isActive: true,
    hasGoogleCalendar: false,
    hasPushNotification: true,
    priority: 'medium'
  },
  {
    id: '3',
    personId: '1',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    title: 'Birthday Celebration',
    description: "Emma's birthday party",
    date: '2024-05-12',
    time: '18:00',
    daysUntil: 67,
    type: 'birthday',
    isActive: true,
    hasGoogleCalendar: true,
    hasPushNotification: true,
    priority: 'high'
  },
  {
    id: '4',
    personId: '5',
    personName: 'Lisa Rodriguez',
    personImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    title: 'Anniversary Dinner',
    description: 'Book restaurant for anniversary',
    date: '2024-06-10',
    time: '19:30',
    daysUntil: 96,
    type: 'anniversary',
    isActive: true,
    hasGoogleCalendar: true,
    hasPushNotification: false,
    priority: 'high'
  },
  {
    id: '5',
    personId: '2',
    personName: 'Michael Chen',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    title: 'Check on Michael',
    description: 'Catch up with Michael over coffee',
    date: '2024-03-25',
    time: '15:00',
    daysUntil: 19,
    type: 'general',
    isActive: false,
    hasGoogleCalendar: false,
    hasPushNotification: true,
    priority: 'low'
  }
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'All', icon: 'notifications', count: SAMPLE_REMINDERS.length },
  { key: 'active', label: 'Active', icon: 'notifications', count: SAMPLE_REMINDERS.filter(r => r.isActive).length },
  { key: 'urgent', label: 'Urgent', icon: 'alert-circle', count: SAMPLE_REMINDERS.filter(r => r.daysUntil <= 14 && r.isActive).length },
  { key: 'birthdays', label: 'Birthdays', icon: 'gift', count: SAMPLE_REMINDERS.filter(r => r.type === 'birthday').length }
];

const REMINDER_TYPE_ICONS = {
  birthday: 'gift',
  anniversary: 'heart',
  gift_shopping: 'bag',
  general: 'bookmark'
};

export default function RemindersScreen() {
  const [reminders] = useState(SAMPLE_REMINDERS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filteredReminders = reminders.filter(reminder => {
    switch (selectedFilter) {
      case 'active':
        return reminder.isActive;
      case 'urgent':
        return reminder.daysUntil <= 14 && reminder.isActive;
      case 'birthdays':
        return reminder.type === 'birthday';
      default:
        return true;
    }
  }).sort((a, b) => a.daysUntil - b.daysUntil);
  
  const upcomingReminders = reminders.filter(r => r.isActive && r.daysUntil <= 7).sort((a, b) => a.daysUntil - b.daysUntil);
  const activeCount = reminders.filter(r => r.isActive).length;
  const urgentCount = reminders.filter(r => r.daysUntil <= 14 && r.isActive).length;
  
  const renderReminderCard = ({ item }: { item: typeof SAMPLE_REMINDERS[0] }) => {
    const isUrgent = item.daysUntil <= 7 && item.isActive;
    const isOverdue = item.daysUntil < 0 && item.isActive;
    
    return (
      <TouchableOpacity 
        style={styles.reminderCardContainer}
        onPress={() => router.push(`/reminder-detail?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <Card variant={!item.isActive ? "subtle" : "elevated"} style={[
          styles.reminderCard,
          isOverdue && styles.overdueCard,
          isUrgent && styles.urgentCard,
          !item.isActive && styles.inactiveCard
        ]}>
          <View style={styles.cardHeader}>
            <View style={styles.reminderIcon}>
              <Ionicons 
                name={REMINDER_TYPE_ICONS[item.type] as any} 
                size={24} 
                color={item.isActive ? theme.colors.primary.base : theme.colors.neutral.grey} 
              />
            </View>
            
            <View style={styles.reminderInfo}>
              <ThemedText type="h6" color={item.isActive ? "neutral.charcoal" : "neutral.darkGrey"} style={styles.reminderTitle}>
                {item.title}
              </ThemedText>
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.reminderDescription}>
                {item.description}
              </ThemedText>
            </View>
            
            <View style={styles.statusSection}>
              {isOverdue && (
                <View style={styles.overdueBadge}>
                  <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                </View>
              )}
              {isUrgent && !isOverdue && (
                <View style={styles.urgentBadge}>
                  <Ionicons name="time" size={16} color={theme.colors.warning} />
                </View>
              )}
              {!item.isActive && (
                <View style={styles.inactiveBadge}>
                  <Ionicons name="pause-circle" size={16} color={theme.colors.neutral.grey} />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.personSection}>
            <Image source={{ uri: item.personImage }} style={styles.personImage} />
            <View style={styles.personInfo}>
              <ThemedText type="body2" color="neutral.charcoal" style={styles.personName}>
                {item.personName}
              </ThemedText>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTime}>
                  <Ionicons name="calendar-outline" size={14} color={theme.colors.neutral.darkGrey} />
                  <ThemedText type="caption" color="neutral.darkGrey" style={styles.dateTimeText}>
                    {new Date(item.date).toLocaleDateString()}
                  </ThemedText>
                </View>
                <View style={styles.dateTime}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.neutral.darkGrey} />
                  <ThemedText type="caption" color="neutral.darkGrey" style={styles.dateTimeText}>
                    {item.time}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.daysContainer}>
              {!item.isActive ? (
                <ThemedText type="body2" color="neutral.grey">
                  Inactive
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
            
            <View style={styles.notificationBadges}>
              {item.hasPushNotification && (
                <View style={styles.pushBadge}>
                  <Ionicons name="notifications" size={12} color={theme.colors.secondary.base} />
                </View>
              )}
              {item.hasGoogleCalendar && (
                <View style={styles.calendarBadge}>
                  <Ionicons name="calendar" size={12} color={theme.colors.primary.base} />
                </View>
              )}
            </View>
            
            <View style={styles.priorityBadge}>
              <ThemedText type="caption" color={
                item.priority === 'high' ? 'error' : 
                item.priority === 'medium' ? 'warning' : 
                'neutral.darkGrey'
              }>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </ThemedText>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const renderUpcomingItem = ({ item }: { item: typeof SAMPLE_REMINDERS[0] }) => (
    <TouchableOpacity 
      style={styles.upcomingItem}
      onPress={() => router.push(`/reminder-detail?id=${item.id}`)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.primary.light, theme.colors.primary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.upcomingGradient}
      >
        <View style={styles.upcomingContent}>
          <View style={styles.upcomingIcon}>
            <Ionicons 
              name={REMINDER_TYPE_ICONS[item.type] as any} 
              size={20} 
              color={theme.colors.neutral.white} 
            />
          </View>
          <View style={styles.upcomingInfo}>
            <ThemedText type="h6" color="neutral.white" numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText type="body2" color="neutral.lightGrey" numberOfLines={1}>
              {item.personName}
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
        colors={[theme.colors.primary.base, theme.colors.secondary.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText type="h1" color="neutral.white" style={styles.headerTitle}>
              Reminders
            </ThemedText>
            <ThemedText type="body1" color="neutral.lightGrey" style={styles.headerSubtitle}>
              Stay on top of important dates and tasks
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/reminder-settings')}
          >
            <Ionicons name="settings" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="primary.base" style={styles.statValue}>
              {activeCount}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Active
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="warning" style={styles.statValue}>
              {urgentCount}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Urgent
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="secondary.base" style={styles.statValue}>
              {upcomingReminders.length}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              This Week
            </ThemedText>
          </Card>
        </View>
      </View>
      
      {/* Upcoming Section */}
      {upcomingReminders.length > 0 && (
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" color="neutral.charcoal">
              Next 7 Days
            </ThemedText>
            <TouchableOpacity>
              <ThemedText type="body2" color="primary.base">
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingReminders}
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
              <View style={[
                styles.filterCount,
                selectedFilter === item.key && styles.filterCountActive
              ]}>
                <ThemedText 
                  type="caption" 
                  color={selectedFilter === item.key ? "primary.base" : "neutral.white"}
                  style={styles.filterCountText}
                >
                  {item.count}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {/* Reminders List */}
      <View style={styles.remindersSection}>
        <FlatList
          data={filteredReminders}
          renderItem={renderReminderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.remindersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={48} color={theme.colors.neutral.grey} />
              <ThemedText type="h5" color="neutral.darkGrey" style={styles.emptyTitle}>
                No reminders found
              </ThemedText>
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.emptySubtitle}>
                Set up reminders to never miss important dates
              </ThemedText>
              <EnhancedButton
                title="Add Reminder"
                variant="primary"
                onPress={() => router.push('/add-reminder')}
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
  settingsButton: {
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
    width: 240,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  upcomingGradient: {
    padding: theme.spacing.md,
  },
  upcomingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  upcomingInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
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
    backgroundColor: theme.colors.primary.base,
  },
  filterText: {
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  filterCount: {
    marginLeft: theme.spacing.xs,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.neutral.darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: theme.colors.neutral.white,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  remindersSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  remindersList: {
    paddingBottom: theme.spacing.xl,
  },
  reminderCardContainer: {
    marginBottom: theme.spacing.md,
  },
  reminderCard: {
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
  inactiveCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  reminderInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  reminderTitle: {
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  reminderDescription: {
    marginBottom: theme.spacing.xs,
  },
  statusSection: {
    alignItems: 'flex-end',
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
  inactiveBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  personImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontWeight: '500',
    marginBottom: theme.spacing.xxs,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
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
  notificationBadges: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.sm,
  },
  pushBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xxs,
  },
  calendarBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    backgroundColor: theme.colors.neutral.lightGrey,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.full,
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
