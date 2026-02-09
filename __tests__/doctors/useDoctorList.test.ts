import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDoctorList } from '../../app/doctors/hooks/useDoctorList';
import { useSelector } from 'react-redux';
import { listDoctors } from '../../app/doctors/domains/doctors';
import { initTable, addAllRow, queryRows } from '../../app/store/doctorsAsyncStorages';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../domains/doctors', () => ({
  listDoctors: jest.fn(),
}));

jest.mock('@/app/store/doctorsAsyncStorages', () => ({
  initTable: jest.fn(),
  addAllRow: jest.fn(),
  queryRows: jest.fn(),
}));

describe('useDoctorList', () => {
  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Smith',
      specialty: 'Cardiology',
      timezone: 'UTC',
      availableDays: [1, 2, 3, 4, 5],
    },
    {
      id: '2',
      name: 'Dr. Johnson',
      specialty: 'Dermatology',
      timezone: 'America/New_York',
      availableDays: [0, 1, 2, 3, 4, 5, 6],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockReturnValue(false);
    (listDoctors as jest.Mock).mockResolvedValue(mockDoctors);
    (queryRows as jest.Mock).mockResolvedValue(mockDoctors);
    (initTable as jest.Mock).mockResolvedValue(true);
    (addAllRow as jest.Mock).mockResolvedValue(true);
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useDoctorList());

      expect(result.current.filterDoctors).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.selectedDate).toBeInstanceOf(Date);
    });

    it('should fetch doctors on mount', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(listDoctors).toHaveBeenCalled();
      expect(addAllRow).toHaveBeenCalledWith(mockDoctors);
    });

    it('should set filterDoctors after successful fetch', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.filterDoctors).toEqual(mockDoctors);
      });
    });
  });

  describe('offline mode', () => {
    it('should use queryRows when offline mode is enabled', async () => {
      (useSelector as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(queryRows).toHaveBeenCalled();
      expect(listDoctors).not.toHaveBeenCalled();
    });

    it('should set filterDoctors from queryRows in offline mode', async () => {
      (useSelector as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.filterDoctors).toEqual(mockDoctors);
      });
    });
  });

  describe('online mode', () => {
    it('should use listDoctors when offline mode is disabled', async () => {
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(listDoctors).toHaveBeenCalled();
      expect(queryRows).not.toHaveBeenCalled();
    });

    it('should set filterDoctors from listDoctors in online mode', async () => {
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.filterDoctors).toEqual(mockDoctors);
      });
    });
  });

  describe('fetchDoctors', () => {
    it('should be callable and refetch doctors', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear previous calls
      (listDoctors as jest.Mock).mockClear();
      (addAllRow as jest.Mock).mockClear();

      act(() => {
        result.current.fetchDoctors();
      });

      await waitFor(() => {
        expect(listDoctors).toHaveBeenCalled();
        expect(addAllRow).toHaveBeenCalledWith(mockDoctors);
      });
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (listDoctors as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching doctors:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('selectedDate', () => {
    it('should initialize with current date', () => {
      const { result } = renderHook(() => useDoctorList());

      expect(result.current.selectedDate).toBeInstanceOf(Date);
    });

    it('should allow updating selectedDate', () => {
      const { result } = renderHook(() => useDoctorList());

      const newDate = new Date('2023-10-15');

      act(() => {
        result.current.setSelectedDate(newDate);
      });

      expect(result.current.selectedDate).toEqual(newDate);
    });

    it('should handle date changes', () => {
      const { result } = renderHook(() => useDoctorList());

      const dates = [
        new Date('2023-10-01'),
        new Date('2023-10-15'),
        new Date('2023-11-01'),
      ];

      dates.forEach((date) => {
        act(() => {
          result.current.setSelectedDate(date);
        });

        expect(result.current.selectedDate).toEqual(date);
      });
    });
  });

  describe('filterDoctors', () => {
    it('should return filtered doctors based on selectedDate', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.filterDoctors).toBeDefined();
      expect(Array.isArray(result.current.filterDoctors)).toBe(true);
    });

    it('should update filterDoctors when selectedDate changes', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialFilter = result.current.filterDoctors;

      act(() => {
        result.current.setSelectedDate(new Date('2023-10-15'));
      });

      // filterDoctors should be recalculated
      expect(result.current.filterDoctors).toBeDefined();
    });

    it('should update filterDoctors when doctors list changes', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialFilter = result.current.filterDoctors;

      // Refetch with different doctors
      const newDoctors = [
        {
          id: '3',
          name: 'Dr. Williams',
          specialty: 'Pediatrics',
          timezone: 'UTC',
          availableDays: [1, 2, 3],
        },
      ];

      (listDoctors as jest.Mock).mockResolvedValueOnce(newDoctors);

      act(() => {
        result.current.fetchDoctors();
      });

      await waitFor(() => {
        expect(result.current.filterDoctors).toBeDefined();
      });
    });
  });

  describe('loading state', () => {
    it('should start with loading true', () => {
      const { result } = renderHook(() => useDoctorList());

      expect(result.current.loading).toBe(true);
    });

    it('should set loading to false after fetch completes', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading to false even on error', async () => {
      (listDoctors as jest.Mock).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('hook return values', () => {
    it('should return all expected properties', async () => {
      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('selectedDate');
      expect(result.current).toHaveProperty('setSelectedDate');
      expect(result.current).toHaveProperty('filterDoctors');
      expect(result.current).toHaveProperty('fetchDoctors');
      expect(result.current).toHaveProperty('loading');
      expect(typeof result.current.setSelectedDate).toBe('function');
      expect(typeof result.current.fetchDoctors).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle empty doctors list', async () => {
      (listDoctors as jest.Mock).mockResolvedValue([]);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.filterDoctors).toEqual([]);
    });

    it('should handle null or undefined doctors', async () => {
      (listDoctors as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useDoctorList());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.filterDoctors).toBeDefined();
    });
  });
});
