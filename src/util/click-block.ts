import { Directive, ElementRef, forwardRef, Inject, Renderer } from '@angular/core';

import { App } from '../components/app/app';
import { clearNativeTimeout, nativeTimeout } from './dom';
import { Config } from '../config/config';


/**
 * @private
 */
@Directive({
  selector: '.click-block'
})
export class ClickBlock {
  private _tmr: number;
  private _showing: boolean = false;
  isEnabled: boolean;

  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    app._clickBlock = this;

    const enabled = this.isEnabled = config.getBoolean('clickBlock', true);
    if (enabled) {
      this._setElementClass('click-block-enabled', true);
    }
  }

  activate(shouldShow: boolean, expire: number = 100) {
    if (this.isEnabled) {
      clearNativeTimeout(this._tmr);
      if (shouldShow) {
        this._activate(true);
      }
      this._tmr = nativeTimeout(this._activate.bind(this, false), expire);
    }
  }

  /** @internal */
  _activate(shouldShow: boolean) {
    if (this._showing !== shouldShow) {
      this._setElementClass('click-block-active', shouldShow);
      this._showing = shouldShow;
    }
  }

  private _setElementClass(className: string, add: boolean) {
    this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
  }

}
