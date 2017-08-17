import { ContentChildren, Directive, ElementRef, QueryList, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
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
@Directive({
  selector: 'ion-fab-list',
})
export class FabList {
  _visible: boolean = false;
  _fabs: FabButton[] = [];
  _mode: string;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    config: Config,
    private _plt: Platform
  ) {
    this._mode = config.get('mode');
  }

  @ContentChildren(FabButton)
  set _setbuttons(query: QueryList<FabButton>) {
    const fabs = this._fabs = query.toArray();
    const className = `fab-${this._mode}-in-list`;
    for (var fab of fabs) {
      fab.setElementClass('fab-in-list', true);
      fab.setElementClass(className, true);
    }
  }

  /**
   * @hidden
   */
  setVisible(val: boolean) {
    let visible = isTrueProperty(val);
    if (visible === this._visible) {
      return;
    }
    this._visible = visible;

    let fabs = this._fabs;
    let i = 1;
    if (visible) {
      fabs.forEach(fab => {
        this._plt.timeout(() => fab.setElementClass('show', true), i * 30);
        i++;
      });
    } else {
      fabs.forEach(fab => fab.setElementClass('show', false));
    }
    this.setElementClass('fab-list-active', visible);
  }

  /**
   * @internal
   */
  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }
}
