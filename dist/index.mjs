import { BehaviorSubject } from 'rxjs';
import angular from 'angular';
import { useState, useEffect } from 'react';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const _AppBridge = class _AppBridge {
  /**
   * Private constructor to enforce the singleton pattern.
   */
  constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {};
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
  static getInstance(options = {}) {
    if (!_AppBridge.instance || options.reset) {
      _AppBridge.instance = new _AppBridge();
    }
    return _AppBridge.instance;
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
  clearAllSubjects() {
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
  getSubject(name) {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new BehaviorSubject(null);
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
  updateSubject(name, newState) {
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
  errorSubject(name, error) {
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
  getValue(name) {
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
  subscribe(name, observer) {
    return this.getSubject(name).subscribe(observer);
  }
};
__publicField(_AppBridge, "instance");
let AppBridge = _AppBridge;
function createAppBridge(options = {}) {
  return AppBridge.getInstance(options);
}

function createAppBridgeService(applicationName) {
  return angular.module(applicationName, []).factory("AppBridgeService", [
    "$rootScope",
    function($rootScope) {
      const appBridge = createAppBridge();
      return {
        getSubject: (name) => appBridge.getSubject(name),
        getValue: (name) => appBridge.getValue(name),
        updateSubject: (name, newState) => appBridge.updateSubject(name, newState),
        subscribe: (name, next) => {
          const subscription = appBridge.subscribe(name, {
            next: (newState) => {
              $rootScope.$apply(() => {
                next(newState);
              });
            }
          });
          return () => subscription.unsubscribe();
        }
      };
    }
  ]);
}

const useAppBridge = (subjectName) => {
  const appBridge = createAppBridge();
  const [state, setState] = useState(appBridge.getValue(subjectName));
  useEffect(() => {
    const subscription = appBridge.subscribe(subjectName, {
      next: (newState) => {
        setState(newState);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subjectName]);
  const updateState = (newState) => {
    appBridge.updateSubject(subjectName, newState);
  };
  return [state, updateState];
};

export { createAppBridgeService as appBridgeService, createAppBridge, useAppBridge };
//# sourceMappingURL=index.mjs.map
