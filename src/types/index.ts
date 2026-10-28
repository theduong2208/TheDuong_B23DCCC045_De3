import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export type FilterStatus = 'all' | 'pending' | 'done' | 'overdue';

export type SortMode = 'dueDate' | 'priority';

export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string; /* dd/mm/yyyy */
  done: boolean;
}

export const CATEGORIES: Category[] = [
  'Học tập',
  'Công việc',
  'Sức khoẻ',
  'Cá nhân',
];

export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { task?: Task } | undefined;
  TaskDetail: { taskId: string };
};

export type TaskListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TaskList'
>;

export type TaskFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TaskForm'
>;

export type TaskDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TaskDetail'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
