import {View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';


/**
 * ion-scroll is a non-flexboxed scroll area that can
 * scroll horizontally or vertically.
 */
@IonicComponent({
  selector: 'ion-scroll',
  properties: [
    'scrollX', 'scrollY'
  ],
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  }
})
@View({
  template: '<scroll-content><ng-content></ng-content></scroll-content>'
})
export class Scroll extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);

    setTimeout(() => {
      this.scrollElement = this.getNativeElement().children[0];
    });
  }

  /**
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
