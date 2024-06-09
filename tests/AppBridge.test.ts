import AppBridge, { WindowWithSubjectManager } from '../src/AppBridge.ts';
import { BehaviorSubject } from 'rxjs';

declare const window: WindowWithSubjectManager;
declare const global: any;

describe('AppBridge', () => {
  beforeEach(() => {
    global.window = {} as WindowWithSubjectManager;
    // Reset the _subjectManager before each test
    window._subjectManager = {};
  });

  test('should initialize a new BehaviorSubject if it does not exist', () => {
    const subject = AppBridge.getSubject<string>('testSubject');
    expect(subject).toBeInstanceOf(BehaviorSubject);
    expect(subject.getValue()).toBeNull();
  });

  test('should update the BehaviorSubject with a new value', () => {
    const subject = AppBridge.getSubject<string>('testSubject');
    AppBridge.updateSubject('testSubject', 'newValue');
    expect(subject.getValue()).toBe('newValue');
  });

  test('should return the current value of the BehaviorSubject', () => {
    AppBridge.updateSubject('testSubject', 'currentValue');
    const value = AppBridge.getValue<string>('testSubject');
    expect(value).toBe('currentValue');
  });

  test('should subscribe to the BehaviorSubject and receive updates', () => {
    const mockNext = jest.fn();
    const subscription = AppBridge.subscribe('testSubject', {
      next: mockNext,
    });

    AppBridge.updateSubject('testSubject', 'update1');
    AppBridge.updateSubject('testSubject', 'update2');

    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockNext).toHaveBeenCalledWith('update1');
    expect(mockNext).toHaveBeenCalledWith('update2');

    subscription.unsubscribe();
  });
});
