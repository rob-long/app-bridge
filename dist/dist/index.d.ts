import { BehaviorSubject, Subscription } from 'rxjs';
import angular from 'angular';

declare class AppBridge {
    constructor();
    getSubject<T>(name: string): BehaviorSubject<T | null>;
    updateSubject<T>(name: string, newState: T): void;
    getValue<T>(name: string): T | null;
    subscribe<T>(name: string, observer: {
        next?: (value: T | null) => void;
        error?: (error: any) => void;
        complete?: () => void;
    }): Subscription;
}
declare const Singleton: AppBridge;

declare const appBridgeService: angular.IModule;

declare const useAppBridge: <T>(subjectName: string) => readonly [T | null, (newState: T) => void];

export { Singleton as AppBridge, appBridgeService, useAppBridge };
