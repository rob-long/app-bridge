import { useEffect, useState } from 'react';
import { createAppBridge } from './AppBridge.ts';
import type { SubjectKey } from './types.ts';

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
const useAppBridge = <T>(subjectName: SubjectKey<T>) => {
  const appBridge = createAppBridge<T>();
  const [state, setState] = useState(appBridge.getValue(subjectName));

  useEffect(() => {
    const subscription = appBridge.subscribe(subjectName, {
      next: (newState) => {
        setState(newState);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [subjectName]);

  /**
   * Updates the state of the subject.
   *
   * @param newState - The new state to set.
   */
  const updateState = (newState: T[SubjectKey<T>]) => {
    appBridge.updateSubject(subjectName, newState);
  };

  return [state, updateState] as const;
};

export default useAppBridge;
