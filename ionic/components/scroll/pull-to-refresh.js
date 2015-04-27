import {NgElement, EventEmitter, Decorator, Component, View as NgView, PropertySetter} from 'angular2/angular2';

@Decorator({
  selector: '[ion-refresher]'
})
export class Refresher {
  constructor(
    @NgElement() element:NgElement
  ) {
    this.domElement = element.domElement;
    this.domElement.classList.add('content');

    this.refreshEvent = new EventEmitter('refreshing');

    console.log(this.domElement);

    this.domElement.children[0].addEventListener('scroll', function(e) {
      console.log('CONTENT: scroll', e.target.scrollTop);
    });

    setTimeout(() => {
      this.refresh()
    }, 1000);
  }

  refresh() {
    console.log('REFRESH');
    this.refreshEvent.next({
      data: 'blah'
    });
  }
}
