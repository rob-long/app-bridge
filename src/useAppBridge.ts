import { useEffect, useState } from 'react';
import { createAppBridge } from './AppBridge.ts';
import type { SubjectKey } from './AppBridge.ts';

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

  const updateState = (newState: T[SubjectKey<T>]) => {
    appBridge.updateSubject(subjectName, newState);
  };

  return [state, updateState] as const;
};

export default useAppBridge;
