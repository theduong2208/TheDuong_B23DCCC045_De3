import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import type { Task, Category } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { isOverdue, getDueText } from '../utils/dateUtils';
import { colors, radius, spacing, fontSize, shadow } from '../theme/colors';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggleDone: () => void;
  onDelete: () => void;
}

const CATEGORY_ICONS: Record<Category, string> = {
  'Học tập': '📚',
  'Công việc': '💼',
  'Sức khoẻ': '🏃',
  'Cá nhân': '👤',
};

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onToggleDone,
  onDelete,
}) => {
  const overdue = isOverdue(task);
  const dueText = getDueText(task);

  const handleLongPress = () => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={350}
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardDone,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Checkbox tự tạo bằng Pressable */}
      <Pressable
        onPress={onToggleDone}
        hitSlop={10}
        style={({ pressed }) => [
          styles.checkbox,
          task.done && styles.checkboxDone,
          pressed && styles.checkboxPressed,
        ]}
      >
        {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      {/* Nội dung công việc */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              task.done && styles.titleDone,
            ]}
          >
            {task.title}
          </Text>
        </View>

        {/* Danh mục và Mức ưu tiên */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {CATEGORY_ICONS[task.category]} {task.category}
            </Text>
          </View>
          <PriorityBadge priority={task.priority} size="small" />
        </View>

        {/* Thông tin hạn và trạng thái quá hạn */}
        <View style={styles.footerRow}>
          <Text style={styles.dueLabel}>
            📅 {task.dueDate} •{' '}
            <Text
              style={[
                styles.dueText,
                overdue && styles.dueTextOverdue,
                task.done && styles.dueTextDone,
              ]}
            >
              {task.done ? 'Đã hoàn thành' : dueText}
            </Text>
          </Text>

          {overdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Quá hạn</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardDone: {
    backgroundColor: colors.surfaceSubtle,
    opacity: 0.55,
    borderColor: colors.border,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: colors.surfaceVariant,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: spacing.xxs,
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: '800',
    lineHeight: 16,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.textMuted,
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  dueText: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dueTextOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  dueTextDone: {
    color: colors.success,
  },
  overdueBadge: {
    backgroundColor: colors.dangerLight,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: radius.xs,
  },
  overdueText: {
    color: colors.danger,
    fontSize: fontSize.xs - 1,
    fontWeight: '700',
  },
});
