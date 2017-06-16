import { Directive, ElementRef } from '@angular/core';

import { DomController } from '../../platform/dom-controller';
import { Tab } from './tab';

/**
 * @hidden
 */
@Directive({
  selector: '.tab-highlight'
})
export class TabHighlight {
  private _init: boolean;

  constructor(private _elementRef: ElementRef, private _dom: DomController) {}

  select(tab: Tab) {
    if (!tab) {
      return;
    }
    const dom = this._dom;

    dom.read(() => {
      const btnEle: HTMLElement = tab.btn.getNativeElement();
      const transform = `translate3d(${btnEle.offsetLeft}px,0,0) scaleX(${btnEle.offsetWidth})`;

      dom.write(() => {
        const ele = this._elementRef.nativeElement;
        (<any>ele.style)[dom.plt.Css.transform] = transform;

        if (!this._init) {
          this._init = true;
          dom.write(() => {
            ele.classList.add('animate');
          }, 80);
        }

      });
    }, 32);
  }

}
