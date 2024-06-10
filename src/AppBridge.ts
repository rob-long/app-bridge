import { BehaviorSubject, Subscription } from 'rxjs';
import {
  WindowWithSubjectManager,
  SubjectEntries,
  AppBridgeOptions,
  SubjectKey,
} from './types.ts';

declare const window: WindowWithSubjectManager<any>;

/**
 * AppBridge class provides a bridge for state management using RxJS BehaviorSubjects.
 * It manages a collection of BehaviorSubject instances, allowing for state updates,
 * retrievals, and subscriptions.
 *
 * @template T - The type of the subjects managed by AppBridge.
 */
export class AppBridge<T> {
  private static instance: AppBridge<any>;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {} as SubjectEntries<T>;
    }
  }

  /**
   * Retrieves the singleton instance of the AppBridge.
   * If the instance does not exist or the reset option is provided, a new instance is created.
   *
   * @template T - The type of the subjects managed by AppBridge.
   * @param options - Options to configure the instance.
   * @returns The singleton instance of AppBridge.
   */
  public static getInstance<T>(options: AppBridgeOptions = {}): AppBridge<T> {
    if (!AppBridge.instance || options.reset) {
      AppBridge.instance = new AppBridge<T>();
    }
    return AppBridge.instance;
  }

  /**
   * Clears all BehaviorSubjects from the subject manager, completing and removing them.
   *
   * @example
   * ```typescript
   * const appBridge = AppBridge.getInstance<MyType>();
   * appBridge.clearAllSubjects();
   * ```
   */
  public clearAllSubjects(): void {
    for (const subjectKey in window._subjectManager) {
      if (window._subjectManager.hasOwnProperty(subjectKey)) {
        window._subjectManager[subjectKey].complete();
        delete window._subjectManager[subjectKey];
      }
    }
  }

  /**
   * Retrieves a BehaviorSubject by its name, creating it if it does not exist.
   *
   * @template K - The key type of the subject.
   * @param name - The name of the subject.
   * @returns The BehaviorSubject instance.
   *
   * @example
   * ```typescript
   * const subject = appBridge.getSubject('mySubject');
   * subject.subscribe(value => console.log(value));
   * ```
   */
  public getSubject<K extends SubjectKey<T>>(
    name: K,
  ): BehaviorSubject<T[K] | null> {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new BehaviorSubject<T[K] | null>(null);
    }
    return window._subjectManager[name];
  }

  /**
   * Updates the value of a BehaviorSubject by its name, creating it if it does not exist.
   *
   * @template K - The key type of the subject.
   * @param name - The name of the subject.
   * @param newState - The new state to update.
   *
   * @example
   * ```typescript
   * appBridge.updateSubject('mySubject', { key: 'value' });
   * ```
   */
  public updateSubject<K extends SubjectKey<T>>(name: K, newState: T[K]): void {
    this.getSubject(name).next(newState);
  }

  /**
   * Emits an error in the BehaviorSubject by its name.
   *
   * @template K - The key type of the subject.
   * @param name - The name of the subject.
   * @param error - The error to emit.
   *
   * @example
   * ```typescript
   * appBridge.errorSubject('mySubject', new Error('Something went wrong'));
   * ```
   */
  public errorSubject<K extends SubjectKey<T>>(name: K, error: any): void {
    this.getSubject(name).error(error);
  }

  /**
   * Retrieves the current value of a BehaviorSubject by its name.
   *
   * @template K - The key type of the subject.
   * @param name - The name of the subject.
   * @returns The current value of the subject.
   *
   * @example
   * ```typescript
   * const currentValue = appBridge.getValue('mySubject');
   * console.log(currentValue);
   * ```
   */
  public getValue<K extends SubjectKey<T>>(name: K): T[K] | null {
    return this.getSubject(name).getValue();
  }

  /**
   * Subscribes to a BehaviorSubject by its name with an observer.
   *
   * @template K - The key type of the subject.
   * @param name - The name of the subject.
   * @param observer - The observer object with next, error, and complete callbacks.
   * @returns The subscription to the subject.
   *
   * @example
   * ```typescript
   * const subscription = appBridge.subscribe('mySubject', {
   *   next: value => console.log(value),
   *   error: error => console.error(error),
   *   complete: () => console.log('Completed')
   * });
   * ```
   */
  public subscribe<K extends SubjectKey<T>>(
    name: K,
    observer: {
      next?: (value: T[K] | null) => void;
      error?: (error: any) => void;
      complete?: () => void;
    },
  ): Subscription {
    return this.getSubject<K>(name).subscribe(observer);
  }
}

/**
 * Factory function for creating or retrieving the singleton instance of the AppBridge class.
 *
 * @template T - The type of the subjects managed by AppBridge.
 * @param options - Options to configure the instance.
 * @returns The singleton instance of AppBridge.
 *
 * @example
 * ```typescript
 * const appBridge = createAppBridge<MyType>({ reset: true });
 * ```
 */
export function createAppBridge<T>(options: AppBridgeOptions = {}) {
  return AppBridge.getInstance<T>(options);
}
