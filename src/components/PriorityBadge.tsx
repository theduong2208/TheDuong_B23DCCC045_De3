import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Priority } from '../types';
import { colors, radius, spacing, fontSize } from '../theme/colors';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; bg: string; text: string; icon: string }
> = {
  Cao: {
    label: 'Cao',
    bg: colors.priorityCaoBg,
    text: colors.priorityCao,
    icon: '⚡',
  },
  'Trung bình': {
    label: 'Trung bình',
    bg: colors.priorityTrungBinhBg,
    text: colors.priorityTrungBinh,
    icon: '⏳',
  },
  Thấp: {
    label: 'Thấp',
    bg: colors.priorityThapBg,
    text: colors.priorityThap,
    icon: '🌱',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'small',
}) => {
  const config = PRIORITY_CONFIG[priority];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        { backgroundColor: config.bg },
      ]}
    >
      <Text
        style={[
          styles.text,
          isSmall ? styles.textSmall : styles.textMedium,
          { color: config.text },
        ]}
      >
        {config.icon} {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSmall: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  badgeMedium: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  text: {
    fontWeight: '700',
  },
  textSmall: {
    fontSize: fontSize.xs,
  },
  textMedium: {
    fontSize: fontSize.sm,
  },
});
