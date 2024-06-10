'use strict';

var rxjs = require('rxjs');
var angular = require('angular');
var react = require('react');

class AppBridge {
  constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {};
    }
  }
  getSubject(name) {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new rxjs.BehaviorSubject(null);
    }
    return window._subjectManager[name];
  }
  updateSubject(name, newState) {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new rxjs.BehaviorSubject(newState);
    } else {
      this.getSubject(name).next(newState);
    }
  }
  getValue(name) {
    const subject = this.getSubject(name);
    return subject.getValue();
  }
  subscribe(name, observer) {
    try {
      return this.getSubject(name).subscribe(observer);
    } catch (err) {
      console.error(`Error subscribing to subject ${name}:`, err);
      if (observer.error) observer.error(err);
      throw err;
    }
  }
}
const Singleton = new AppBridge();

const appBridgeService = angular.module("myApp", []).factory("AppBridgeService", [
  "$rootScope",
  function($rootScope) {
    return {
      getSubject: (name) => Singleton.getSubject(name),
      getValue: (name) => Singleton.getValue(name),
      updateSubject: (name, newState) => Singleton.updateSubject(name, newState),
      subscribe: (name, next) => {
        const subscription = Singleton.subscribe(name, {
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

const useAppBridge = (subjectName) => {
  const [state, setState] = react.useState(
    Singleton.getValue(subjectName)
  );
  react.useEffect(() => {
    const subscription = Singleton.subscribe(subjectName, {
      next: (newState) => {
        setState(newState);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subjectName]);
  const updateState = (newState) => {
    Singleton.updateSubject(subjectName, newState);
  };
  return [state, updateState];
};

exports.AppBridge = Singleton;
exports.appBridgeService = appBridgeService;
exports.useAppBridge = useAppBridge;
//# sourceMappingURL=index.js.map
