import { List } from '../list/list';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
export declare class ItemSlidingGesture extends PanGesture {
    list: List;
    private preSelectedContainer;
    private selectedContainer;
    private openContainer;
    private firstCoordX;
    private firstTimestamp;
    constructor(plt: Platform, list: List, gestureCtrl: GestureController, domCtrl: DomController);
    canStart(ev: any): boolean;
    onDragStart(ev: any): void;
    onDragMove(ev: any): void;
    onDragEnd(ev: any): void;
    notCaptured(ev: any): void;
    closeOpened(): boolean;
    destroy(): void;
}
