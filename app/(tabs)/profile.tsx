import { Card } from '@/components/Card';
import { EnhancedButton } from '@/components/EnhancedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample user data
const USER_DATA = {
  name: 'John Smith',
  email: 'john.smith@email.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
  memberSince: '2023',
  stats: {
    totalPeople: 6,
    totalGifts: 23,
    totalReminders: 8,
    completedTasks: 45
  },
  preferences: {
    pushNotifications: true,
    emailNotifications: false,
    calendarSync: true,
    autoFlowerOrders: true
  }
};

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'edit-profile', label: 'Edit Profile', icon: 'person-outline', route: '/edit-profile' },
      { id: 'change-password', label: 'Change Password', icon: 'lock-closed-outline', route: '/change-password' },
      { id: 'notification-settings', label: 'Notification Settings', icon: 'notifications-outline', route: '/reminder-settings' },
    ]
  },
  {
    title: 'Data',
    items: [
      { id: 'export-data', label: 'Export Data', icon: 'download-outline', action: 'export' },
      { id: 'import-data', label: 'Import Data', icon: 'cloud-upload-outline', action: 'import' },
      { id: 'backup', label: 'Backup & Sync', icon: 'cloud-outline', route: '/backup-settings' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help & FAQ', icon: 'help-circle-outline', route: '/help' },
      { id: 'contact', label: 'Contact Support', icon: 'mail-outline', action: 'contact' },
      { id: 'feedback', label: 'Send Feedback', icon: 'chatbubble-outline', action: 'feedback' },
    ]
  }
];

export default function ProfileScreen() {
  const handleMenuItemPress = (item: any) => {
    if (item.route) {
      router.push(item.route);
    } else if (item.action) {
      // Handle actions like export, import, contact, etc.
      console.log(`Action: ${item.action}`);
    }
  };

  const handleSignOut = () => {
    // Implement sign out logic
    router.replace('/auth/login');
  };

  const renderStatCard = (label: string, value: number, icon: string, color: string) => (
    <Card variant="subtle" style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <ThemedText type="h4" color="neutral.charcoal" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="caption" color="neutral.darkGrey" style={styles.statLabel}>
        {label}
      </ThemedText>
    </Card>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={item.icon} size={20} color={theme.colors.neutral.darkGrey} />
        </View>
        <ThemedText type="body1" color="neutral.charcoal" style={styles.menuLabel}>
          {item.label}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.neutral.grey} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container} backgroundColor="neutral.offWhite">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary.base, theme.colors.secondary.base]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
              <View style={styles.profileInfo}>
                <ThemedText type="h2" color="neutral.white" style={styles.userName}>
                  {USER_DATA.name}
                </ThemedText>
                <ThemedText type="body1" color="neutral.lightGrey" style={styles.userEmail}>
                  {USER_DATA.email}
                </ThemedText>
                <ThemedText type="caption" color="neutral.lightGrey" style={styles.memberSince}>
                  Member since {USER_DATA.memberSince}
                </ThemedText>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.neutral.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText type="h4" color="neutral.charcoal" style={styles.sectionTitle}>
            Your Activity
          </ThemedText>
          <View style={styles.statsGrid}>
            {renderStatCard('People', USER_DATA.stats.totalPeople, 'people', theme.colors.primary.base)}
            {renderStatCard('Gifts', USER_DATA.stats.totalGifts, 'gift', theme.colors.secondary.base)}
            {renderStatCard('Reminders', USER_DATA.stats.totalReminders, 'notifications', theme.colors.warning)}
            {renderStatCard('Completed', USER_DATA.stats.completedTasks, 'checkmark-circle', theme.colors.success)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <ThemedText type="h4" color="neutral.charcoal" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/add-person')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary.lighter }]}>
                <Ionicons name="person-add" size={24} color={theme.colors.primary.base} />
              </View>
              <ThemedText type="caption" color="neutral.charcoal" style={styles.quickActionLabel}>
                Add Person
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/add-gift')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary.lighter }]}>
                <Ionicons name="gift" size={24} color={theme.colors.secondary.base} />
              </View>
              <ThemedText type="caption" color="neutral.charcoal" style={styles.quickActionLabel}>
                Add Gift
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/ai-gift-suggestions')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.warning + '30' }]}>
                <Ionicons name="bulb" size={24} color={theme.colors.warning} />
              </View>
              <ThemedText type="caption" color="neutral.charcoal" style={styles.quickActionLabel}>
                AI Suggestions
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/reminder-settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.success + '30' }]}>
                <Ionicons name="settings" size={24} color={theme.colors.success} />
              </View>
              <ThemedText type="caption" color="neutral.charcoal" style={styles.quickActionLabel}>
                Settings
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          {MENU_SECTIONS.map((section, index) => (
            <View key={section.title} style={styles.menuSectionContainer}>
              <ThemedText type="h5" color="neutral.charcoal" style={styles.menuSectionTitle}>
                {section.title}
              </ThemedText>
              <Card variant="default" style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    {renderMenuItem(item)}
                    {itemIndex < section.items.length - 1 && <View style={styles.menuDivider} />}
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <EnhancedButton
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            style={styles.signOutButton}
            leftIcon={<Ionicons name="log-out-outline" size={20} color={theme.colors.error} />}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <ThemedText type="caption" color="neutral.grey" style={styles.versionText}>
            Monika v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
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
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  userEmail: {
    marginBottom: theme.spacing.xxs,
    opacity: 0.9,
  },
  memberSince: {
    opacity: 0.8,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xxs,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontWeight: '700',
    marginBottom: theme.spacing.xxs,
  },
  statLabel: {
    textAlign: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionLabel: {
    textAlign: 'center',
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  menuSectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  menuSectionTitle: {
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.neutral.lightGrey,
    marginLeft: theme.spacing.lg + 40,
    marginRight: theme.spacing.md,
  },
  signOutSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  signOutButton: {
    borderColor: theme.colors.error,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  versionText: {
    textAlign: 'center',
  },
});
