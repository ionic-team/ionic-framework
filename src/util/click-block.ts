import { Directive, ElementRef, forwardRef, Inject, Renderer } from '@angular/core';

import { App } from '../components/app/app';
import { clearNativeTimeout, nativeTimeout } from './dom';
import { Config } from '../config/config';

const DEFAULT_EXPIRE = 330;


/**
 * @private
 */
@Directive({
  selector: '.click-block'
})
export class ClickBlock {
  private _tmrId: number;
  private _showing: boolean = false;
  isEnabled: boolean;

  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    app._clickBlock = this;
    this.isEnabled = config.getBoolean('clickBlock', true);
  }

  activate(shouldShow: boolean, expire: number) {
    if (this.isEnabled) {
      clearNativeTimeout(this._tmrId);

      if (shouldShow) {
        this._tmrId = nativeTimeout(this.activate.bind(this, false), expire || DEFAULT_EXPIRE);
      }

      if (this._showing !== shouldShow) {
        this.renderer.setElementClass(this.elementRef.nativeElement, 'click-block-active', shouldShow);
        this._showing = shouldShow;
      }
    }
  }

}
