import { SlideGesture } from './slide-gesture';
import { Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare class SlideEdgeGesture extends SlideGesture {
    edges: string[];
    maxEdgeStart: any;
    private _d;
    constructor(plt: Platform, element: HTMLElement, opts?: any);
    setEdges(edges: string): void;
    canStart(ev: any): boolean;
    getContainerDimensions(): {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    _checkEdge(edge: string, pos: any): boolean;
}
