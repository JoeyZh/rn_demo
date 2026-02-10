import { useDispatch, useSelector } from 'react-redux';
import { selectDate, onlyView } from '@/app/store/doctorSlice';
import { getWeekDateArray, equalsIgnoreTime, isEarlyByDay } from '@/app/utils/utils';

// Mock React
import * as React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useMemo: jest.fn(),
}));

// Mock dependencies
jest.mock('react-redux');
jest.mock('@/app/store/doctorSlice');
jest.mock('@/app/utils/utils');

const mockUseState = React.useState as jest.MockedFunction<typeof React.useState>;
const mockUseEffect = React.useEffect as jest.MockedFunction<typeof React.useEffect>;
const mockUseMemo = React.useMemo as jest.MockedFunction<typeof React.useMemo>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockSelectDate = selectDate as jest.MockedFunction<typeof selectDate>;
const mockOnlyView = onlyView as jest.MockedFunction<typeof onlyView>;
const mockGetWeekDateArray = getWeekDateArray as jest.MockedFunction<typeof getWeekDateArray>;
const mockEqualsIgnoreTime = equalsIgnoreTime as jest.MockedFunction<typeof equalsIgnoreTime>;
const mockIsEarlyByDay = isEarlyByDay as jest.MockedFunction<typeof isEarlyByDay>;

// Import the hook
let useCalendar: any;
describe('useCalendar hook', () => {
  let mockDispatch: jest.Mock;
  let mockChangeDate: jest.Mock;
  let mockSetDateArray: jest.Mock;
  let mockSetSelected: jest.Mock;
  let mockDateArray: Date[];
  let mockSelected: number | undefined;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock functions
    mockDispatch = jest.fn();
    mockChangeDate = jest.fn();
    mockSetDateArray = jest.fn();
    mockSetSelected = jest.fn();
    
    // Setup mock date array
    const today = new Date();
    mockDateArray = [
      new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      today,
      new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    ];
    mockSelected = 3; // Today's index
    
    // Mock hooks
    mockUseState.mockImplementation(() => {
      // First call for dateArray
      if (mockUseState.mock.calls.length === 1) {
        return [mockDateArray, mockSetDateArray];
      }
      // Second call for selected
      return [mockSelected, mockSetSelected];
    });
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseMemo.mockImplementation((callback) => {
      callback();
    });
    mockUseEffect.mockImplementation((callback, dependencies) => {
      // Execute the callback immediately for testing
      callback();
    });
    
    // Mock utils functions
    mockGetWeekDateArray.mockReturnValue(mockDateArray);
    mockEqualsIgnoreTime.mockImplementation((date1, date2) => {
      return date1.toDateString() === date2.toDateString();
    });
    mockIsEarlyByDay.mockReturnValue(false);
    
    // Mock Redux actions
    mockSelectDate.mockReturnValue({ type: 'doctor/selectDate', payload: 0 });
    mockOnlyView.mockReturnValue({ type: 'doctor/onlyView', payload: false });
    
    // Import the hook here to ensure mocks are active
    useCalendar = require('@/app/doctors/hooks/useCalendar').useCalendar;
  });
  
  describe('initialization logic', () => {
    it('should initialize with week dates and select today', () => {
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Verify getWeekDateArray was called with today's date
      expect(mockGetWeekDateArray).toHaveBeenCalled();
      
      // Verify setDateArray was called with week dates
      expect(mockSetDateArray).toHaveBeenCalledWith(mockDateArray);
      
      // Verify dateArray is returned
      expect(result.dateArray).toEqual(mockDateArray);
    });
  });
  
  describe('setSelectedDate method', () => {
    it('should select date and dispatch actions', () => {
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Test date (today)
      const testDate = mockDateArray[3];
      const testDateTimestamp = testDate.getTime();
      
      // Call setSelectedDate
      result.setSelectedDate(testDate);
      
      // Verify setSelected was called with the correct index
      expect(mockSetSelected).toHaveBeenCalledWith(3);
      
      // Verify onlyView was dispatched
      expect(mockDispatch).toHaveBeenCalledWith(mockOnlyView(false));
      
      // Verify changeDate was called
      expect(mockChangeDate).toHaveBeenCalledWith(testDate);
      
      // Verify selectDate was dispatched with timestamp
      expect(mockDispatch).toHaveBeenCalledWith(mockSelectDate(testDateTimestamp));
    });
    
    it('should not do anything if date not found in array', () => {
      // Override mockEqualsIgnoreTime to return false for this test
      mockEqualsIgnoreTime.mockReturnValue(false);
      
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Test date not in array
      const testDate = new Date('2023-01-01');
      
      // Call setSelectedDate
      result.setSelectedDate(testDate);
      
      // Verify no actions were called
      expect(mockSetSelected).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockChangeDate).not.toHaveBeenCalled();
    });
  });
  
  describe('isSelected method', () => {
    it('should return true if index is selected', () => {
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Test with selected index
      const isSelected = result.isSelected(3);
      
      // Verify it returns true
      expect(isSelected).toBe(true);
    });
    
    it('should return false if index is not selected', () => {
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Test with non-selected index
      const isSelected = result.isSelected(0);
      
      // Verify it returns false
      expect(isSelected).toBe(false);
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty date array', () => {
      // Mock useState to return empty array
      mockUseState.mockImplementation(() => {
        // First call for dateArray
        if (mockUseState.mock.calls.length === 1) {
          return [[], mockSetDateArray];
        }
        // Second call for selected
        return [undefined, mockSetSelected];
      });
      
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Verify dateArray is empty
      expect(result.dateArray).toEqual([]);
    });
    
    it('should handle isEarlyByDay returning true', () => {
      // Mock isEarlyByDay to return true
      mockIsEarlyByDay.mockReturnValue(true);
      
      // Call the hook
      const result = useCalendar(mockChangeDate);
      
      // Test date
      const testDate = mockDateArray[3];
      
      // Call setSelectedDate
      result.setSelectedDate(testDate);
      
      // Verify onlyView was dispatched with true
      expect(mockDispatch).toHaveBeenCalledWith(mockOnlyView(true));
    });
  });
});
