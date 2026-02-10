// Mock React
import * as React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(),
  useMemo: jest.fn(),
  useRef: jest.fn(),
}));

// Mock dependencies
jest.mock('react-redux');
jest.mock('@/app/store/doctorSlice');
jest.mock('@/app/utils/utils');
jest.mock('@/app/utils/bookUtils');
jest.mock('@/app/store/bookAsyncStorages');

// Import after mocking
import { useDispatch, useSelector } from 'react-redux';
import { bookTimeSlot } from '@/app/store/doctorSlice';
import { getTimeSlot, equalsIgnoreTime } from '@/app/utils/utils';
import { bookedAvailable } from '@/app/utils/bookUtils';
import * as bookAsyncStorages from '@/app/store/bookAsyncStorages';

const mockUseState = React.useState as jest.MockedFunction<typeof React.useState>;
const mockUseEffect = React.useEffect as jest.MockedFunction<typeof React.useEffect>;
const mockUseCallback = React.useCallback as jest.MockedFunction<typeof React.useCallback>;
const mockUseMemo = React.useMemo as jest.MockedFunction<typeof React.useMemo>;
const mockUseRef = React.useRef as jest.MockedFunction<typeof React.useRef>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockBookTimeSlot = bookTimeSlot as jest.MockedFunction<typeof bookTimeSlot>;
const mockGetTimeSlot = getTimeSlot as jest.MockedFunction<typeof getTimeSlot>;
const mockEqualsIgnoreTime = equalsIgnoreTime as jest.MockedFunction<typeof equalsIgnoreTime>;
const mockBookedAvailable = bookedAvailable as jest.MockedFunction<typeof bookedAvailable>;
const mockAddAllRows = jest.spyOn(bookAsyncStorages, 'addAllRows').mockResolvedValue(true);

