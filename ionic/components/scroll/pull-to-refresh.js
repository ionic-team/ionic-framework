import {Renderer, ElementRef, EventEmitter} from 'angular2/angular2'
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content} from 'ionic/ionic';

@Component({
  selector: 'ion-refresher',
  events: ['refresh']
})
@View({
  template: '<div class="refresher"></div>',
})
export class Refresher {
  constructor(
    @Parent() content: Content,
    element: ElementRef
  ) {
    this.domElement = element.domElement;
    this.domElement.classList.add('content');

    this.refresh = new EventEmitter('refresh');

    setTimeout(() => {
      content.scrollElement.addEventListener('scroll', function(e) {
        console.log('CONTENT: scroll', e.target.scrollTop);
      });
    }, 1000);
  }

  doRefresh() {
    console.log('REFRESH');
    this.refresh.next({
      amt: 0
    });
  }
}
