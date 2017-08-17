import { Menu } from './menu';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Platform } from '../../platform/platform';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
import { SlideData } from '../../gestures/slide-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
export declare class MenuContentGesture extends SlideEdgeGesture {
    menu: Menu;
    constructor(plt: Platform, menu: Menu, gestureCtrl: GestureController, domCtrl: DomController);
    canStart(ev: any): boolean;
    onSlideBeforeStart(): void;
    onSlideStart(): void;
    onSlide(slide: SlideData): void;
    onSlideEnd(slide: SlideData): void;
    getElementStartPos(slide: SlideData): number;
    getSlideBoundaries(): {
        min: number;
        max: number;
    };
}
