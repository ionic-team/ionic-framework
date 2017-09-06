import { ElementRef, Renderer } from '@angular/core';
import { Slides } from './slides';
/**
 * @name Slide
 * @description
 * The Slide component is a child component of [Slides](../Slides). The template
 * should be written as `ion-slide`. Any slide content should be written
 * in this component and it should be used in conjunction with [Slides](../Slides).
 *
 * See the [Slides API Docs](../Slides) for more usage information.
 *
 * @demo /docs/demos/src/slides/
 * @see {@link /docs/api/components/slides/Slides/ Slides API Docs}
 */
export declare class Slide {
    private _slides;
    constructor(elementRef: ElementRef, renderer: Renderer, _slides: Slides);
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
