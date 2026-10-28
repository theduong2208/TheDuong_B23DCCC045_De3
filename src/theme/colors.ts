export const colors = {
  // Brand & Accent
  primary: '#4F46E5', // Indigo 600
  primaryDark: '#4338CA',
  primaryLight: '#EEF2FF',
  secondary: '#06B6D4', // Cyan 500

  // Neutral & Surfaces
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9', // Slate 100
  surfaceSubtle: '#F8FAFC',

  // Borders
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1', // Slate 300
  borderFocus: '#4F46E5',

  // Typography
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  textInverse: '#FFFFFF',

  // Status & Priorities
  priorityCao: '#EF4444', // Red 500
  priorityCaoBg: '#FEE2E2',
  priorityTrungBinh: '#F59E0B', // Amber 500
  priorityTrungBinhBg: '#FEF3C7',
  priorityThap: '#10B981', // Emerald 500
  priorityThapBg: '#D1FAE5',

  // States
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  success: '#10B981',
  successLight: '#ECFDF5',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Interaction
  disabled: '#CBD5E1',
  disabledText: '#94A3B8',
  overlay: 'rgba(15, 23, 42, 0.4)',
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardActive: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
