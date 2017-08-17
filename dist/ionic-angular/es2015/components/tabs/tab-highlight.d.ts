import { ElementRef } from '@angular/core';
import { DomController } from '../../platform/dom-controller';
import { Tab } from './tab';
/**
 * @hidden
 */
export declare class TabHighlight {
    private _elementRef;
    private _dom;
    private _init;
    constructor(_elementRef: ElementRef, _dom: DomController);
    select(tab: Tab): void;
}