// Import the hook
let useTimeSlot: any;
describe('useTimeSlot hook', () => {
  let mockDispatch: jest.Mock;
  let mockSetTimeSlots: jest.Mock;
  let mockCurrentSlot: { current: string };
  let mockDoctor: any;
  let mockSelectedDate: number;
  let mockOnlyView: boolean;
  let mockAllBookedList: any[];
  let mockTimeSlots: any[];
  let mockDate: Date;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock data
    mockDoctor = {
      id: '1',
      name: 'Dr. Smith',
      timezone: 'America/New_York',
      available_at: '09:00',
      available_until: '17:00',
      day_of_week: ['Monday', 'Wednesday', 'Friday'],
    };
    mockSelectedDate = new Date().getTime();
    mockOnlyView = false;
    mockAllBookedList = [
      {
        id: '1',
        doctorName: 'Dr. Smith',
        date: mockSelectedDate,
        time: '09:00',
        isBooked: true,
      },
    ];
    mockTimeSlots = [
      {
        timezone: 'America/New_York',
        time: '09:00',
        isBooked: true,
      },
      {
        timezone: 'America/New_York',
        time: '10:00',
        isBooked: false,
      },
    ];
    mockDate = new Date(mockSelectedDate);
    
    // Setup mock functions
    mockDispatch = jest.fn();
    mockSetTimeSlots = jest.fn();
    mockCurrentSlot = { current: '' };
    
    // Mock useState
    let useStateCallCount = 0;
    mockUseState.mockImplementation(() => {
      switch (useStateCallCount++) {
        case 0:
          return [mockTimeSlots, mockSetTimeSlots];
        default:
          return [undefined, jest.fn()];
      }
    });
    
    // Mock useRef
    mockUseRef.mockReturnValue(mockCurrentSlot);
    
    // Mock useDispatch
    mockUseDispatch.mockReturnValue(mockDispatch);
    
    // Mock useMemo
    mockUseMemo.mockImplementation((callback) => {
      return callback();
    });
    
    // Mock useCallback
    mockUseCallback.mockImplementation((callback) => {
      return callback;
    });
    
    // Mock useEffect
    mockUseEffect.mockImplementation((callback) => {
      // Execute the callback immediately for testing
      callback();
    });
    
    // Mock utils functions
    mockGetTimeSlot.mockReturnValue(['09:00', '10:00', '11:00']);
    mockEqualsIgnoreTime.mockReturnValue(true);
    mockBookedAvailable.mockReturnValue(true);
    
    // Mock Redux actions
    mockBookTimeSlot.mockReturnValue({ 
      type: 'doctor/bookTimeSlot', 
      payload: { 
        doctor: mockDoctor, 
        dateTime: mockSelectedDate, 
        time: '09:00' 
      } 
    });
    
    // Mock useSelector
    mockUseSelector.mockImplementation((selector) => {
      const mockState = {
        doctor: {
          selectedDoctor: mockDoctor,
          selectedDate: mockSelectedDate,
          onlyView: mockOnlyView,
          bookedTimeSlots: mockAllBookedList,
        },
      };
      return selector(mockState as any);
    });
    
    // Import the hook here to ensure mocks are active
    useTimeSlot = require('@/app/profiles/hooks/useTimeSlot').useTimeSlot;
  });
  
  describe('initialization logic', () => {
    it('should initialize time slots based on doctor and selected date', () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Verify getTimeSlot was called with doctor and date
      expect(mockGetTimeSlot).toHaveBeenCalledWith(mockDoctor, mockDate);
      
      // Verify setTimeSlots was called
      expect(mockSetTimeSlots).toHaveBeenCalled();
      
      // Verify timeSlots is returned
      expect(result.timeSlots).toEqual(mockTimeSlots);
    });
  });
  
  describe('isBooked method', () => {
    it('should return true if time slot is booked', () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Test with booked time slot
      const isBooked = result.isBooked('09:00');
      
      // Verify it returns true
      expect(isBooked).toBe(true);
    });
    
    it('should return false if time slot is not booked', () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Test with non-booked time slot
      const isBooked = result.isBooked('10:00');
      
      // Verify it returns false
      expect(isBooked).toBe(false);
    });
    
    it('should return false if bookedList is empty', () => {
      // Mock empty bookedList
      mockAllBookedList = [];
      
      // Clear mocks and re-setup
      jest.clearAllMocks();
      mockUseState.mockReturnValue([mockTimeSlots, mockSetTimeSlots]);
      mockUseRef.mockReturnValue(mockCurrentSlot);
      mockUseDispatch.mockReturnValue(mockDispatch);
      mockUseMemo.mockImplementation((callback) => callback());
      mockUseCallback.mockImplementation((callback) => callback);
      mockUseEffect.mockImplementation((callback) => callback());
      mockGetTimeSlot.mockReturnValue(['09:00', '10:00', '11:00']);
      mockEqualsIgnoreTime.mockReturnValue(true);
      mockBookedAvailable.mockReturnValue(true);
      mockBookTimeSlot.mockReturnValue({ 
        type: 'doctor/bookTimeSlot', 
        payload: { 
          doctor: mockDoctor, 
          dateTime: mockSelectedDate, 
          time: '09:00' 
        } 
      });
      mockUseSelector.mockImplementation((selector) => {
        const mockState = {
          doctor: {
            selectedDoctor: mockDoctor,
            selectedDate: mockSelectedDate,
            onlyView: mockOnlyView,
            bookedTimeSlots: [],
          },
        };
        return selector(mockState as any);
      });
      
      // Re-import the hook
      useTimeSlot = require('@/app/profiles/hooks/useTimeSlot').useTimeSlot;
      
      // Call the hook
      const result = useTimeSlot();
      
      // Test with any time slot
      const isBooked = result.isBooked('09:00');
      
      // Verify it returns false
      expect(isBooked).toBe(false);
    });
  });
  
  describe('bookSlot method', () => {
    it('should dispatch bookTimeSlot and update timeSlots', async () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Set currentSlot
      result.currentSlot.current = '09:00';
      
      // Call bookSlot
      await result.bookSlot();
      
      // Verify bookTimeSlot was dispatched
      expect(mockDispatch).toHaveBeenCalled();
      
      // Verify setTimeSlots was called to update isBooked status
      expect(mockSetTimeSlots).toHaveBeenCalled();
    });
    
    it('should not do anything if currentSlot is empty', async () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Reset mocks after initialization
      mockDispatch.mockClear();
      mockSetTimeSlots.mockClear();
      
      // currentSlot is empty by default
      result.currentSlot.current = '';
      
      // Call bookSlot
      await result.bookSlot();
      
      // Verify no actions were called
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetTimeSlots).not.toHaveBeenCalled();
    });
  });
  
  describe('canBooked method', () => {
    it('should return true if booking is available', () => {
      // Call the hook
      const result = useTimeSlot();
      
      // Test canBooked
      const canBook = result.canBooked('09:00', 'America/New_York');
      
      // Verify bookedAvailable was called
      expect(mockBookedAvailable).toHaveBeenCalledWith(mockDate, 'America/New_York', '09:00');
      
      // Verify it returns true
      expect(canBook).toBe(true);
    });
    
    it('should return false if selectedDate is not set', () => {
      // Clear mocks and re-setup with empty selectedDate
      jest.clearAllMocks();
      mockUseState.mockReturnValue([mockTimeSlots, mockSetTimeSlots]);
      mockUseRef.mockReturnValue(mockCurrentSlot);
      mockUseDispatch.mockReturnValue(mockDispatch);
      mockUseMemo.mockImplementation((callback) => callback());
      mockUseCallback.mockImplementation((callback) => callback);
      mockUseEffect.mockImplementation((callback) => callback());
      mockGetTimeSlot.mockReturnValue(['09:00', '10:00', '11:00']);
      mockEqualsIgnoreTime.mockReturnValue(true);
      mockBookedAvailable.mockReturnValue(true);
      mockBookTimeSlot.mockReturnValue({ 
        type: 'doctor/bookTimeSlot', 
        payload: { 
          doctor: mockDoctor, 
          dateTime: mockSelectedDate, 
          time: '09:00' 
        } 
      });
      mockUseSelector.mockImplementation((selector) => {
        const mockState = {
          doctor: {
            selectedDoctor: mockDoctor,
            selectedDate: 0,
            onlyView: mockOnlyView,
            bookedTimeSlots: mockAllBookedList,
          },
        };
        return selector(mockState as any);
      });
      
      // Re-import the hook
      useTimeSlot = require('@/app/profiles/hooks/useTimeSlot').useTimeSlot;
      
      // Call the hook
      const result = useTimeSlot();
      
      // Test canBooked
      const canBook = result.canBooked('09:00', 'America/New_York');
      
      // Verify it returns false
      expect(canBook).toBe(false);
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty doctor', () => {
      // Clear mocks and re-setup with null doctor
      jest.clearAllMocks();
      mockUseState.mockReturnValue([[], mockSetTimeSlots]);
      mockUseRef.mockReturnValue(mockCurrentSlot);
      mockUseDispatch.mockReturnValue(mockDispatch);
      mockUseMemo.mockImplementation((callback) => callback());
      mockUseCallback.mockImplementation((callback) => callback);
      mockUseEffect.mockImplementation((callback) => callback());
      mockGetTimeSlot.mockReturnValue(['09:00', '10:00', '11:00']);
      mockEqualsIgnoreTime.mockReturnValue(true);
      mockBookedAvailable.mockReturnValue(true);
      mockBookTimeSlot.mockReturnValue({ 
        type: 'doctor/bookTimeSlot', 
        payload: { 
          doctor: mockDoctor, 
          dateTime: mockSelectedDate, 
          time: '09:00' 
        } 
      });
      mockUseSelector.mockImplementation((selector) => {
        const mockState = {
          doctor: {
            selectedDoctor: null,
            selectedDate: mockSelectedDate,
            onlyView: mockOnlyView,
            bookedTimeSlots: mockAllBookedList,
          },
        };
        return selector(mockState as any);
      });
      
      // Re-import the hook
      useTimeSlot = require('@/app/profiles/hooks/useTimeSlot').useTimeSlot;
      
      // Call the hook
      const result = useTimeSlot();
      
      // Verify timeSlots is empty
      expect(result.timeSlots).toEqual([]);
    });
    
    it('should handle doctor without available times', () => {
      // Mock doctor without available_at and available_until
      mockDoctor = {
        id: '1',
        name: 'Dr. Smith',
        timezone: 'America/New_York',
      };
      
      // Re-import the hook with updated mock
      jest.isolateModules(() => {
        useTimeSlot = require('@/app/profiles/hooks/useTimeSlot').useTimeSlot;
      });
      
      // Call the hook
      const result = useTimeSlot();
      
      // Verify setTimeSlots was called with empty array
      expect(mockSetTimeSlots).toHaveBeenCalledWith([]);
    });
  });
});
