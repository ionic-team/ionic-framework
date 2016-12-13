import { Directive, ElementRef } from '@angular/core';

import { CSS, rafFrames } from '../../util/dom';
import { Tab } from './tab';

/**
 * @private
 */
@Directive({
  selector: '.tab-highlight'
})
export class TabHighlight {
  private _init: boolean;

  constructor(private _elementRef: ElementRef) {}

  select(tab: Tab) {
    rafFrames(3, () => {
      const d = tab.btn.getDimensions();
      const ele = this._elementRef.nativeElement;
      (<any>ele.style)[CSS.transform] = `translate3d(${d.left}px,0,0) scaleX(${d.width})`;

      if (!this._init) {
        this._init = true;
        rafFrames(6, () => {
          ele.classList.add('animate');
        });
      }
    });
  }

}
