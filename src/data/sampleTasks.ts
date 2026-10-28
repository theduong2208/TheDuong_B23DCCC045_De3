import type { Task } from '../types';
import { getToday, formatDate } from '../utils/dateUtils';

function offsetDateStr(offsetDays: number): string {
  const date = getToday();
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
}

export function getSampleTasks(): Task[] {
  return [
    {
      id: 'task-sample-1',
      title: 'Nộp báo cáo đồ án tốt nghiệp',
      note: 'Hoàn thiện chương 4, chuẩn bị slide thuyết trình và in tài liệu cho hội đồng.',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: offsetDateStr(-2), // Quá hạn (chưa xong)
      done: false,
    },
    {
      id: 'task-sample-2',
      title: 'Họp chiến lược sprint quý 4',
      note: 'Thảo luận KPI, phân công nhiệm vụ và rà soát tiến độ dự án di động.',
      category: 'Công việc',
      priority: 'Cao',
      dueDate: offsetDateStr(0), // Hôm nay
      done: false,
    },
    {
      id: 'task-sample-3',
      title: 'Đăng ký khoá học React Native nâng cao',
      note: 'Thanh toán học phí và nhận tài liệu hướng dẫn chuẩn bị môi trường.',
      category: 'Học tập',
      priority: 'Trung bình',
      dueDate: offsetDateStr(2),
      done: true, // Đã xong
    },
    {
      id: 'task-sample-4',
      title: 'Chạy bộ 5km và tập yoga buổi sáng',
      note: 'Duy trì lịch tập thể dục 3 buổi/tuần tại công viên gần nhà.',
      category: 'Sức khoẻ',
      priority: 'Trung bình',
      dueDate: offsetDateStr(3),
      done: false,
    },
    {
      id: 'task-sample-5',
      title: 'Mua quà sinh nhật cho mẹ',
      note: 'Ghé tiệm hoa và mua chiếc khăn lụa màu xanh mẹ thích.',
      category: 'Cá nhân',
      priority: 'Thấp',
      dueDate: offsetDateStr(5),
      done: false,
    },
    {
      id: 'task-sample-6',
      title: 'Khám răng định kỳ 6 tháng',
      note: 'Lấy cao răng và kiểm tra sức khoẻ răng miệng tại nha khoa.',
      category: 'Sức khoẻ',
      priority: 'Thấp',
      dueDate: offsetDateStr(-1),
      done: true, // Đã xong trong quá khứ
    },
  ];
}
