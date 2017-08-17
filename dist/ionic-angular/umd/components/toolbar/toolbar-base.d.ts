import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { ToolbarTitle } from './toolbar-title';
/**
 * @hidden
 */
export declare class ToolbarBase extends Ion {
    private _title;
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer);
    /**
     * @hidden
     */
    _setTitle(titleCmp: ToolbarTitle): void;
    /**
     * @hidden
     * Returns the toolbar title text if it exists or an empty string
     */
    getTitleText(): any;
}
