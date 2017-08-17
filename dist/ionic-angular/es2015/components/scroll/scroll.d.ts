import { ElementRef } from '@angular/core';
/**
 * @name Scroll
 * @description
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places where you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
 * @usage
 * ```html
 * <ion-scroll scrollX="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollY="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollX="true" scrollY="true">
 * </ion-scroll>
 * ```
 * @demo /docs/demos/src/scroll/
 */
export declare class Scroll {
    _scrollX: boolean;
    _scrollY: boolean;
    _zoom: boolean;
    _maxZoom: number;
    /**
     * @input {boolean} If true, scrolling along the X axis is enabled.
     */
    scrollX: any;
    /**
     * @input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
     */
    scrollY: any;
    /**
     * @input {boolean} If true, zooming is enabled.
     */
    zoom: any;
    /**
     * @input {number} Set the max zoom amount.
     */
    maxZoom: any;
    /**
     * @hidden
     */
    maxScale: number;
    /**
     * @hidden
     */
    zoomDuration: number;
    /** @internal */
    _scrollContent: ElementRef;
    constructor();
    /**
     * @hidden
     * Add a scroll event handler to the scroll element if it exists.
     * @param {Function} handler  The scroll handler to add to the scroll element.
     * @returns {?Function} a function to remove the specified handler, otherwise
     * undefined if the scroll element doesn't exist.
     */
    addScrollEventListener(handler: any): () => void;
}
