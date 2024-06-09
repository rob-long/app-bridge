import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Interface for subject names with generic values.
 */
export interface SubjectNames {
  [key: string]: any;
}

/**
 * Interface for subject entries where the values are BehaviorSubject<any>.
 */
export type SubjectEntries<T extends SubjectNames> = {
  [K in keyof T]: BehaviorSubject<T[K] | null>;
};

/**
 * Interface extending the Window object to include a subject manager.
 */
export interface WindowWithSubjectManager<T extends SubjectNames>
  extends Window {
  _subjectManager: SubjectEntries<T>;
}

declare const window: WindowWithSubjectManager<any>;

/**
 * AppBridge class provides a bridge for state management using RxJS BehaviorSubjects.
 */
class AppBridge<T extends SubjectNames> {
  private static instance: AppBridge<any>;

  private constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {} as SubjectEntries<T>;
    }
  }

  public static getInstance<T extends SubjectNames>(): AppBridge<T> {
    if (!AppBridge.instance) {
      AppBridge.instance = new AppBridge<T>();
    }
    return AppBridge.instance;
  }

  /**
   * Retrieves a BehaviorSubject by name, creating it if it doesn't exist.
   *
   * @param name - The name of the subject.
   * @returns The BehaviorSubject instance.
   */
  getSubject<K extends keyof T>(name: K): BehaviorSubject<T[K] | null> {
    if (!window._subjectManager[name]) {
      window._subjectManager[name as string] = new BehaviorSubject<T[K] | null>(
        null,
      );
    }
    return window._subjectManager[name];
  }

  /**
   * Updates the value of a BehaviorSubject by name, creating it if it doesn't exist.
   *
   * @param name - The name of the subject.
   * @param newState - The new state to update.
   */
  updateSubject<K extends keyof T>(name: K, newState: T[K]): void {
    this.getSubject(name).next(newState);
  }

  /**
   * Retrieves the current value of a BehaviorSubject by name.
   *
   * @param name - The name of the subject.
   * @returns The current value of the subject.
   */
  getValue<K extends keyof T>(name: K): T[K] | null {
    return this.getSubject(name).getValue();
  }

  /**
   * Emits an error in the BehaviorSubject by name.
   *
   * @param name - The name of the subject.
   * @param error - The error to emit.
   */
  errorSubject<K extends keyof T>(name: K, error: any): void {
    this.getSubject(name).error(error);
  }

  /**
   * Subscribes to a BehaviorSubject by name with an observer.
   *
   * @param name - The name of the subject.
   * @param observer - The observer object with next, error, and complete callbacks.
   * @returns The subscription to the subject.
   */
  subscribe<K extends keyof T>(
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
export function createAppBridge<T extends SubjectNames>() {
  return AppBridge.getInstance<T>();
}
