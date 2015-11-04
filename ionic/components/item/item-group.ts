import {Directive, ElementRef, Host, Optional, NgZone} from 'angular2/angular2';
import {Content} from '../content/content';
import {throttle} from '../../util/util';
import {position, offset, CSS, raf} from '../../util/dom';
import {Config} from '../../config/config';

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group',
  host: {
    'class': 'item-group'
  }
})
export class ItemGroup {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group-title',
  host: {
    'class': 'item-group-title',
    '[class.sticky]': 'isSticky'
  }
})
export class ItemGroupTitle {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    private elementRef: ElementRef,
    private zone: NgZone,
    config: Config,
    private content: Content
  ) {
    // make sure the sticky class gets set on the title
    this.isSticky = true;
  }
}
