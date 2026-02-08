// Mock expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    name: 'MedScheduler',
    slug: 'medscheduler',
    version: '1.0.0',
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));
