import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { TaskDetailScreenProps } from '../types';
import { useTasks } from '../context/TaskContext';
import { PriorityBadge } from '../components/PriorityBadge';
import { AppButton } from '../components/AppButton';
import { isOverdue, getDueText } from '../utils/dateUtils';
import { colors, radius, spacing, fontSize, shadow } from '../theme/colors';

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { taskId } = route.params;
  const { tasks, toggleDone, deleteTask } = useTasks();

  // Luôn lấy dữ liệu mới nhất từ context dựa vào taskId
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <View style={[styles.screen, styles.notFoundContainer]}>
        <Text style={styles.notFoundIcon}>⚠️</Text>
        <Text style={styles.notFoundTitle}>Không tìm thấy công việc</Text>
        <Text style={styles.notFoundMessage}>
          Công việc này có thể đã bị xoá hoặc không tồn tại.
        </Text>
        <AppButton
          title="Quay lại danh sách"
          onPress={() => navigation.goBack()}
          variant="primary"
          style={styles.backButton}
        />
      </View>
    );
  }

  const overdue = isOverdue(task);
  const dueStatusText = getDueText(task);

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: (insets.bottom > 0 ? insets.bottom : spacing.md) + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Thẻ trạng thái chính */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusHeaderLabel}>TRẠNG THÁI HIỆN TẠI</Text>
          <View
            style={[
              styles.statusPill,
              task.done ? styles.statusPillDone : styles.statusPillPending,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                task.done ? styles.statusPillTextDone : styles.statusPillTextPending,
              ]}
            >
              {task.done ? '✓ Đã hoàn thành' : '⏳ Đang thực hiện'}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, task.done && styles.titleDone]}>
          {task.title}
        </Text>

        {overdue && (
          <View style={styles.overdueBanner}>
            <Text style={styles.overdueBannerText}>
              ⚠️ Công việc đã quá hạn hoàn thành!
            </Text>
          </View>
        )}
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.detailCard}>
        <Text style={styles.sectionHeader}>THÔNG TIN CÔNG VIỆC</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Danh mục</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{task.category}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mức ưu tiên</Text>
          <PriorityBadge priority={task.priority} size="medium" />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hạn chót</Text>
          <View style={styles.dueInfoCol}>
            <Text style={styles.infoValue}>{task.dueDate}</Text>
            <Text
              style={[
                styles.dueSubText,
                overdue && styles.dueSubTextOverdue,
                task.done && styles.dueSubTextDone,
              ]}
            >
              {task.done ? 'Đã hoàn thành' : dueStatusText}
            </Text>
          </View>
        </View>
      </View>

      {/* Ghi chú chi tiết */}
      <View style={styles.detailCard}>
        <Text style={styles.sectionHeader}>GHI CHÚ</Text>
        <Text
          style={[
            styles.noteText,
            !task.note && styles.emptyNoteText,
          ]}
        >
          {task.note ? task.note : 'Không có ghi chú nào cho công việc này.'}
        </Text>
      </View>

      {/* Nhóm nút hành động */}
      <View style={styles.actionSection}>
        <AppButton
          title={
            task.done
              ? 'Đánh dấu chưa hoàn thành'
              : 'Đánh dấu hoàn thành'
          }
          onPress={() => toggleDone(task.id)}
          variant={task.done ? 'secondary' : 'primary'}
          icon={task.done ? '↩' : '✓'}
          style={styles.toggleBtn}
        />

        <View style={styles.subActionRow}>
          <AppButton
            title="Sửa công việc"
            onPress={() => navigation.navigate('TaskForm', { task })}
            variant="outline"
            icon="✏️"
            style={styles.flexBtn}
          />

          <AppButton
            title="Xoá việc"
            onPress={handleDelete}
            variant="danger"
            icon="🗑️"
            style={styles.flexBtn}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
  },
  notFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  notFoundTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  notFoundMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    minWidth: 200,
  },
  statusCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusHeaderLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  statusPillPending: {
    backgroundColor: colors.primaryLight,
  },
  statusPillDone: {
    backgroundColor: colors.successLight,
  },
  statusPillText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  statusPillTextPending: {
    color: colors.primary,
  },
  statusPillTextDone: {
    color: colors.success,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  overdueBanner: {
    marginTop: spacing.md,
    backgroundColor: colors.dangerLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  overdueBannerText: {
    color: colors.danger,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryPill: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  dueInfoCol: {
    alignItems: 'flex-end',
  },
  dueSubText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  dueSubTextOverdue: {
    color: colors.danger,
  },
  dueSubTextDone: {
    color: colors.success,
  },
  noteText: {
    fontSize: fontSize.sm,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  emptyNoteText: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  actionSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  toggleBtn: {
    width: '100%',
  },
  subActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flexBtn: {
    flex: 1,
  },
});
