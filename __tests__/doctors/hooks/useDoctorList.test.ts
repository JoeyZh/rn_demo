import { listDoctors } from '@/app/doctors/domains/doctors';
import { filterDoctorOfWeekDay } from '@/app/utils/utils';
import { addAllRow, queryRows, getOffline } from '@/app/store/doctorsAsyncStorages';

// Mock React
import * as React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(),
  useMemo: jest.fn(),
}));

// Mock dependencies
jest.mock('@/app/doctors/domains/doctors');
jest.mock('@/app/utils/utils');
jest.mock('@/app/store/doctorsAsyncStorages');

const mockUseState = React.useState as jest.MockedFunction<typeof React.useState>;
const mockUseEffect = React.useEffect as jest.MockedFunction<typeof React.useEffect>;
const mockUseCallback = React.useCallback as jest.MockedFunction<typeof React.useCallback>;
const mockUseMemo = React.useMemo as jest.MockedFunction<typeof React.useMemo>;
const mockListDoctors = listDoctors as jest.MockedFunction<typeof listDoctors>;
const mockFilterDoctorOfWeekDay = filterDoctorOfWeekDay as jest.MockedFunction<typeof filterDoctorOfWeekDay>;
const mockAddAllRow = addAllRow as jest.MockedFunction<typeof addAllRow>;
const mockQueryRows = queryRows as jest.MockedFunction<typeof queryRows>;
const mockGetOffline = getOffline as jest.MockedFunction<typeof getOffline>;

// Import the hook
let useDoctorList: any;
describe('useDoctorList hook', () => {
  let mockSetDoctors: jest.Mock;
  let mockSetSelectedDate: jest.Mock;
  let mockSetLoading: jest.Mock;
  let mockDoctors: any[];
  let mockFilteredDoctors: any[];
  let mockSelectedDate: Date;
  let mockLoading: boolean;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock data
    mockDoctors = [
      {
        id: '1',
        name: 'Dr. Smith',
        day_of_week: ['Monday', 'Wednesday', 'Friday'],
        // Add other required fields
      },
      {
        id: '2',
        name: 'Dr. Johnson',
        day_of_week: ['Tuesday', 'Thursday', 'Saturday'],
        // Add other required fields
      },
    ];
    mockFilteredDoctors = [mockDoctors[0]];
    mockSelectedDate = new Date();
    mockLoading = true;
    
    // Setup mock functions
    mockSetDoctors = jest.fn();
    mockSetSelectedDate = jest.fn();
    mockSetLoading = jest.fn();
    
    // Mock useState
    let useStateCallCount = 0;
    mockUseState.mockImplementation(() => {
      switch (useStateCallCount++) {
        case 0:
          return [mockDoctors, mockSetDoctors];
        case 1:
          return [mockSelectedDate, mockSetSelectedDate];
        case 2:
          return [mockLoading, mockSetLoading];
        default:
          return [undefined, jest.fn()];
      }
    });
    
    // Mock useEffect
    mockUseEffect.mockImplementation((callback) => {
      // Execute the callback immediately for testing
      callback();
    });
    
    // Mock useCallback
    mockUseCallback.mockImplementation((callback) => {
      return callback;
    });
    
    // Mock useMemo
    mockUseMemo.mockImplementation((callback) => {
      return callback();
    });
    
    // Mock utils functions
    mockFilterDoctorOfWeekDay.mockReturnValue(mockFilteredDoctors);
    
    // Mock async functions
    mockGetOffline.mockResolvedValue(false);
    mockListDoctors.mockResolvedValue(mockDoctors);
    mockQueryRows.mockResolvedValue(mockDoctors);
    mockAddAllRow.mockResolvedValue(true);
    
    // Import the hook here to ensure mocks are active
    useDoctorList = require('@/app/doctors/hooks/useDoctorList').useDoctorList;
  });
  
  describe('initialization logic', () => {
    it('should initialize and fetch doctors on mount', () => {
      // Call the hook
      const result = useDoctorList();
      
      // Verify useEffect was called with fetchDoctors
      expect(mockUseEffect).toHaveBeenCalled();
      
      // Verify loading state is true initially
      expect(result.loading).toBe(true);
    });
  });
  
  describe('fetchDoctors method', () => {
    it('should fetch doctors in online mode', async () => {
      // Mock getOffline to return false (online mode)
      mockGetOffline.mockResolvedValue(false);
      
      // Call the hook
      const result = useDoctorList();
      
      // Call fetchDoctors
      await result.fetchDoctors();
      
      // Verify getOffline was called
      expect(mockGetOffline).toHaveBeenCalled();
      
      // Verify listDoctors was called (online mode)
      expect(mockListDoctors).toHaveBeenCalled();
      
      // Verify setDoctors was called with data
      expect(mockSetDoctors).toHaveBeenCalledWith(mockDoctors);
      
      // Verify addAllRow was called to cache data
      expect(mockAddAllRow).toHaveBeenCalledWith(mockDoctors);
      
      // Verify loading was set to false
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
    
    it('should fetch doctors from storage in offline mode', async () => {
      // Mock getOffline to return true (offline mode)
      mockGetOffline.mockResolvedValue(true);
      
      // Call the hook
      const result = useDoctorList();
      
      // Call fetchDoctors
      await result.fetchDoctors();
      
      // Verify queryRows was called (offline mode)
      expect(mockQueryRows).toHaveBeenCalled();
      
      // Verify setDoctors was called with data
      expect(mockSetDoctors).toHaveBeenCalledWith(mockDoctors);
    });
    
    it('should handle errors gracefully', async () => {
      // Mock getOffline to throw an error
      mockGetOffline.mockRejectedValue(new Error('Network error'));
      
      // Call the hook
      const result = useDoctorList();
      
      // Call fetchDoctors
      await result.fetchDoctors();
      
      // Verify loading was set to false even on error
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
  
  describe('filterDoctors calculation', () => {
    it('should filter doctors based on selected date', () => {
      // Call the hook
      const result = useDoctorList();
      
      // Verify filterDoctorOfWeekDay was called with doctors and selectedDate
      expect(mockFilterDoctorOfWeekDay).toHaveBeenCalledWith(mockDoctors, mockSelectedDate);
      
      // Verify filterDoctors is returned
      expect(result.filterDoctors).toEqual(mockFilteredDoctors);
    });
  });
  
  describe('setSelectedDate method', () => {
    it('should update selected date', () => {
      // Call the hook
      const result = useDoctorList();
      
      // Test date
      const testDate = new Date('2023-12-01');
      
      // Call setSelectedDate
      result.setSelectedDate(testDate);
      
      // Verify setSelectedDate was called
      expect(mockSetSelectedDate).toHaveBeenCalledWith(testDate);
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty doctors array', async () => {
      // Mock listDoctors to return empty array
      mockListDoctors.mockResolvedValue([]);
      
      // Call the hook
      const result = useDoctorList();
      
      // Call fetchDoctors
      await result.fetchDoctors();
      
      // Verify setDoctors was called with empty array
      expect(mockSetDoctors).toHaveBeenCalledWith([]);
      
      // Verify addAllRow was called with empty array
      expect(mockAddAllRow).toHaveBeenCalledWith([]);
    });
    
    it('should handle filterDoctorOfWeekDay returning empty array', () => {
      // Mock filterDoctorOfWeekDay to return empty array
      mockFilterDoctorOfWeekDay.mockReturnValue([]);
      
      // Call the hook
      const result = useDoctorList();
      
      // Verify filterDoctors is empty array
      expect(result.filterDoctors).toEqual([]);
    });
  });
});
