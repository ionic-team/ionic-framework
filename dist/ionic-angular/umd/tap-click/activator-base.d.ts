import { PointerCoordinates } from '../util/dom';
export declare abstract class ActivatorBase {
    abstract clickAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    abstract downAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    abstract upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: PointerCoordinates): void;
    abstract clearState(animated: boolean): void;
}
export declare function isActivatedDisabled(ev: any, activatableEle: any): boolean;
