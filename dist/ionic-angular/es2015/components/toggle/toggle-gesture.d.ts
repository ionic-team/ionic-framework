import { GestureController } from '../../gestures/gesture-controller';
import { DomController } from '../../platform/dom-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { Platform } from '../../platform/platform';
import { Toggle } from './toggle';
/**
 * @hidden
 */
export declare class ToggleGesture extends PanGesture {
    toggle: Toggle;
    constructor(plt: Platform, toggle: Toggle, gestureCtrl: GestureController, domCtrl: DomController);
    canStart(): boolean;
    onDragStart(ev: any): void;
    onDragMove(ev: any): void;
    onDragEnd(ev: any): void;
}
