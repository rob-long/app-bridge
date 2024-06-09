import { useEffect, useState } from 'react';
import type { SetStateAction } from 'react';
import AppBridge from './AppBridge.ts';

const useAppBridge = <T>(subjectName: string) => {
  const [state, setState] = useState<T | null>(
    AppBridge.getValue<T>(subjectName),
  );

  useEffect(() => {
    const subscription = AppBridge.subscribe(subjectName, {
      next: (newState: SetStateAction<T | null>) => {
        setState(newState);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [subjectName]);

  const updateState = (newState: T) => {
    AppBridge.updateSubject(subjectName, newState);
  };

  return [state, updateState] as const;
};

export default useAppBridge;
