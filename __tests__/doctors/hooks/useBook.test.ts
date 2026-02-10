import { useDispatch, useSelector } from 'react-redux';
import { selectDoctor } from '@/app/store/doctorSlice';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock dependencies
jest.mock('react-redux');
jest.mock('@/app/store/doctorSlice');

// Import useRouter after mocking
import { useRouter } from 'expo-router';

const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSelectDoctor = selectDoctor as jest.MockedFunction<typeof selectDoctor>;

// Import the hook
let useBook: any;
describe('useBook hook', () => {
  let mockDispatch: jest.Mock;
  let mockRouter: any;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock functions
    mockDispatch = jest.fn();
    mockRouter = {
      push: jest.fn(),
    };
    
    // Mock hooks
    mockUseDispatch.mockReturnValue(mockDispatch);
    mockUseRouter.mockReturnValue(mockRouter);
    mockSelectDoctor.mockReturnValue({ type: 'doctor/selectDoctor', payload: {} as any });
    
    // Import the hook here to ensure mocks are active
    useBook = require('@/app/doctors/hooks/useBook').useBook;
  });
  
  describe('gotoDetail method', () => {
    it('should dispatch selectDoctor and navigate to profiles page', () => {
      const mockDoctor = {
        id: '1',
        name: 'Dr. Smith',
        timezone: 'America/New_York',
        day_of_week: 'Monday',
        available_at: '09:00',
        available_until: '17:00',
        specialty: 'Cardiology',
      };
      
      // Mock useSelector to return a date string
      mockUseSelector.mockReturnValue('2023-12-01');
      
      // Call the hook
      const { gotoDetail } = useBook();
      
      // Call gotoDetail with a doctor
      gotoDetail(mockDoctor);
      
      // Verify selectDoctor was dispatched with the doctor
      expect(mockDispatch).toHaveBeenCalledWith(mockSelectDoctor(mockDoctor));
      
      // Verify router.push was called with the correct path
      expect(mockRouter.push).toHaveBeenCalledWith('/profiles');
    });
  });
  
  describe('getSelectedDate method', () => {
    it('should return a Date object when selectedDateStr is present', () => {
      const mockDateStr = '2023-12-01';
      
      // Mock useSelector to return the date string
      mockUseSelector.mockReturnValue(mockDateStr);
      
      // Call the hook
      const { getSelectedDate } = useBook();
      
      // Call getSelectedDate
      const result = getSelectedDate();
      
      // Verify the result is a Date object and has the correct value
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString().split('T')[0]).toBe(mockDateStr);
    });
    
    it('should return null when selectedDateStr is empty', () => {
      // Mock useSelector to return an empty string
      mockUseSelector.mockReturnValue('');
      
      // Call the hook
      const { getSelectedDate } = useBook();
      
      // Call getSelectedDate
      const result = getSelectedDate();
      
      // Verify the result is null
      expect(result).toBeNull();
    });
    
    it('should return null when selectedDateStr is undefined', () => {
      // Mock useSelector to return undefined
      mockUseSelector.mockReturnValue(undefined);
      
      // Call the hook
      const { getSelectedDate } = useBook();
      
      // Call getSelectedDate
      const result = getSelectedDate();
      
      // Verify the result is null
      expect(result).toBeNull();
    });
  });
  
  describe('edge cases', () => {
    it('should handle invalid date strings gracefully', () => {
      const invalidDateStr = 'invalid-date';
      
      // Mock useSelector to return an invalid date string
      mockUseSelector.mockReturnValue(invalidDateStr);
      
      // Call the hook
      const { getSelectedDate } = useBook();
      
      // Call getSelectedDate
      const result = getSelectedDate();
      
      // Verify the result is a Date object (will be Invalid Date)
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result?.getTime() || NaN)).toBe(true);
    });
  });
});
