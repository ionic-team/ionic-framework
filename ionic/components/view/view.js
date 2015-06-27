import {Directive} from 'angular2/src/core/annotations_impl/annotations';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Optional} from 'angular2/src/di/annotations_impl'

import {ViewItem} from './view-item';


@Directive({
  selector: 'ion-view',
})
export class IonView {
  constructor(@Optional() item: ViewItem, elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
}
