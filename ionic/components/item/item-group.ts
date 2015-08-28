import {Directive, ElementRef} from 'angular2/angular2';

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
  constructor(elementRef: ElementRef) {
    this.isSticky = true;
    this.ele = elementRef.nativeElement;
  }
}
