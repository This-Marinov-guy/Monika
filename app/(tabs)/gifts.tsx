import { Card } from '@/components/Card';
import { EnhancedButton } from '@/components/EnhancedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample gift data
const SAMPLE_GIFTS = [
  {
    id: '1',
    name: 'Camera Lens',
    description: 'Wide angle lens for DSLR camera',
    price: 249.99,
    occasion: 'Birthday',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: false,
    isPurchased: false,
    category: 'Electronics',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Coffee Subscription',
    description: 'Monthly specialty coffee delivery',
    price: 89.99,
    occasion: 'Anniversary',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: true,
    isPurchased: false,
    category: 'Food & Drink',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Hiking Boots',
    description: 'Waterproof boots for outdoor adventures',
    price: 179.99,
    occasion: 'Christmas',
    personName: 'Emma Johnson',
    personImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: true,
    isPurchased: true,
    category: 'Outdoor',
    priority: 'low'
  },
  {
    id: '4',
    name: 'Gaming Headset',
    description: 'Noise cancelling with surround sound',
    price: 129.99,
    occasion: 'Birthday',
    personName: 'Michael Chen',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: false,
    isPurchased: false,
    category: 'Electronics',
    priority: 'high'
  },
  {
    id: '5',
    name: 'Cooking Class',
    description: 'Italian cuisine masterclass',
    price: 75,
    occasion: 'Christmas',
    personName: 'Michael Chen',
    personImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: true,
    isPurchased: false,
    category: 'Experience',
    priority: 'medium'
  },
  {
    id: '6',
    name: 'Gardening Set',
    description: 'Premium tools with carrying case',
    price: 89.99,
    occasion: 'Birthday',
    personName: 'Sarah Williams',
    personImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    isAiSuggested: false,
    isPurchased: false,
    category: 'Home & Garden',
    priority: 'medium'
  }
];

const CATEGORIES = ['All', 'Electronics', 'Food & Drink', 'Outdoor', 'Experience', 'Home & Garden', 'Fashion', 'Books'];

