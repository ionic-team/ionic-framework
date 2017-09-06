import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { Platform } from '../platform/platform';
import { SlideData } from '../gestures/slide-gesture';
import { SlideEdgeGesture } from '../gestures/slide-edge-gesture';
/**
 * @hidden
 */
export declare class SwipeBackGesture extends SlideEdgeGesture {
    private _nav;
    constructor(plt: Platform, _nav: NavControllerBase, gestureCtlr: GestureController, domCtrl: DomController);
    canStart(ev: any): boolean;
    onSlideBeforeStart(_ev: any): void;
    onSlide(slide: SlideData, ev: any): void;
    onSlideEnd(slide: SlideData, _ev: any): void;
}
