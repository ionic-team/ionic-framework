import {Directive, ElementRef} from 'angular2/angular2';

@Directive({
  properties: ['<%= fileName %>'], //Change to be whatever properties you want, ex: <<%= fileName %> value="5">
  inputs: ['<%= fileName %>']
})
export class <%= jsClassName %> {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef;
  }
}
