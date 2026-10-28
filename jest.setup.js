/* eslint-env jest */
const React = require('react');

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: jest.fn((key: string, val: string) => {
      store[key] = val;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(k => delete store[k]);
      return Promise.resolve();
    }),
  };
});

const MockScreenComponent = ({ children }: { children?: React.ReactNode }) => children ?? null;

const MockHeaderConfig = Object.assign(
  ({ children }: { children?: React.ReactNode }) => children ?? null,
  {
    usesNewAndroidHeaderHeightImplementation: false,
  },
);

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: jest.fn(() => false),
  compatibilityFlags: {
    usesNewAndroidHeaderHeightImplementation: false,
  },
  Screen: MockScreenComponent,
  ScreenContainer: MockScreenComponent,
  ScreenStack: MockScreenComponent,
  ScreenStackItem: MockScreenComponent,
  NativeScreen: MockScreenComponent,
  NativeScreenContainer: MockScreenComponent,
  NativeScreenNavigationContainer: MockScreenComponent,
  ScreenStackHeaderConfig: MockHeaderConfig,
  ScreenStackHeaderSubview: MockScreenComponent,
  SearchBar: MockScreenComponent,
  FullWindowOverlay: MockScreenComponent,
}));

const mockInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const mockFrame = { x: 0, y: 0, width: 390, height: 844 };

jest.mock('react-native-safe-area-context', () => {
  const ReactActual = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (insets: typeof mockInsets) => React.ReactNode }) =>
      children(mockInsets),
    useSafeAreaInsets: () => mockInsets,
    useSafeAreaFrame: () => mockFrame,
    SafeAreaInsetsContext: ReactActual.createContext(mockInsets),
    SafeAreaFrameContext: ReactActual.createContext(mockFrame),
  };
});
