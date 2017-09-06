import { ElementRef, QueryList, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
import { FabButton } from './fab';
/**
  * @name FabList
  * @description
  * `ion-fab-list` is a container for multiple FAB buttons. They are components of `ion-fab` and allow you to specificy the buttons position, left, right, top, bottom.
  * @usage
  *
  * ```html
  *  <ion-fab bottom right >
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab>Facebook</button>
  *      <button ion-fab>Twitter</button>
  *      <button ion-fab>Youtube</button>
  *    </ion-fab-list>
  *    <ion-fab-list side="left">
  *      <button ion-fab>Vimeo</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * ```
  * @module ionic
  *
  * @demo /docs/demos/src/fab/
  * @see {@link /docs/components#fab Fab Component Docs}
 */
export declare class FabList {
    private _elementRef;
    private _renderer;
    private _plt;
    _visible: boolean;
    _fabs: FabButton[];
    _mode: string;
    constructor(_elementRef: ElementRef, _renderer: Renderer, config: Config, _plt: Platform);
    _setbuttons: QueryList<FabButton>;
    /**
     * @hidden
     */
    setVisible(val: boolean): void;
    /**
     * @internal
     */
    setElementClass(className: string, add: boolean): void;
}
