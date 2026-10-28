import { getSampleTasks } from '../src/data/sampleTasks';
import { parseDate, isOverdue } from '../src/utils/dateUtils';
import type { Task, Priority, FilterStatus, SortMode } from '../src/types';

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Cao: 3,
  'Trung bình': 2,
  Thấp: 1,
};

describe('Kiểm tra dữ liệu mẫu (sampleTasks)', () => {
  const samples = getSampleTasks();

  it('khởi tạo ít nhất 6 việc mẫu', () => {
    expect(samples.length).toBeGreaterThanOrEqual(6);
  });

  it('có đủ 4 danh mục: Học tập, Công việc, Sức khoẻ, Cá nhân', () => {
    const categories = new Set(samples.map(t => t.category));
    expect(categories.has('Học tập')).toBe(true);
    expect(categories.has('Công việc')).toBe(true);
    expect(categories.has('Sức khoẻ')).toBe(true);
    expect(categories.has('Cá nhân')).toBe(true);
  });

  it('có đủ 3 mức ưu tiên: Cao, Trung bình, Thấp', () => {
    const priorities = new Set(samples.map(t => t.priority));
    expect(priorities.has('Cao')).toBe(true);
    expect(priorities.has('Trung bình')).toBe(true);
    expect(priorities.has('Thấp')).toBe(true);
  });

  it('có ít nhất 1 việc done=true', () => {
    const doneTasks = samples.filter(t => t.done);
    expect(doneTasks.length).toBeGreaterThanOrEqual(1);
  });

  it('có ít nhất 1 việc quá hạn (done=false và dueDate trong quá khứ)', () => {
    const overdueTasks = samples.filter(t => isOverdue(t));
    expect(overdueTasks.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Kiểm tra logic Lọc, Tìm kiếm, Sắp xếp (Câu 5)', () => {
  const testTasks: Task[] = [
    {
      id: '1',
      title: 'Học React Native TypeScript',
      note: '',
      category: 'Học tập',
      priority: 'Thấp',
      dueDate: '25/10/2026',
      done: true,
    },
    {
      id: '2',
      title: 'Làm báo cáo quý',
      note: '',
      category: 'Công việc',
      priority: 'Cao',
      dueDate: '20/10/2026', // quá hạn nếu hôm nay >= 28/10
      done: false,
    },
    {
      id: '3',
      title: 'Chạy bộ công viên',
      note: '',
      category: 'Sức khoẻ',
      priority: 'Trung bình',
      dueDate: '30/10/2026',
      done: false,
    },
  ];

  function filterAndSort(
    tasks: Task[],
    filterStatus: FilterStatus,
    searchQuery: string,
    sortMode: SortMode,
  ): Task[] {
    let result = [...tasks];

    // 1. Trạng thái
    if (filterStatus === 'pending') {
      result = result.filter(t => !t.done);
    } else if (filterStatus === 'done') {
      result = result.filter(t => t.done);
    } else if (filterStatus === 'overdue') {
      result = result.filter(t => isOverdue(t));
    }

    // 2. Tìm kiếm tên (không phân biệt hoa thường)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    // 3. Sắp xếp
    result.sort((a, b) => {
      if (sortMode === 'dueDate') {
        const dateA = parseDate(a.dueDate)?.getTime() ?? 0;
        const dateB = parseDate(b.dueDate)?.getTime() ?? 0;
        return dateA - dateB;
      } else {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
    });

    return result;
  }

  it('lọc trạng thái "done" chỉ trả về việc đã hoàn thành', () => {
    const res = filterAndSort(testTasks, 'done', '', 'dueDate');
    expect(res.every(t => t.done)).toBe(true);
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('1');
  });

  it('lọc trạng thái "pending" chỉ trả về việc chưa xong', () => {
    const res = filterAndSort(testTasks, 'pending', '', 'dueDate');
    expect(res.every(t => !t.done)).toBe(true);
    expect(res.length).toBe(2);
  });

  it('tìm kiếm không phân biệt hoa thường ("react" tìm được "React Native")', () => {
    const res = filterAndSort(testTasks, 'all', 'react', 'dueDate');
    expect(res.length).toBe(1);
    expect(res[0].title).toContain('React Native');
  });

  it('sắp xếp theo priority đưa mức "Cao" lên đầu', () => {
    const res = filterAndSort(testTasks, 'all', '', 'priority');
    expect(res[0].priority).toBe('Cao');
    expect(res[1].priority).toBe('Trung bình');
    expect(res[2].priority).toBe('Thấp');
  });

  it('sắp xếp theo dueDate đưa hạn gần nhất lên trước', () => {
    const res = filterAndSort(testTasks, 'all', '', 'dueDate');
    expect(res[0].id).toBe('2'); // 20/10
    expect(res[1].id).toBe('1'); // 25/10
    expect(res[2].id).toBe('3'); // 30/10
  });

  it('không làm thay đổi (mutate) mảng gốc khi sắp xếp', () => {
    const originalFirstId = testTasks[0].id;
    filterAndSort(testTasks, 'all', '', 'priority');
    expect(testTasks[0].id).toBe(originalFirstId);
  });
});
