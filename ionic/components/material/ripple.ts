import {Directive, ElementRef} from 'angular2/angular2';

@Directive({
  selector: '[md-ripple]',
  host: {
    '(click)': 'elementClicked($event)'
  }
})
export class MaterialRipple {
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    console.log('Ripple', elementRef);
  }

  elementClicked(event) {
  }
}
