import { ElementRef } from '@angular/core';
/**
 * @hidden
 */
export declare class Reorder {
    private elementRef;
    constructor(elementRef: ElementRef);
    getReorderNode(): HTMLElement;
    onClick(ev: UIEvent): void;
}