export default function GiftsScreen() {
  const [gifts] = useState(SAMPLE_GIFTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, ai, purchased, unpurchased
  
  const filteredGifts = gifts.filter(gift => {
    const categoryMatch = selectedCategory === 'All' || gift.category === selectedCategory;
    const filterMatch = 
      selectedFilter === 'all' ||
      (selectedFilter === 'ai' && gift.isAiSuggested) ||
      (selectedFilter === 'purchased' && gift.isPurchased) ||
      (selectedFilter === 'unpurchased' && !gift.isPurchased);
    
    return categoryMatch && filterMatch;
  });
  
  const totalValue = filteredGifts.reduce((sum, gift) => sum + gift.price, 0);
  const purchasedValue = filteredGifts.filter(g => g.isPurchased).reduce((sum, gift) => sum + gift.price, 0);
  
  const renderGiftCard = ({ item }: { item: typeof SAMPLE_GIFTS[0] }) => (
    <TouchableOpacity 
      style={styles.giftCardContainer}
      onPress={() => router.push(`/gift-detail?id=${item.id}&personId=${item.id}`)}
      activeOpacity={0.9}
    >
      <Card variant={item.isPurchased ? "subtle" : "elevated"} style={styles.giftCard}>
        <View style={styles.cardHeader}>
          <View style={styles.giftInfo}>
            <ThemedText type="h6" color="neutral.charcoal" numberOfLines={1} style={styles.giftName}>
              {item.name}
            </ThemedText>
            <ThemedText type="body2" color="neutral.darkGrey" numberOfLines={2} style={styles.giftDescription}>
              {item.description}
            </ThemedText>
          </View>
          
          <View style={styles.priceContainer}>
            <ThemedText type="h5" color="primary.base" style={styles.price}>
              ${item.price.toFixed(2)}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.cardMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={theme.colors.neutral.darkGrey} />
              <ThemedText type="caption" color="neutral.darkGrey" style={styles.metaText}>
                {item.personName}
              </ThemedText>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={theme.colors.neutral.darkGrey} />
              <ThemedText type="caption" color="neutral.darkGrey" style={styles.metaText}>
                {item.occasion}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.categoryTag}>
            <ThemedText type="caption" color="neutral.charcoal">
              {item.category}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          {item.isAiSuggested && !item.isPurchased && (
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color={theme.colors.secondary.base} />
              <ThemedText type="caption" color="secondary.base" style={styles.badgeText}>
                AI Suggested
              </ThemedText>
            </View>
          )}
          
          {item.isPurchased && (
            <View style={styles.purchasedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
              <ThemedText type="caption" color="success" style={styles.badgeText}>
                Purchased
              </ThemedText>
            </View>
          )}
          
          <View style={styles.priorityBadge}>
            <ThemedText type="caption" color={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'neutral.darkGrey'}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
            </ThemedText>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
  
  const renderCategoryFilter = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item && styles.categoryFilterActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <ThemedText 
        type="body2" 
        color={selectedCategory === item ? "neutral.white" : "neutral.charcoal"}
        style={styles.categoryFilterText}
      >
        {item}
      </ThemedText>
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
              Gifts
            </ThemedText>
            <ThemedText type="body1" color="neutral.lightGrey" style={styles.headerSubtitle}>
              Manage your gift ideas and purchases
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.addGiftButton}
            onPress={() => router.push('/add-gift')}
          >
            <Ionicons name="add" size={24} color={theme.colors.neutral.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="primary.base" style={styles.statValue}>
              {filteredGifts.length}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Total Gifts
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="success" style={styles.statValue}>
              ${totalValue.toFixed(0)}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Total Value
            </ThemedText>
          </Card>
          
          <Card variant="subtle" style={styles.statCard}>
            <ThemedText type="h4" color="secondary.base" style={styles.statValue}>
              ${purchasedValue.toFixed(0)}
            </ThemedText>
            <ThemedText type="caption" color="neutral.darkGrey">
              Purchased
            </ThemedText>
          </Card>
        </View>
      </View>
      
      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryFilter}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoryFilters}
          />
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <ThemedText type="caption" color={selectedFilter === 'all' ? "neutral.white" : "neutral.charcoal"}>
              All
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'ai' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('ai')}
          >
            <ThemedText type="caption" color={selectedFilter === 'ai' ? "neutral.white" : "neutral.charcoal"}>
              AI Suggested
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'unpurchased' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('unpurchased')}
          >
            <ThemedText type="caption" color={selectedFilter === 'unpurchased' ? "neutral.white" : "neutral.charcoal"}>
              To Buy
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'purchased' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('purchased')}
          >
            <ThemedText type="caption" color={selectedFilter === 'purchased' ? "neutral.white" : "neutral.charcoal"}>
              Purchased
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Gifts Grid */}
      <View style={styles.giftsSection}>
        <FlatList
          data={filteredGifts}
          renderItem={renderGiftCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.giftsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={48} color={theme.colors.neutral.grey} />
              <ThemedText type="h5" color="neutral.darkGrey" style={styles.emptyTitle}>
                No gifts found
              </ThemedText>
              <ThemedText type="body2" color="neutral.darkGrey" style={styles.emptySubtitle}>
                Try adjusting your filters or add a new gift idea
              </ThemedText>
              <EnhancedButton
                title="Add Gift"
                variant="primary"
                onPress={() => router.push('/add-gift')}
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
  addGiftButton: {
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
  filtersSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  filterRow: {
    marginBottom: theme.spacing.md,
  },
  categoryFilters: {
    paddingBottom: theme.spacing.sm,
  },
  categoryFilter: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.lightGrey,
    marginRight: theme.spacing.sm,
  },
  categoryFilterActive: {
    backgroundColor: theme.colors.primary.base,
  },
  categoryFilterText: {
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.lightGrey,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xxs,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary.base,
  },
  giftsSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  giftsList: {
    paddingBottom: theme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  giftCardContainer: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  giftCard: {
    height: 220,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  giftInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  giftName: {
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  giftDescription: {
    marginBottom: theme.spacing.xs,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: '700',
  },
  cardMeta: {
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: theme.spacing.xxs,
  },
  categoryTag: {
    backgroundColor: theme.colors.neutral.lightGrey,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.lighter,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.full,
  },
  purchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    marginLeft: theme.spacing.xxs,
    fontWeight: '500',
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
