import {Component, View, ElementRef, EventEmitter, Parent} from 'angular2/angular2'

import {Content} from '../content/content';


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
    this.ele = element.nativeElement;
    this.ele.classList.add('content');

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
