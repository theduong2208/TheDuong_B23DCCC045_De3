import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  Category,
  Priority,
  TaskFormScreenProps,
} from '../types';
import { CATEGORIES, PRIORITIES } from '../types';
import { useTasks } from '../context/TaskContext';
import { parseDate, getToday, formatDate } from '../utils/dateUtils';
import { AppButton } from '../components/AppButton';
import { colors, radius, spacing, fontSize } from '../theme/colors';

interface FormErrors {
  title?: string;
  dueDate?: string;
}

export const TaskFormScreen: React.FC<TaskFormScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { addTask, updateTask } = useTasks();

  const existingTask = route.params?.task;
  const isEditing = Boolean(existingTask);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Sửa công việc' : 'Thêm công việc',
    });
  }, [navigation, isEditing]);

  const [title, setTitle] = useState<string>(existingTask?.title ?? '');
  const [note, setNote] = useState<string>(existingTask?.note ?? '');
  const [category, setCategory] = useState<Category>(
    existingTask?.category ?? 'Học tập',
  );
  const [priority, setPriority] = useState<Priority>(
    existingTask?.priority ?? 'Trung bình',
  );
  const [dueDate, setDueDate] = useState<string>(
    existingTask?.dueDate ?? formatDate(getToday()),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedDue = dueDate.trim();

    // 1. Validate Tên công việc
    if (!trimmedTitle) {
      newErrors.title = 'Tên công việc không được để trống';
    } else if (trimmedTitle.length > 50) {
      newErrors.title = 'Tên công việc không được vượt quá 50 ký tự';
    }

    // 2. Validate Ngày đến hạn
    if (!trimmedDue) {
      newErrors.dueDate = 'Hạn hoàn thành không được để trống';
    } else {
      const parsed = parseDate(trimmedDue);
      if (!parsed) {
        newErrors.dueDate =
          'Ngày không hợp lệ. Vui lòng nhập đúng định dạng dd/mm/yyyy';
      } else if (!isEditing) {
        // Khi THÊM MỚI hạn không được trước hôm nay
        const today = getToday();
        if (parsed.getTime() < today.getTime()) {
          newErrors.dueDate = 'Hạn hoàn thành không được trước hôm nay';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedNote = note.trim();
    const trimmedDue = dueDate.trim();

    if (isEditing && existingTask) {
      updateTask(existingTask.id, {
        title: trimmedTitle,
        note: trimmedNote,
        category,
        priority,
        dueDate: trimmedDue,
      });
    } else {
      addTask({
        title: trimmedTitle,
        note: trimmedNote,
        category,
        priority,
        dueDate: trimmedDue,
      });
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (insets.bottom > 0 ? insets.bottom : spacing.md) + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tên công việc */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Tên công việc *</Text>
            <Text style={styles.charCounter}>{title.length}/50</Text>
          </View>
          <TextInput
            style={[styles.input, Boolean(errors.title) && styles.inputError]}
            placeholder="Nhập tên công việc..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={text => {
              setTitle(text);
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
            maxLength={50}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}
        </View>

        {/* Danh mục (Hàng nút bấm) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Danh mục</Text>
          <View style={styles.choiceRow}>
            {CATEGORIES.map(cat => {
              const selected = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={({ pressed }) => [
                    styles.choiceBtn,
                    selected && styles.choiceBtnSelected,
                    pressed && styles.choiceBtnPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceBtnText,
                      selected && styles.choiceBtnTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Mức ưu tiên (Hàng nút bấm) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mức ưu tiên</Text>
          <View style={styles.choiceRow}>
            {PRIORITIES.map(pri => {
              const selected = priority === pri;
              return (
                <Pressable
                  key={pri}
                  onPress={() => setPriority(pri)}
                  style={({ pressed }) => [
                    styles.choiceBtn,
                    selected && styles.choiceBtnSelected,
                    pressed && styles.choiceBtnPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceBtnText,
                      selected && styles.choiceBtnTextSelected,
                    ]}
                  >
                    {pri}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Hạn hoàn thành */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hạn hoàn thành (dd/mm/yyyy) *</Text>
          <TextInput
            style={[styles.input, Boolean(errors.dueDate) && styles.inputError]}
            placeholder="dd/mm/yyyy (ví dụ: 28/10/2026)"
            placeholderTextColor={colors.textMuted}
            value={dueDate}
            onChangeText={text => {
              setDueDate(text);
              if (errors.dueDate) {
                setErrors(prev => ({ ...prev, dueDate: undefined }));
              }
            }}
            keyboardType="numbers-and-punctuation"
          />
          {errors.dueDate ? (
            <Text style={styles.errorText}>{errors.dueDate}</Text>
          ) : null}
        </View>

        {/* Ghi chú */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Thêm mô tả, ghi chú chi tiết..."
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Nút thao tác */}
        <View style={styles.footerButtons}>
          <AppButton
            title={isEditing ? 'Lưu thay đổi' : 'Thêm công việc'}
            onPress={handleSave}
            variant="primary"
            style={styles.submitBtn}
          />
          <AppButton
            title="Huỷ bỏ"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={styles.cancelBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  charCounter: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  choiceBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  choiceBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceBtnPressed: {
    opacity: 0.8,
  },
  choiceBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  choiceBtnTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  footerButtons: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  submitBtn: {
    width: '100%',
  },
  cancelBtn: {
    width: '100%',
  },
});
