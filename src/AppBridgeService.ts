import angular from 'angular';
import { createAppBridge } from './AppBridge.ts';
import { SubjectKey } from './types.ts';

/**
 * Function to create a generic AppBridgeService for Angular.
 *
 * @returns The Angular module with the AppBridgeService factory.
 */
export function createAppBridgeService<T>(applicationName: string) {
  return angular.module(applicationName, []).factory('AppBridgeService', [
    '$rootScope',
    function ($rootScope: angular.IRootScopeService) {
      const appBridge = createAppBridge<T>();
      return {
        getSubject: <K extends SubjectKey<T>>(name: K) =>
          appBridge.getSubject<K>(name),
        getValue: <K extends SubjectKey<T>>(name: K) =>
          appBridge.getValue<K>(name),
        updateSubject: <K extends SubjectKey<T>>(name: K, newState: T[K]) =>
          appBridge.updateSubject<K>(name, newState),
        subscribe: <K extends SubjectKey<T>>(
          name: K,
          next: (newState: T[K] | null) => void,
        ) => {
          const subscription = appBridge.subscribe(name, {
            next: (newState) => {
              $rootScope.$apply(() => {
                next(newState);
              });
            },
          });
          return () => subscription.unsubscribe();
        },
      };
    },
  ]);
}

export default createAppBridgeService;
