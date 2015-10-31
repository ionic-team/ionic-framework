import {Directive, ElementRef} from 'angular2/angular2';

@Directive({
  properties: ['<%= fileAndClassName %>'], //Change to be whatever properties you want, ex: <<%= fileAndClassName %> value="5">
  inputs: ['<%= fileAndClassName %>']
})
export class <%= javascriptClassName %> {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef;
  }
}
