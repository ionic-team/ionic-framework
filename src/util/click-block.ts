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
    let enabled = this.isEnabled = config.getBoolean('clickBlock', true);
    if (enabled) {
      this.setElementClass('click-block-enabled', true);
    }
  }

  activate(shouldShow: boolean, expire: number = 100) {
    if (this.isEnabled) {
      clearNativeTimeout(this._tmrId);
      if (shouldShow) {
        this._activate(true);
      }
      this._tmrId = nativeTimeout(this._activate.bind(this, false), expire);
    }
  }

  _activate(shouldShow: boolean) {
    if (this._showing !== shouldShow) {
      this.setElementClass('click-block-active', shouldShow);
      this._showing = shouldShow;
    }
  }

  setElementClass(className: string, add: boolean) {
    this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
  }

}
