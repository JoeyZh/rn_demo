import { renderHook, act } from '@testing-library/react-native';
import { useBook } from '../../app/doctors/hooks/useBook';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectDoctor } from '../../app/store/doctorSlice';

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../app/store/doctorSlice', () => ({
  selectDoctor: jest.fn(),
}));

describe('useBook', () => {
  const mockDispatch = jest.fn() as any;
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
  });

  describe('gotoDetail', () => {
    it('should dispatch selectDoctor action and navigate to profiles', () => {
      const mockDoctor = {
        name: 'Dr. Smith',
        timezone: 'UTC',
        day_of_week: '1,2,3,4,5',
        available_at: '09:00',
        available_until: '17:00',
      };

      const { result } = renderHook(() => useBook());

      act(() => {
        result.current.gotoDetail(mockDoctor);
      });

      expect(mockDispatch).toHaveBeenCalledWith(selectDoctor(mockDoctor));
      expect(mockPush).toHaveBeenCalledWith('/profiles');
    });

    it('should handle doctor with all required fields', () => {
      const mockDoctor = {
        name: 'Dr. Johnson',
        timezone: 'America/New_York',
        day_of_week: '0,1,2,3,4,5,6',
        available_at: '08:00',
        available_until: '18:00',
      };

      const { result } = renderHook(() => useBook());

      act(() => {
        result.current.gotoDetail(mockDoctor);
      });

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSelectedDate', () => {
    it('should return null when selectedDateStr is null', () => {
      (useSelector as unknown as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useBook());

      expect(result.current.getSelectedDate()).toBeNull();
    });

    it('should return Date object when selectedDateStr is provided', () => {
      const dateString = '2023-10-01T10:00:00.000Z';
      (useSelector as unknown as jest.Mock).mockReturnValue(dateString);

      const { result } = renderHook(() => useBook());

      const date = result.current.getSelectedDate();
      expect(date).toBeInstanceOf(Date);
      expect(date?.toISOString()).toBe(dateString);
    });

    it('should handle different date formats', () => {
      const testCases = [
        '2023-10-01',
        '2023-10-01T10:00:00Z',
        '2023-10-01T10:00:00.000Z',
      ];

      testCases.forEach((dateString) => {
        (useSelector as unknown as jest.Mock).mockReturnValue(dateString);

        const { result } = renderHook(() => useBook());

        const date = result.current.getSelectedDate();
        expect(date).toBeInstanceOf(Date);
      });
    });
  });

  describe('hook return values', () => {
    it('should return gotoDetail and getSelectedDate functions', () => {
      const { result } = renderHook(() => useBook());

      expect(result.current).toHaveProperty('gotoDetail');
      expect(result.current).toHaveProperty('getSelectedDate');
      expect(typeof result.current.gotoDetail).toBe('function');
      expect(typeof result.current.getSelectedDate).toBe('function');
    });
  });
});
