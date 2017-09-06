import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export declare class ListHeader extends Ion {
    private _id;
    constructor(config: Config, renderer: Renderer, elementRef: ElementRef, _id: string);
    id: string;
}
