import { renderHook, act } from '@testing-library/react-native';
import { useCalendar } from '../../app/doctors/hooks/useCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { selectDate } from '../../app/store/doctorSlice';
import { getWeekDateArray, equalsIgnoreTime } from '../../app/utils/utils';

// Mock dependencies
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/app/store/doctorSlice', () => ({
  selectDate: jest.fn(),
}));

jest.mock('@/app/utils/utils', () => ({
  getWeekDateArray: jest.fn(),
  equalsIgnoreTime: jest.fn(),
}));

describe('useCalendar', () => {
  const mockDispatch = jest.fn();
  const mockChangeDate = jest.fn();
  const mockWeekDates = [
    new Date('2023-10-01'),
    new Date('2023-10-02'),
    new Date('2023-10-03'),
    new Date('2023-10-04'),
    new Date('2023-10-05'),
    new Date('2023-10-06'),
    new Date('2023-10-07'),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (getWeekDateArray as jest.Mock).mockReturnValue(mockWeekDates);
    (equalsIgnoreTime as jest.Mock).mockImplementation((date1: Date, date2: Date) => {
      return date1.getTime() === date2.getTime();
    });
  });

  describe('initialization', () => {
    it('should initialize with week date array', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(getWeekDateArray).toHaveBeenCalled();
      expect(result.current.dateArray).toEqual(mockWeekDates);
    });

    it('should select today\'s date on mount', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current.selected).toBe(0);
      expect(mockChangeDate).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('setSelectedDate', () => {
    it('should set selected date and dispatch action', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      act(() => {
        result.current.setSelectedDate(mockWeekDates[2]);
      });

      expect(result.current.selected).toBe(2);
      expect(mockChangeDate).toHaveBeenCalledWith(mockWeekDates[2]);
      expect(mockDispatch).toHaveBeenCalledWith(selectDate(mockWeekDates[2].getTime()));
    });

    it('should not update if date is not in dateArray', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      const initialSelected = result.current.selected;

      act(() => {
        result.current.setSelectedDate(new Date('2023-11-01'));
      });

      expect(result.current.selected).toBe(initialSelected);
      expect(mockChangeDate).not.toHaveBeenCalledWith(new Date('2023-11-01'));
    });

    it('should handle date selection at different indices', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      [1, 3, 5].forEach((index) => {
        act(() => {
          result.current.setSelectedDate(mockWeekDates[index]);
        });

        expect(result.current.selected).toBe(index);
        expect(mockChangeDate).toHaveBeenCalledWith(mockWeekDates[index]);
      });
    });
  });

  describe('isSelected', () => {
    it('should return true for selected index', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current.isSelected(0)).toBe(true);
    });

    it('should return false for non-selected index', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current.isSelected(1)).toBe(false);
      expect(result.current.isSelected(2)).toBe(false);
    });

    it('should update after selecting different date', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      act(() => {
        result.current.setSelectedDate(mockWeekDates[3]);
      });

      expect(result.current.isSelected(3)).toBe(true);
      expect(result.current.isSelected(0)).toBe(false);
    });
  });

  describe('hook return values', () => {
    it('should return dateArray, selected, setSelectedDate, and isSelected', () => {
      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current).toHaveProperty('dateArray');
      expect(result.current).toHaveProperty('selected');
      expect(result.current).toHaveProperty('setSelectedDate');
      expect(result.current).toHaveProperty('isSelected');
      expect(Array.isArray(result.current.dateArray)).toBe(true);
      expect(typeof result.current.setSelectedDate).toBe('function');
      expect(typeof result.current.isSelected).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle empty date array', () => {
      (getWeekDateArray as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current.dateArray).toEqual([]);
    });

    it('should handle single date in array', () => {
      const singleDate = [new Date('2023-10-01')];
      (getWeekDateArray as jest.Mock).mockReturnValue(singleDate);

      const { result } = renderHook(() => useCalendar(mockChangeDate));

      expect(result.current.dateArray).toEqual(singleDate);
      expect(result.current.selected).toBe(0);
    });
  });
});
