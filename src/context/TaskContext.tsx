import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Task } from '../types';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';
import { getSampleTasks } from '../data/sampleTasks';
import { colors } from '../theme/colors';

export interface TaskContextValue {
  tasks: Task[];
  loading: boolean;
  addTask(data: Omit<Task, 'id' | 'done'>): void;
  updateTask(id: string, data: Partial<Omit<Task, 'id'>>): void;
  deleteTask(id: string): void;
  deleteDoneTasks(): void;
  toggleDone(id: string): void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks phải được sử dụng bên trong TaskProvider');
  }
  return context;
}

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isInitialized = useRef<boolean>(false);

  // Khởi tạo và nạp dữ liệu từ AsyncStorage khi mở app
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const stored = await loadTasksFromStorage();
        if (!isMounted) {
          return;
        }

        if (stored === null) {
          // Lần đầu mở app: key chưa từng tồn tại -> nạp dữ liệu mẫu
          const samples = getSampleTasks();
          setTasks(samples);
          await saveTasksToStorage(samples);
        } else {
          // Đã có trong storage (kể cả mảng rỗng [])
          setTasks(stored);
        }
      } catch (err) {
        console.error('Lỗi khởi tạo TaskContext:', err);
      } finally {
        if (isMounted) {
          isInitialized.current = true;
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tự động lưu vào AsyncStorage mỗi khi tasks thay đổi sau khi đã load xong
  useEffect(() => {
    if (!isInitialized.current || loading) {
      return;
    }
    saveTasksToStorage(tasks);
  }, [tasks, loading]);

  const addTask = useCallback((data: Omit<Task, 'id' | 'done'>) => {
    const newTask: Task = {
      ...data,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      done: false,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback(
    (id: string, data: Partial<Omit<Task, 'id'>>) => {
      setTasks(prev =>
        prev.map(item => (item.id === id ? { ...item, ...data } : item)),
      );
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  }, []);

  const deleteDoneTasks = useCallback(() => {
    setTasks(prev => prev.filter(item => !item.done));
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const value: TaskContextValue = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    deleteDoneTasks,
    toggleDone,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
