import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radius, spacing, fontSize, shadow } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'subtle';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        variant === 'primary' && !disabled && shadow.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <Text
          style={[
            styles.baseText,
            styles[`${variant}Text`],
            disabled && styles.disabledText,
            styles.iconText,
          ]}
        >
          {icon}
        </Text>
      ) : null}
      <Text
        style={[
          styles.baseText,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  subtle: {
    backgroundColor: colors.primaryLight,
  },
  baseText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  dangerText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.primary,
  },
  subtleText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.disabledText,
  },
  iconText: {
    marginRight: spacing.xs,
  },
});
