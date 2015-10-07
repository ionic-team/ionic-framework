import {Directive, Renderer, ElementRef} from 'angular2/angular2';

@Directive({
  selector: '[ion-blur]'
})
export class Blur {
  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    renderer.setElementStyle(elementRef, '-webkit-backdrop-filter', 'blur(10px)');
  }
}
