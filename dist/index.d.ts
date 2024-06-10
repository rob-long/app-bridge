import { BehaviorSubject, Subscription } from 'rxjs';
import angular from 'angular';

/**
 * Interface representing a collection of BehaviorSubject instances.
 *
 * @template T - The type of the values managed by the BehaviorSubjects.
 */
type SubjectEntries<T> = {
    [K in SubjectKey<T>]: BehaviorSubject<T[K] | null>;
};
/**
 * Interface extending the Window object to include a subject manager.
 *
 * @template T - The type of the values managed by the subject manager.
 */
interface WindowWithSubjectManager<T> extends Window {
    _subjectManager: SubjectEntries<T>;
}
/**
 * Options for configuring the AppBridge instance.
 */
interface AppBridgeOptions {
    /**
     * If true, resets the AppBridge instance.
     */
    reset?: boolean;
}
/**
 * Type alias for the keys of a given type T.
 */
type SubjectKey<T> = keyof T & string;

/**
 * AppBridge class provides a bridge for state management using RxJS BehaviorSubjects.
 * It manages a collection of BehaviorSubject instances, allowing for state updates,
 * retrievals, and subscriptions.
 *
 * @template T - The type of the subjects managed by AppBridge.
 */
declare class AppBridge<T> {
    private static instance;
    /**
     * Private constructor to enforce the singleton pattern.
     */
    private constructor();
    /**
     * Retrieves the singleton instance of the AppBridge.
     * If the instance does not exist or the reset option is provided, a new instance is created.
     *
     * @template T - The type of the subjects managed by AppBridge.
     * @param options - Options to configure the instance.
     * @returns The singleton instance of AppBridge.
     */
    static getInstance<T>(options?: AppBridgeOptions): AppBridge<T>;
    /**
     * Clears all BehaviorSubjects from the subject manager, completing and removing them.
     *
     * @example
     * ```typescript
     * const appBridge = AppBridge.getInstance<MyType>();
     * appBridge.clearAllSubjects();
     * ```
     */
    clearAllSubjects(): void;
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
    getSubject<K extends SubjectKey<T>>(name: K): BehaviorSubject<T[K] | null>;
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
    updateSubject<K extends SubjectKey<T>>(name: K, newState: T[K]): void;
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
    errorSubject<K extends SubjectKey<T>>(name: K, error: any): void;
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
    getValue<K extends SubjectKey<T>>(name: K): T[K] | null;
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
    subscribe<K extends SubjectKey<T>>(name: K, observer: {
        next?: (value: T[K] | null) => void;
        error?: (error: any) => void;
        complete?: () => void;
    }): Subscription;
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
declare function createAppBridge<T>(options?: AppBridgeOptions): AppBridge<T>;

/**
 * Function to create a generic AppBridgeService for Angular.
 *
 * @returns The Angular module with the AppBridgeService factory.
 */
declare function createAppBridgeService<T>(applicationName: string): angular.IModule;

/**
 * Custom hook that subscribes to a subject from the AppBridge and provides state management.
 *
 * @template T - The type of the subjects managed by AppBridge.
 * @param subjectName - The name of the subject to subscribe to.
 * @returns A tuple containing the current state of the subject and a function to update the state.
 *
 * @example
 * ```typescript
 * const [state, updateState] = useAppBridge<MyType>('mySubject');
 *
 * // Use the state
 * console.log(state);
 *
 * // Update the state
 * updateState({ key: 'value' });
 * ```
 */
declare const useAppBridge: <T>(subjectName: SubjectKey<T>) => readonly [T[SubjectKey<T>] | null, (newState: T[SubjectKey<T>]) => void];

export { type AppBridgeOptions, type SubjectEntries, type SubjectKey, type WindowWithSubjectManager, createAppBridgeService as appBridgeService, createAppBridge, useAppBridge };
