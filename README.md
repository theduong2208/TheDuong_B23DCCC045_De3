# PlannerApp - Ứng dụng Quản lý Kế hoạch Cá nhân

Ứng dụng quản lý kế hoạch cá nhân (**PlannerApp**) được xây dựng bằng **React Native CLI** (không sử dụng Expo) với **TypeScript (strict mode)**, giao diện hoàn toàn bằng tiếng Việt, thiết kế hiện đại, mượt mà và tối ưu trải nghiệm người dùng.

---

## 🛠️ Công nghệ sử dụng
- **React Native CLI**: 0.88.0
- **TypeScript**: Chế độ `"strict": true` (không dùng `any`, không `@ts-ignore`)
- **Điều hướng**: `@react-navigation/native`, `@react-navigation/native-stack`
- **Lưu trữ cục bộ**: `@react-native-async-storage/async-storage`
- **Giao diện & Tiện ích**:
  - `react-native-safe-area-context`
  - `react-native-screens`
  - Tự vẽ thanh tiến độ bằng `View`, checkbox tự làm bằng `Pressable`
  - Biểu tượng sử dụng Emoji / ký tự Unicode (không phụ thuộc `react-native-vector-icons`)
  - Không sử dụng thư viện UI dựng sẵn

---

## 📁 Cấu trúc thư mục dự án

```text
PlannerApp/
├── App.tsx                      # Component gốc, cấu hình Navigation & Provider
├── jest.config.js               # Cấu hình kiểm thử Jest
├── jest.setup.js                # Mock môi trường kiểm thử Jest
├── tsconfig.json                # Cấu hình TypeScript (strict mode)
├── __tests__/                   # Bộ kiểm thử tự động
│   ├── App.test.tsx             # Kiểm thử render component chính
│   ├── dateUtils.test.ts        # Kiểm thử các hàm xử lý ngày tháng & hạn chót
│   └── taskLogic.test.ts        # Kiểm thử dữ liệu mẫu, lọc, tìm kiếm, sắp xếp
└── src/
    ├── types/
    │   └── index.ts             # Định nghĩa Type, Interface (Task, Category, Priority,...)
    ├── theme/
    │   └── colors.ts            # Bảng màu, spacing, radius, fontSize, shadow dùng chung
    ├── utils/
    │   ├── dateUtils.ts         # Tiện ích parse, format, tính hạn chót, kiểm tra quá hạn
    │   └── storage.ts           # Wrapper lưu & đọc dữ liệu từ AsyncStorage
    ├── data/
    │   └── sampleTasks.ts       # 6 công việc mẫu khởi tạo lần đầu (tính ngày động)
    ├── context/
    │   └── TaskContext.tsx      # Quản lý State toàn cục & tự động lưu AsyncStorage
    ├── components/
    │   ├── AppButton.tsx        # Nút bấm tái sử dụng có trạng thái pressed/disabled
    │   ├── EmptyState.tsx       # Giao diện khi danh sách rỗng / không tìm thấy
    │   ├── FilterBar.tsx        # Thanh tìm kiếm, nút lọc trạng thái, nút sắp xếp
    │   ├── PriorityBadge.tsx    # Nhãn mức độ ưu tiên (Cao / Trung bình / Thấp)
    │   ├── ProgressBar.tsx      # Thanh tiến độ công việc vẽ bằng View
    │   └── TaskItem.tsx         # Thẻ công việc kèm checkbox & xác nhận xoá
    └── screens/
        ├── TaskListScreen.tsx   # Màn hình danh sách công việc
        ├── TaskFormScreen.tsx   # Màn hình thêm / sửa công việc
        └── TaskDetailScreen.tsx # Màn hình chi tiết công việc
```

---

## 🚀 Hướng dẫn cài đặt & chạy ứng dụng

### 1. Cài đặt thư viện dependencies
```bash
npm install
```

*(Nếu phát triển trên iOS, chạy thêm `cd ios && pod install && cd ..`)*

### 2. Khởi động Metro Bundler
```bash
npm start
```

### 3. Chạy ứng dụng trên Android / iOS
- **Android**:
  ```bash
  npm run android
  ```
- **iOS**:
  ```bash
  npm run ios
  ```

---

## 🧪 Kiểm thử chất lượng (Testing)

