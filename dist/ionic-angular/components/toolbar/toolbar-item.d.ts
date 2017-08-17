import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';
/**
 * @hidden
 */
export declare class ToolbarItem extends Ion {
    inToolbar: boolean;
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer, toolbar: Toolbar, navbar: Navbar);
    _buttons: any;
}
