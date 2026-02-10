import { Alert } from 'react-native';

// Mock Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Import Alert after mocking
import { Alert as MockedAlert } from 'react-native';

// Import the hook
let useBookAlert: any;
describe('useBookAlert hook', () => {
  let mockOnConfirm: jest.Mock;
  let mockOnCancel: jest.Mock;
  beforeAll(() => {
    // Mock Alert.alert
    jest.spyOn(Alert, 'alert');
  });
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock functions
    mockOnConfirm = jest.fn();
    mockOnCancel = jest.fn();
    
    // Import the hook here to ensure mocks are active
    useBookAlert = require('@/app/profiles/hooks/useBookAlert').useBookAlert;
  });
  
  describe('show method', () => {
    it('should call Alert.alert with correct parameters', () => {
      // Call the hook
      const { show } = useBookAlert({
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });
      
      // Call show
      show('Test Title', 'Test Message');
      
      // Verify Alert.alert was called with correct parameters
      expect(MockedAlert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        [
          {
            text: 'cancel',
            onPress: mockOnCancel,
            style: 'cancel',
          },
          {
            text: 'ok',
            onPress: mockOnConfirm,
            style: 'default',
          },
        ],
        {
          cancelable: false,
        }
      );
    });
    
    it('should call Alert.alert with different title and message', () => {
      // Call the hook
      const { show } = useBookAlert({
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });
      
      // Call show with different values
      show('Confirm Booking', 'Are you sure you want to book this appointment?');
      
      // Verify Alert.alert was called with correct parameters
      expect(MockedAlert.alert).toHaveBeenCalledWith(
        'Confirm Booking',
        'Are you sure you want to book this appointment?',
        [
          {
            text: 'cancel',
            onPress: mockOnCancel,
            style: 'cancel',
          },
          {
            text: 'ok',
            onPress: mockOnConfirm,
            style: 'default',
          },
        ],
        {
          cancelable: false,
        }
      );
    });
  });
  
  describe('edge cases', () => {
    it('should handle missing onCancel callback', () => {
      // Call the hook without onCancel
      const { show } = useBookAlert({
        onConfirm: mockOnConfirm,
      });
      
      // Call show
      show('Test Title', 'Test Message');
      
      // Verify Alert.alert was called with undefined onPress for cancel button
      expect(MockedAlert.alert).toHaveBeenCalledWith(
        'Test Title',
        'Test Message',
        [
          {
            text: 'cancel',
            onPress: undefined,
            style: 'cancel',
          },
          {
            text: 'ok',
            onPress: mockOnConfirm,
            style: 'default',
          },
        ],
        {
          cancelable: false,
        }
      );
    });
    
    it('should handle empty title and message', () => {
      // Call the hook
      const { show } = useBookAlert({
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
      });
      
      // Call show with empty strings
      show('', '');
      
      // Verify Alert.alert was called with empty strings
      expect(MockedAlert.alert).toHaveBeenCalledWith(
        '',
        '',
        expect.any(Array),
        expect.any(Object)
      );
    });
  });
});