### 1. Kiểm tra TypeScript Strict Mode
Đảm bảo mã nguồn sạch 100%, không có lỗi type:
```bash
npx tsc --noEmit
```

### 2. Chạy bộ kiểm thử tự động (Jest)
Kiểm thử toàn bộ logic nghiệp vụ (ngày tháng, hạn chót, lọc, sắp xếp, dữ liệu mẫu, render):
```bash
npm test
```
*(Kết quả: 3/3 test suites passed, 21/21 tests passed)*

---

## ✨ Các chức năng chính

1. **Màn hình Danh sách**:
   - Thống kê tiến độ: `"Đã hoàn thành X/Y công việc"` kèm thanh tiến độ trực quan vẽ bằng `View`.
   - Danh sách công việc dạng Card bo góc, bóng mờ, hiển thị rõ tên, danh mục, hạn hoàn thành và badge mức ưu tiên.
   - Checkbox tự chế bằng `Pressable` giúp chuyển đổi trạng thái hoàn thành tức thì.
   - Công việc quá hạn chưa hoàn thành được gắn nhãn đỏ `"Quá hạn"`.

2. **Thêm & Sửa công việc**:
   - Dùng chung một form linh hoạt, nhận diện chế độ Thêm mới hoặc Sửa.
   - Chọn Danh mục và Mức ưu tiên nhanh chóng qua hàng nút bấm.
   - Validate chặt chẽ:
     - Tên công việc: không được để trống, không vượt quá 50 ký tự.
     - Hạn chót: định dạng `dd/mm/yyyy`, kiểm tra ngày có thật (chặn ngày không có thật như `31/02/2026`).
     - Khi thêm mới: hạn chót không được trước ngày hôm nay.
     - Hiển thị thông báo lỗi và viền đỏ ngay dưới ô nhập khi sai.

3. **Chi tiết công việc**:
   - Hiển thị đầy đủ thông tin, trạng thái thực hiện, nhãn quá hạn và ghi chú chi tiết.
   - Nút đổi trạng thái hoàn thành / chưa hoàn thành cập nhật lập tức.
   - Điều hướng sang màn hình Sửa với dữ liệu cũ được điền sẵn.

4. **Xác nhận Xoá an toàn**:
   - Nhấn giữ (long press) trên công việc hoặc bấm nút Xoá trong chi tiết sẽ mở hộp thoại `Alert.alert` xác nhận (Huỷ / Xoá).
   - Nút `"Xoá việc đã xong (X)"` hiển thị số lượng và yêu cầu xác nhận trước khi xoá.

5. **Bộ lọc, Tìm kiếm & Sắp xếp đồng thời**:
   - Lọc theo 4 trạng thái: **Tất cả**, **Chưa xong**, **Đã xong**, **Quá hạn**.
   - Tìm kiếm theo tên công việc (không phân biệt hoa thường).
   - Chuyển đổi chế độ sắp xếp: theo **Hạn chót (gần nhất)** hoặc theo **Mức ưu tiên (Cao → Thấp)**.
   - Tiến độ trên đầu màn hình luôn được tính trên toàn bộ công việc.

6. **Lưu trữ dữ liệu (AsyncStorage)**:
   - Tự động lưu mọi thay đổi vào bộ nhớ máy.
   - Lần đầu chạy khởi tạo 6 công việc mẫu linh hoạt theo ngày hiện tại.
   - Dữ liệu luôn được lưu giữ nguyên vẹn khi tắt mở lại ứng dụng.

---

## 📦 Hướng dẫn nộp bài (Đóng gói Project)

Khi nén thư mục project để nộp bài, **BẮT BUỘC BỎ** các thư mục sau để giảm dung lượng file nén:
- ❌ `node_modules/`
- ❌ `android/build/`
- ❌ `android/app/build/`
- ❌ `ios/Pods/`

### Lệnh xoá nhanh các thư mục rác trước khi nén (trên Windows PowerShell):
```powershell
# Xoá thư mục build của Android
Remove-Item -Recurse -Force android/build, android/app/build -ErrorAction SilentlyContinue

# Xoá thư mục node_modules (nếu cần nén nhẹ nhất)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

Sau đó nén toàn bộ thư mục gốc của project thành file `.zip` (ví dụ: `PlannerApp.zip`) và tiến hành nộp bài. Người chấm bài chỉ cần giải nén và chạy `npm install` là có thể chạy ứng dụng ngay lập tức.
