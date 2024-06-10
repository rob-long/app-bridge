import { BehaviorSubject } from 'rxjs';

/**
 * Interface representing a collection of BehaviorSubject instances.
 *
 * @template T - The type of the values managed by the BehaviorSubjects.
 */

export type SubjectEntries<T> = {
  [K in SubjectKey<T>]: BehaviorSubject<T[K] | null>;
};
/**
 * Interface extending the Window object to include a subject manager.
 *
 * @template T - The type of the values managed by the subject manager.
 */

export interface WindowWithSubjectManager<T> extends Window {
  _subjectManager: SubjectEntries<T>;
}
/**
 * Options for configuring the AppBridge instance.
 */

export interface AppBridgeOptions {
  /**
   * If true, resets the AppBridge instance.
   */
  reset?: boolean;
}
/**
 * Type alias for the keys of a given type T.
 */

export type SubjectKey<T> = keyof T & string;
