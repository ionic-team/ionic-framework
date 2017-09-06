import { PanGesture } from './pan-gesture';
import { Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare class SlideGesture extends PanGesture {
    slide: SlideData;
    constructor(plt: Platform, element: HTMLElement, opts?: {});
    getSlideBoundaries(_slide: SlideData, _ev: any): {
        min: number;
        max: number;
    };
    getElementStartPos(_slide: SlideData, _ev: any): number;
    onDragStart(ev: any): void;
    onDragMove(ev: any): void;
    onDragEnd(ev: any): void;
    onSlideBeforeStart(_ev?: any): void;
    onSlideStart(_slide?: SlideData, _ev?: any): void;
    onSlide(_slide?: SlideData, _ev?: any): void;
    onSlideEnd(_slide?: SlideData, _ev?: any): void;
}
/**
 * @hidden
 */
export interface SlideData {
    min: number;
    max: number;
    distance: number;
    delta: number;
    started: boolean;
    pos: any;
    timestamp: number;
    pointerStartPos: number;
    elementStartPos: number;
    velocity: number;
}
