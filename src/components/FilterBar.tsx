import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { FilterStatus, SortMode } from '../types';
import { colors, radius, spacing, fontSize } from '../theme/colors';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  status: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  sortMode: SortMode;
  onToggleSort: () => void;
}

const FILTER_ITEMS: { key: FilterStatus; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: '📁' },
  { key: 'pending', label: 'Chưa xong', icon: '⏳' },
  { key: 'done', label: 'Đã xong', icon: '✅' },
  { key: 'overdue', label: 'Quá hạn', icon: '⚠️' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  sortMode,
  onToggleSort,
}) => {
  return (
    <View style={styles.container}>
      {/* Ô tìm kiếm */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm công việc..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            onPress={() => onSearchChange('')}
            hitSlop={8}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Hàng nút lọc trạng thái */}
      <View style={styles.filterRowWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_ITEMS.map(item => {
            const isActive = status === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => onStatusChange(item.key)}
                style={({ pressed }) => [
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                  pressed && styles.pillPressed,
                ]}
              >
                <Text style={styles.pillIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.pillText,
                    isActive && styles.pillTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Nút chuyển chế độ sắp xếp */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sắp xếp theo:</Text>
        <Pressable
          onPress={onToggleSort}
          style={({ pressed }) => [
            styles.sortButton,
            pressed && styles.pillPressed,
          ]}
        >
          <Text style={styles.sortButtonText}>
            {sortMode === 'dueDate' ? '📅 Hạn chót (gần nhất)' : '⚡ Mức ưu tiên (Cao → Thấp)'}
          </Text>
          <Text style={styles.sortSwitchIcon}> ⇄</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  clearText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  filterRowWrapper: {
    marginBottom: spacing.sm,
  },
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillPressed: {
    opacity: 0.8,
  },
  pillIcon: {
    fontSize: fontSize.xs,
    marginRight: spacing.xs,
  },
  pillText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sortLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sortSwitchIcon: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '700',
  },
});
