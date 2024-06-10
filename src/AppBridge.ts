import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Interface for subject entries where the values are BehaviorSubject<any>.
 */
export type SubjectEntries<T> = {
  [K in SubjectKey<T>]: BehaviorSubject<T[K] | null>;
};

/**
 * Interface extending the Window object to include a subject manager.
 */
export interface WindowWithSubjectManager<T> extends Window {
  _subjectManager: SubjectEntries<T>;
}

/**
 * `AppBridgeOptions` interface for defining options in AppBridge.
 *
 * @property reset - Optional. If true, resets the AppBridge.
 */
export interface AppBridgeOptions {
  reset?: boolean;
}

declare const window: WindowWithSubjectManager<any>;

/**
 * Type alias for valid keys of T.
 */
export type SubjectKey<T> = keyof T & string;

/**
 * AppBridge class provides a bridge for state management using RxJS BehaviorSubjects.
 * @template T - The type of the subjects managed by AppBridge.
 */
class AppBridge<T> {
  private static instance: AppBridge<any>;

  private constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {} as SubjectEntries<T>;
    }
  }

  /**
   * Gets the singleton instance of the AppBridge.
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
   * Clears all subjects, completing and removing them from the manager.
   */
  clearAllSubjects(): void {
    for (const subjectKey in window._subjectManager) {
      if (window._subjectManager.hasOwnProperty(subjectKey)) {
        window._subjectManager[subjectKey].complete();
        delete window._subjectManager[subjectKey];
      }
    }
  }

  /**
   * Retrieves a BehaviorSubject by name, creating it if it doesn't exist.
   *
   * @param name - The name of the subject.
   * @returns The BehaviorSubject instance.
   */
  getSubject<K extends SubjectKey<T>>(name: K): BehaviorSubject<T[K] | null> {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new BehaviorSubject<T[K] | null>(null);
    }
    return window._subjectManager[name];
  }

  /**
   * Updates the value of a BehaviorSubject by name, creating it if it doesn't exist.
   *
   * @param name - The name of the subject.
   * @param newState - The new state to update.
   */
  updateSubject<K extends SubjectKey<T>>(name: K, newState: T[K]): void {
    this.getSubject(name).next(newState);
  }

  /**
   * Emits an error in the BehaviorSubject by name.
   *
   * @param name - The name of the subject.
   * @param error - The error to emit.
   */
  errorSubject<K extends SubjectKey<T>>(name: K, error: any): void {
    this.getSubject(name).error(error);
  }

  /**
   * Retrieves the current value of a BehaviorSubject by name.
   *
   * @param name - The name of the subject.
   * @returns The current value of the subject.
   */
  getValue<K extends SubjectKey<T>>(name: K): T[K] | null {
    return this.getSubject(name).getValue();
  }

  /**
   * Subscribes to a BehaviorSubject by name with an observer.
   *
   * @param name - The name of the subject.
   * @param observer - The observer object with next, error, and complete callbacks.
   * @returns The subscription to the subject.
   */
  subscribe<K extends SubjectKey<T>>(
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
 * Singleton instance creator for the AppBridge class.
 */
export function createAppBridge<T>(options: AppBridgeOptions = {}) {
  return AppBridge.getInstance<T>(options);
}
