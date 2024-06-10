import { BehaviorSubject } from 'rxjs';
import { createAppBridge, WindowWithSubjectManager } from '../src/AppBridge';

// Define the specific subject names for testing
interface TestSubjects {
  testSubjectString?: string;
  anotherSubject?: number;
}

type WindowWithAppBridge = WindowWithSubjectManager<TestSubjects>;

declare const window: WindowWithAppBridge;

describe('AppBridge', () => {
  let appBridge: ReturnType<typeof createAppBridge<TestSubjects>>;

  beforeEach(() => {
    // Reset the App before each test
    appBridge = createAppBridge<TestSubjects>({ reset: true });
  });

  afterEach(() => {
    // Ensure that all subscriptions are unsubscribed and state is cleared
    appBridge.clearAllSubjects();
  });

  test('should initialize a new BehaviorSubject if it does not exist', () => {
    const subject = appBridge.getSubject('testSubjectString');
    expect(subject).toBeInstanceOf(BehaviorSubject);
    expect(subject.getValue()).toBeNull();
  });

  test('should update the BehaviorSubject with a new value', () => {
    const subject = appBridge.getSubject('testSubjectString');
    appBridge.updateSubject('testSubjectString', 'newValue');
    expect(subject.getValue()).toBe('newValue');
  });

  test('should return the current value of the BehaviorSubject', () => {
    appBridge.updateSubject('testSubjectString', 'currentValue');
    const value = appBridge.getValue('testSubjectString');
    expect(value).toBe('currentValue');
  });

  test('should subscribe to the BehaviorSubject and receive updates', () => {
    const mockNext = jest.fn();
    const subscription = appBridge.subscribe('testSubjectString', {
      next: mockNext,
    });

    // Initial null value should be received first
    expect(mockNext).toHaveBeenCalledWith(null);

    // Update the subject with new values
    appBridge.updateSubject('testSubjectString', 'update1');
    appBridge.updateSubject('testSubjectString', 'update2');

    // Check that the observer received the initial value and the updates
    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockNext).toHaveBeenCalledWith('update1');
    expect(mockNext).toHaveBeenCalledWith('update2');

    subscription.unsubscribe();
  });

  test('should handle errors during subscription', () => {
    const mockError = jest.fn();
    const mockNext = jest.fn();

    const subscription = appBridge.subscribe('testSubjectString', {
      next: mockNext,
      error: mockError,
    });

    // Emit an error
    appBridge.errorSubject('testSubjectString', new Error('Test error'));

    expect(mockError).toHaveBeenCalledWith(new Error('Test error'));
    expect(mockNext).toHaveBeenCalledTimes(1); // Only the initial null value should be received

    subscription.unsubscribe();
  });
});
