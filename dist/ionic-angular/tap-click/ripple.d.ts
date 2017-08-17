import { ActivatorBase } from './activator-base';
import { Activator } from './activator';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { PointerCoordinates } from '../util/dom';
import { DomController } from '../platform/dom-controller';
/**
 * @hidden
 */
export declare class RippleActivator implements ActivatorBase {
    private dom;
    protected highlight: Activator;
    constructor(app: App, config: Config, dom: DomController);
    clickAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    downAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    clearState(animated: boolean): void;
    _downAction(ev: UIEvent, activatableEle: HTMLElement, _startCoord: PointerCoordinates): void;
    _upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    _clickAction(_ev: UIEvent, _activatableEle: HTMLElement, _startCoord: PointerCoordinates): void;
    startRippleEffect(rippleEle: any, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
}
