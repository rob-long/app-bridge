import { BehaviorSubject, Subscription } from 'rxjs';

export interface WindowWithSubjectManager extends Window {
  _subjectManager: Record<string, BehaviorSubject<any>>;
}

declare const window: WindowWithSubjectManager;

class AppBridge {
  constructor() {
    if (!window._subjectManager) {
      window._subjectManager = {};
    }
  }

  getSubject<T>(name: string): BehaviorSubject<T | null> {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new BehaviorSubject(null);
    }
    return window._subjectManager[name];
  }

  updateSubject<T>(name: string, newState: T): void {
    if (!window._subjectManager[name]) {
      window._subjectManager[name] = new BehaviorSubject<T>(newState);
    } else {
      this.getSubject(name).next(newState);
    }
  }

  getValue<T>(name: string): T | null {
    const subject = this.getSubject<T>(name);
    return subject.getValue();
  }

  subscribe<T>(
    name: string,
    observer: {
      next?: (value: T | null) => void;
      error?: (error: any) => void;
      complete?: () => void;
    },
  ): Subscription {
    try {
      return this.getSubject<T>(name).subscribe(observer);
    } catch (err) {
      console.error(`Error subscribing to subject ${name}:`, err);
      if (observer.error) observer.error(err);
      throw err; // Re-throw to ensure the caller knows something went wrong
    }
  }
}

const Singleton = new AppBridge();
export default Singleton;
