import {Directive, ElementRef, Optional} from 'angular2/angular2';

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
