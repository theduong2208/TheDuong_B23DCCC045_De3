import {
  parseDate,
  getToday,
  formatDate,
  daysLeft,
  isOverdue,
  getDueText,
  removeVietnameseTones,
} from '../src/utils/dateUtils';
import type { Task } from '../src/types';

describe('Kiểm tra dateUtils', () => {
  describe('parseDate', () => {
    it('nhận diện đúng ngày hợp lệ dd/mm/yyyy', () => {
      const d = parseDate('28/10/2026');
      expect(d).not.toBeNull();
      expect(d?.getDate()).toBe(28);
      expect(d?.getMonth()).toBe(9); // 0-indexed -> 9 là tháng 10
      expect(d?.getFullYear()).toBe(2026);
    });

    it('bắt lỗi ngày không có thật: 31/02/2026', () => {
      const d = parseDate('31/02/2026');
      expect(d).toBeNull();
    });

    it('bắt lỗi ngày 29/02 của năm không nhuận: 29/02/2025', () => {
      const d = parseDate('29/02/2025');
      expect(d).toBeNull();
    });

    it('bắt lỗi chuỗi không phải ngày: "abc", chuỗi rỗng ""', () => {
      expect(parseDate('abc')).toBeNull();
      expect(parseDate('')).toBeNull();
      expect(parseDate('28-10-2026')).toBeNull();
      expect(parseDate('32/01/2026')).toBeNull();
      expect(parseDate('15/13/2026')).toBeNull();
    });
  });

  describe('getToday & formatDate', () => {
    it('getToday chuẩn hoá giờ về 00:00:00', () => {
      const today = getToday();
      expect(today.getHours()).toBe(0);
      expect(today.getMinutes()).toBe(0);
      expect(today.getSeconds()).toBe(0);
      expect(today.getMilliseconds()).toBe(0);
    });

    it('formatDate trả về đúng định dạng dd/mm/yyyy', () => {
      const date = new Date(2026, 4, 5); // 05/05/2026
      expect(formatDate(date)).toBe('05/05/2026');
    });
  });

  describe('daysLeft, isOverdue & getDueText', () => {
    const today = getToday();
    const addDays = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return formatDate(d);
    };

    it('daysLeft tính chính xác số ngày chênh lệch', () => {
      expect(daysLeft(addDays(0))).toBe(0);
      expect(daysLeft(addDays(3))).toBe(3);
      expect(daysLeft(addDays(-2))).toBe(-2);
    });

    it('isOverdue chỉ trả về true nếu !done và ngày trong quá khứ', () => {
      const overdueTask: Task = {
        id: '1',
        title: 'Báo cáo',
        note: '',
        category: 'Công việc',
        priority: 'Cao',
        dueDate: addDays(-2),
        done: false,
      };
      expect(isOverdue(overdueTask)).toBe(true);

      const doneOverdueTask: Task = {
        ...overdueTask,
        done: true,
      };
      expect(isOverdue(doneOverdueTask)).toBe(false);

      const futureTask: Task = {
        ...overdueTask,
        dueDate: addDays(5),
        done: false,
      };
      expect(isOverdue(futureTask)).toBe(false);
    });

    it('getDueText trả về chuỗi mô tả chính xác', () => {
      const taskPast: Task = {
        id: '1',
        title: 'T1',
        note: '',
        category: 'Học tập',
        priority: 'Cao',
        dueDate: addDays(-3),
        done: false,
      };
      expect(getDueText(taskPast)).toBe('Quá hạn 3 ngày');

      const taskToday: Task = {
        ...taskPast,
        dueDate: addDays(0),
      };
      expect(getDueText(taskToday)).toBe('Hạn hôm nay');

      const taskFuture: Task = {
        ...taskPast,
        dueDate: addDays(4),
      };
      expect(getDueText(taskFuture)).toBe('Còn 4 ngày');
    });
  });

  describe('removeVietnameseTones', () => {
    it('chuyển đổi chuẩn xác tiếng Việt có dấu thành không dấu', () => {
      expect(removeVietnameseTones('Học tập')).toBe('Hoc tap');
      expect(removeVietnameseTones('Công việc')).toBe('Cong viec');
      expect(removeVietnameseTones('Sức khoẻ')).toBe('Suc khoe');
      expect(removeVietnameseTones('Đăng ký khoá học')).toBe('Dang ky khoa hoc');
    });
  });
});

