import {Directive} from 'angular2/src/core/annotations_impl/annotations';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Optional} from 'angular2/src/di/annotations_impl'

import {ViewItem} from './view-item';

import {Ion} from '../ion';

@Directive({
  selector: 'ion-view',
})
export class IonView extends Ion {
  constructor(@Optional() item: ViewItem, elementRef: ElementRef) {
    super(elementRef);
    this.ele = elementRef.nativeElement;
  }
}
