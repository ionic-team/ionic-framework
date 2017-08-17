import { DomController } from '../platform/dom-controller';
import { GestureDelegate } from './gesture-controller';
import { Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare class PanGesture {
    plt: Platform;
    private element;
    private debouncer;
    private events;
    private pointerEvents;
    private detector;
    protected started: boolean;
    private captured;
    isListening: boolean;
    protected gestute: GestureDelegate;
    protected direction: string;
    private eventsConfig;
    constructor(plt: Platform, element: HTMLElement, opts?: PanGestureConfig);
    listen(): void;
    unlisten(): void;
    destroy(): void;
    pointerDown(ev: any): boolean;
    pointerMove(ev: any): void;
    pointerUp(ev: any): void;
    tryToCapture(ev: any): boolean;
    abort(ev: any): void;
    getNativeElement(): HTMLElement;
    canStart(_ev: any): boolean;
    onDragStart(_ev: any): void;
    onDragMove(_ev: any): void;
    onDragEnd(_ev: any): void;
    notCaptured(_ev: any): void;
}
/**
 * @hidden
 */
export interface PanGestureConfig {
    threshold?: number;
    maxAngle?: number;
    direction?: 'x' | 'y';
    gesture?: GestureDelegate;
    domController?: DomController;
    zone?: boolean;
    capture?: boolean;
    passive?: boolean;
}
