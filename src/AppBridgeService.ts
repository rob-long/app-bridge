import angular from 'angular';
import AppBridge from './AppBridge.ts';

const appBridgeService = angular
  .module('myApp', [])
  .factory('AppBridgeService', [
    '$rootScope',
    function ($rootScope: angular.IRootScopeService) {
      return {
        getSubject: <T>(name: string) => AppBridge.getSubject<T>(name),
        getValue: <T>(name: string) => AppBridge.getValue<T>(name),
        updateSubject: <T>(name: string, newState: T) =>
          AppBridge.updateSubject<T>(name, newState),
        subscribe: <T>(name: string, next: (newState: T) => void) => {
          const subscription = AppBridge.subscribe(name, {
            next: (newState) => {
              $rootScope.$apply(() => {
                next(newState as T);
              });
            },
          });
          return () => subscription.unsubscribe();
        },
      };
    },
  ]);

export default appBridgeService;
