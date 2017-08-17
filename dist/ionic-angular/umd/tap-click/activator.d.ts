import { ActivatorBase } from './activator-base';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { PointerCoordinates } from '../util/dom';
export declare class Activator implements ActivatorBase {
    protected app: App;
    private dom;
    protected _queue: HTMLElement[];
    protected _active: HTMLElement[];
    protected _activeDefer: Function;
    protected _clearDefer: Function;
    _css: string;
    activatedDelay: number;
    clearDelay: number;
    constructor(app: App, config: Config, dom: DomController);
    clickAction(ev: UIEvent, activatableEle: HTMLElement, _startCoord: PointerCoordinates): void;
    downAction(ev: UIEvent, activatableEle: HTMLElement, _startCoord: PointerCoordinates): void;
    upAction(_ev: UIEvent, _activatableEle: HTMLElement, _startCoord: PointerCoordinates): void;
    _scheduleClear(): void;
    unscheduleClear(): void;
    clearState(animated: boolean): void;
    deactivate(animated: boolean): void;
    _clearDeferred(): void;
}
