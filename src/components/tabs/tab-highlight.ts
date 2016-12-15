import { Directive, ElementRef } from '@angular/core';

import { CSS } from '../../util/dom';
import { DomController } from '../../util/dom-controller';
import { nativeTimeout } from '../../util/native-window';
import { Tab } from './tab';

/**
 * @private
 */
@Directive({
  selector: '.tab-highlight'
})
export class TabHighlight {
  private _init: boolean;

  constructor(private _elementRef: ElementRef, private _dom: DomController) {}

  select(tab: Tab) {
    nativeTimeout(() => {
      this._dom.read(() => {
        const btnEle: HTMLElement = tab.btn.getElementRef().nativeElement;

        this._dom.write(() => {
          const ele = this._elementRef.nativeElement;
          (<any>ele.style)[CSS.transform] = `translate3d(${btnEle.offsetLeft}px,0,0) scaleX(${btnEle.offsetWidth})`;

          if (!this._init) {
            this._init = true;
            nativeTimeout(() => {
              this._dom.write(() => {
                ele.classList.add('animate');
              });
            }, 80);
          }
        });
      });
    }, 32);
  }

}
