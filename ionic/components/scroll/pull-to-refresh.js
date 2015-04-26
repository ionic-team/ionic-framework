import {NgElement, Decorator, Component, View as NgView, PropertySetter} from 'angular2/angular2';

@Decorator({
  selector: '[ion-refresher]'
})
export class Refresher {
  constructor(
    @NgElement() element:NgElement
  ) {
    this.domElement = element.domElement;
    this.domElement.classList.add('content');

    console.log(this.domElement);

    this.domElement.children[0].addEventListener('scroll', function(e) {
      console.log('CONTENT: scroll', e.target.scrollTop);
    });
  }
}
