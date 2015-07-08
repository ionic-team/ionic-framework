import {Directive, ElementRef} from 'angular2/angular2';


@Directive({
  selector: 'ion-item-group',
  host: {
    'class': 'item-group'
  }
})
export class ItemGroup {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
}


@Directive({
  selector: 'ion-item-group-title',
  host: {
    'class': 'item-group-title',
    '[class.sticky]': 'isSticky'
  }
})
export class ItemGroupTitle {
  constructor(elementRef: ElementRef) {
    this.isSticky = true;
    this.ele = elementRef.nativeElement;
  }
}
