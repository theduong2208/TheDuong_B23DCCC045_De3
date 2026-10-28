import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '../types';

const STORAGE_KEY = '@planner_tasks_v1';

export async function loadTasksFromStorage(): Promise<Task[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed as Task[];
  } catch (error) {
    console.error('Lỗi khi đọc tasks từ AsyncStorage:', error);
    return null;
  }
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  try {
    const raw = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.error('Lỗi khi lưu tasks vào AsyncStorage:', error);
  }
}
