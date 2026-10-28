import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  Task,
  FilterStatus,
  SortMode,
  Priority,
  TaskListScreenProps,
} from '../types';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { ProgressBar } from '../components/ProgressBar';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';
import { AppButton } from '../components/AppButton';
import { parseDate, isOverdue } from '../utils/dateUtils';
import { colors, spacing } from '../theme/colors';

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Cao: 3,
  'Trung bình': 2,
  Thấp: 1,
};

export const TaskListScreen: React.FC<TaskListScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { tasks, toggleDone, deleteTask, deleteDoneTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortMode, setSortMode] = useState<SortMode>('dueDate');

  // Thống kê tiến độ luôn tính trên toàn bộ tasks
  const completedCount = useMemo(
    () => tasks.filter(t => t.done).length,
    [tasks],
  );
  const totalCount = tasks.length;

  // Lọc và sắp xếp đồng thời
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Lọc theo trạng thái
    if (filterStatus === 'pending') {
      result = result.filter(t => !t.done);
    } else if (filterStatus === 'done') {
      result = result.filter(t => t.done);
    } else if (filterStatus === 'overdue') {
      result = result.filter(t => isOverdue(t));
    }

    // 2. Lọc theo tìm kiếm tên (không phân biệt hoa thường)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    // 3. Sắp xếp (không mutate mảng gốc)
    result.sort((a, b) => {
      if (sortMode === 'dueDate') {
        const dateA = parseDate(a.dueDate)?.getTime() ?? 0;
        const dateB = parseDate(b.dueDate)?.getTime() ?? 0;
        return dateA - dateB;
      } else {
        // priority: Cao -> Trung bình -> Thấp
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
    });

    return result;
  }, [tasks, filterStatus, searchQuery, sortMode]);

  const handleToggleSort = () => {
    setSortMode(prev => (prev === 'dueDate' ? 'priority' : 'dueDate'));
  };

  const handleDeleteDoneTasks = () => {
    if (completedCount === 0) {
      return;
    }

    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá ${completedCount} việc đã hoàn thành?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: deleteDoneTasks,
        },
      ],
      { cancelable: true },
    );
  };

  const renderTaskItem: ListRenderItem<Task> = ({ item }) => (
    <TaskItem
      task={item}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      onToggleDone={() => toggleDone(item.id)}
      onDelete={() => deleteTask(item.id)}
    />
  );

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top > 0 ? insets.top : spacing.md,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md,
        },
      ]}
    >
      {/* Header Actions & Progress */}
      <View style={styles.header}>
        <ProgressBar completed={completedCount} total={totalCount} />

        <View style={styles.actionRow}>
          <AppButton
            title="+ Thêm việc"
            onPress={() => navigation.navigate('TaskForm', undefined)}
            style={styles.addBtn}
          />
          <AppButton
            title={`Xoá việc đã xong (${completedCount})`}
            onPress={handleDeleteDoneTasks}
            variant="secondary"
            disabled={completedCount === 0}
            style={styles.deleteDoneBtn}
            textStyle={styles.deleteDoneText}
          />
        </View>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          status={filterStatus}
          onStatusChange={setFilterStatus}
          sortMode={sortMode}
          onToggleSort={handleToggleSort}
        />
      </View>

      {/* Danh sách công việc */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          totalCount === 0 ? (
            <EmptyState
              title="Chưa có công việc nào"
              message="Hãy lên kế hoạch cho ngày hôm nay bằng cách tạo công việc đầu tiên!"
              actionLabel="+ Thêm việc mới"
              onAction={() => navigation.navigate('TaskForm', undefined)}
            />
          ) : (
            <EmptyState
              title="Không tìm thấy kết quả"
              message="Không có công việc nào khớp với bộ lọc hoặc từ khoá tìm kiếm."
              icon="🔍"
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  addBtn: {
    flex: 1,
  },
  deleteDoneBtn: {
    flex: 1.2,
  },
  deleteDoneText: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
