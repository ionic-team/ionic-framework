import { Directive, ElementRef, Inject, Renderer, forwardRef } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';


/**
 * @hidden
 */
@Directive({
  selector: '.click-block'
})
export class ClickBlock {
  private _tmr: number;
  private _showing: boolean = false;
  private _start: number;
  private _minEnd: number;
  isEnabled: boolean;

  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    private plt: Platform,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    app._clickBlock = this;

    const enabled = this.isEnabled = config.getBoolean('clickBlock', true);
    if (enabled) {
      this._setElementClass('click-block-enabled', true);
    }
  }

  activate(shouldShow: boolean, expire: number = 100, minDuration: number = 0) {
    if (this.isEnabled) {
      this.plt.cancelTimeout(this._tmr);
      if (shouldShow) {
        // remember when we started the click block
        this._start = Date.now();
        // figure out the minimum time it should be showing until
        // this is useful for transitions that are less than 300ms
        this._minEnd = this._start + (minDuration || 0);
        this._activate(true);
      }
      this._tmr = this.plt.timeout(this._activate.bind(this, false), expire);
    }
  }

  /** @internal */
  _activate(shouldShow: boolean) {
    if (this._showing !== shouldShow) {

      if (!shouldShow) {
        // check if it was enabled before the minimum duration
        // this is useful for transitions that are less than 300ms
        var now = Date.now();
        if (now < this._minEnd) {
          this._tmr = this.plt.timeout(this._activate.bind(this, false), this._minEnd - now);
          return;
        }
      }

      this._setElementClass('click-block-active', shouldShow);
      this._showing = shouldShow;
    }
  }

  private _setElementClass(className: string, add: boolean) {
    this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
  }

}
