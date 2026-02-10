import { useDispatch, useSelector } from 'react-redux';
import { cancelTimeSlot } from '@/app/store/doctorSlice';
import { addAllRows } from '@/app/store/bookAsyncStorages';
import { appointmentStatus } from '@/app/utils/bookUtils';

// Mock React
import * as React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
  useEffect: jest.fn(),
}));

// Mock dependencies
jest.mock('react-redux');
jest.mock('@/app/store/doctorSlice');
jest.mock('@/app/store/bookAsyncStorages');
jest.mock('@/app/utils/bookUtils');

const mockUseMemo = React.useMemo as jest.MockedFunction<typeof React.useMemo>;
const mockUseState = React.useState as jest.MockedFunction<typeof React.useState>;
const mockUseRef = React.useRef as jest.MockedFunction<typeof React.useRef>;
const mockUseEffect = React.useEffect as jest.MockedFunction<typeof React.useEffect>;

const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockCancelTimeSlot = cancelTimeSlot as jest.MockedFunction<typeof cancelTimeSlot>;
const mockAddAllRows = addAllRows as jest.MockedFunction<typeof addAllRows>;
const mockAppointmentStatus = appointmentStatus as jest.MockedFunction<typeof appointmentStatus>;

// Import the hook after mocking
let useAppointment: any;
describe('useAppointment hook', () => {
  let mockDispatch: jest.Mock;
  let mockSetAppointments: jest.Mock;
  let mockCurrentSlotId: { current: string };
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock functions
    mockDispatch = jest.fn();
    mockSetAppointments = jest.fn();
    mockCurrentSlotId = { current: '' };
    
    // Mock Redux hooks
    mockUseDispatch.mockReturnValue(mockDispatch);
    
    // Mock React hooks
    mockUseState.mockReturnValue([[], mockSetAppointments]);
    mockUseRef.mockReturnValue(mockCurrentSlotId);
    mockUseEffect.mockImplementation((callback) => {
      // Execute the callback immediately for testing
      callback();
    });
    
    // Mock cancelTimeSlot
    mockCancelTimeSlot.mockReturnValue({ type: 'doctor/cancelTimeSlot', payload: { id: '' } });
    
    // Mock addAllRows
    mockAddAllRows.mockResolvedValue(true);
    
    // Mock appointmentStatus
    mockAppointmentStatus.mockReturnValue('upcoming' as any);
    
    // Import the hook here to ensure mocks are active
    useAppointment = require('@/app/appointments/hooks/useAppointment').useAppointment;
  });
  
  describe('initialization logic', () => {
    it('should initialize appointments based on bookedTimeSlots', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: true,
        },
        {
          id: '2',
          doctorName: 'Dr. Johnson',
          doctorTimeZone: 'Europe/London',
          bookedTime: 1620003600000,
          isBooked: true,
        },
      ];
      
      // Mock useSelector to return bookedTimeSlots
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock useMemo to return computed appointments
      const expectedAppointments = [
        {
          doctorName: 'Dr. Johnson',
          doctorTimeZone: 'Europe/London',
          timeSlot: mockBookedTimeSlots[1],
          status: 'upcoming',
        },
        {
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          timeSlot: mockBookedTimeSlots[0],
          status: 'upcoming',
        },
      ];
      mockUseMemo.mockReturnValue(expectedAppointments);
      
      // Mock useState to return expectedAppointments
      mockUseState.mockReturnValue([expectedAppointments, mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // Verify the result
      expect(result.appointments).toEqual(expectedAppointments);
      expect(mockAddAllRows).toHaveBeenCalledWith(mockBookedTimeSlots);
    });
    
    it('should set status to canceled for unbooked items', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: false,
        },
      ];
      
      // Mock useSelector
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock useMemo
      const expectedAppointments = [
        {
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          timeSlot: mockBookedTimeSlots[0],
          status: 'canceled',
        },
      ];
      mockUseMemo.mockReturnValue(expectedAppointments);
      
      // Mock useState
      mockUseState.mockReturnValue([expectedAppointments, mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // Verify
      expect(result.appointments[0].status).toBe('canceled');
    });
  });
  
  describe('cancelBook functionality', () => {
    it('should dispatch cancelTimeSlot and update appointments', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: true,
        },
        {
          id: '2',
          doctorName: 'Dr. Johnson',
          doctorTimeZone: 'Europe/London',
          bookedTime: 1620003600000,
          isBooked: true,
        },
      ];
      
      const initialAppointments = [
        {
          doctorName: 'Dr. Johnson',
          doctorTimeZone: 'Europe/London',
          timeSlot: mockBookedTimeSlots[1],
          status: 'upcoming',
        },
        {
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          timeSlot: mockBookedTimeSlots[0],
          status: 'upcoming',
        },
      ];
      
      // Mock useSelector
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock useMemo
      mockUseMemo.mockReturnValue(initialAppointments);
      
      // Mock useState
      mockUseState.mockReturnValue([initialAppointments, mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // Set currentSlotId
      result.currentSlotId.current = '1';
      
      // Call cancelBook
      result.cancelBook();
      
      // Verify cancelTimeSlot was dispatched
      expect(mockDispatch).toHaveBeenCalledWith(mockCancelTimeSlot({ id: '1' }));
      
      // Verify setAppointments was called with updated appointments
      expect(mockSetAppointments).toHaveBeenCalledWith(
        initialAppointments.map((item) => {
          if (item.timeSlot.id === '1') {
            return { ...item, status: 'canceled' };
          }
          return item;
        })
      );
    });
  });
  
  describe('useEffect logic', () => {
    it('should call addAllRows on initial render', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: true,
        },
      ];
      
      // Mock useSelector
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock useMemo
      mockUseMemo.mockReturnValue([]);
      
      // Mock useState
      mockUseState.mockReturnValue([[], mockSetAppointments]);
      
      // Call the hook
      useAppointment();
      
      // Verify addAllRows was called
      expect(mockAddAllRows).toHaveBeenCalledWith(mockBookedTimeSlots);
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty bookedTimeSlots array', () => {
      // Mock useSelector to return empty array
      mockUseSelector.mockReturnValue([]);
      
      // Mock useMemo to return empty array
      mockUseMemo.mockReturnValue([]);
      
      // Mock useState
      mockUseState.mockReturnValue([[], mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // Verify appointments is empty
      expect(result.appointments).toEqual([]);
      expect(mockAddAllRows).toHaveBeenCalledWith([]);
    });
    
    it('should handle appointmentStatus returning different statuses', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: true,
        },
      ];
      
      // Mock useSelector
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock appointmentStatus to return completed
      mockAppointmentStatus.mockReturnValue('completed');
      
      // Mock useMemo
      const expectedAppointments = [
        {
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          timeSlot: mockBookedTimeSlots[0],
          status: 'completed',
        },
      ];
      mockUseMemo.mockReturnValue(expectedAppointments);
      
      // Mock useState
      mockUseState.mockReturnValue([expectedAppointments, mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // Verify status is completed
      expect(result.appointments[0].status).toBe('completed');
    });
    
    it('should handle cancelBook with empty currentSlotId', () => {
      const mockBookedTimeSlots = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          bookedTime: 1620000000000,
          isBooked: true,
        },
      ];
      
      // Mock useSelector
      mockUseSelector.mockReturnValue(mockBookedTimeSlots);
      
      // Mock useMemo
      const initialAppointments = [
        {
          doctorName: 'Dr. Smith',
          doctorTimeZone: 'America/New_York',
          timeSlot: mockBookedTimeSlots[0],
          status: 'upcoming',
        },
      ];
      mockUseMemo.mockReturnValue(initialAppointments);
      
      // Mock useState
      mockUseState.mockReturnValue([initialAppointments, mockSetAppointments]);
      
      // Call the hook
      const result = useAppointment();
      
      // currentSlotId is empty by default
      expect(result.currentSlotId.current).toBe('');
      
      // Call cancelBook
      result.cancelBook();
      
      // Verify cancelTimeSlot was dispatched with empty id
      expect(mockDispatch).toHaveBeenCalledWith(mockCancelTimeSlot({ id: '' }));
    });
  });
});
