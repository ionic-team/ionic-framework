import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../config/config';
/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
/** @hidden */
export declare class Ion {
    /** @hidden */
    _config: Config;
    /** @hidden */
    _elementRef: ElementRef;
    /** @hidden */
    _renderer: Renderer;
    /** @hidden */
    _color: string;
    /** @hidden */
    _mode: string;
    /** @hidden */
    _componentName: string;
    /**
     * @input {string} The color to use from your Sass `$colors` map.
     * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
     * For more information, see [Theming your App](/docs/theming/theming-your-app).
     */
    color: string;
    /**
     * @input {string} The mode determines which platform styles to use.
     * Possible values are: `"ios"`, `"md"`, or `"wp"`.
     * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
     */
    mode: string;
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer, componentName?: string);
    /** @hidden */
    setElementClass(className: string, isAdd: boolean): void;
    /** @hidden */
    setElementAttribute(attributeName: string, attributeValue: any): void;
    /** @hidden */
    setElementStyle(property: string, value: string): void;
    /** @hidden */
    _setColor(newColor: string, componentName?: string): void;
    /** @hidden */
    _setMode(newMode: string): void;
    /** @hidden */
    _setComponentName(): void;
    /** @hidden */
    getElementRef(): ElementRef;
    /** @hidden */
    getNativeElement(): any;
}
