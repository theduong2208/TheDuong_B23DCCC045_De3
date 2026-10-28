import type { Task } from '../types';

/**
 * Kiểm tra regex dd/mm/yyyy và tạo new Date(y, m - 1, d)
 * So sánh lại getDate/getMonth/getFullYear để bắt ngày không hợp lệ như 31/02/2026
 */
export function parseDate(str: string): Date | null {
  const trimmed = str.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Lấy ngày hôm nay chuẩn hoá về 00:00:00
 */
export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Định dạng Date thành chuỗi dd/mm/yyyy
 */
export function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear());
  return `${d}/${m}/${y}`;
}

/**
 * Tính số ngày còn lại đến hạn: Math.round((due - today)/86400000)
 */
export function daysLeft(dueStr: string): number {
  const dueDate = parseDate(dueStr);
  if (!dueDate) {
    return 0;
  }
  const today = getToday();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.round(diffTime / 86400000);
}

/**
 * Kiểm tra task có quá hạn không: !task.done && due < today
 */
export function isOverdue(task: Task): boolean {
  if (task.done) {
    return false;
  }
  const dueDate = parseDate(task.dueDate);
  if (!dueDate) {
    return false;
  }
  const today = getToday();
  return dueDate.getTime() < today.getTime();
}

/**
 * Hiển thị text hạn: "Còn X ngày" / "Hạn hôm nay" / "Quá hạn X ngày"
 */
export function getDueText(task: Task): string {
  const diff = daysLeft(task.dueDate);
  if (diff < 0) {
    return `Quá hạn ${Math.abs(diff)} ngày`;
  }
  if (diff === 0) {
    return 'Hạn hôm nay';
  }
  return `Còn ${diff} ngày`;
}

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm không dấu chuẩn xác
 */
export function removeVietnameseTones(str: string): string {
  let s = str;
  s = s.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  s = s.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  s = s.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  s = s.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  s = s.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  s = s.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  s = s.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  s = s.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  s = s.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  s = s.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  s = s.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  s = s.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  s = s.replace(/đ/g, 'd');
  s = s.replace(/Đ/g, 'D');
  // Kết hợp NFD để lọc hết dấu thanh phụ nếu có
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return s;
}

