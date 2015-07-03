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

    this.content = content;

    this.refresh = new EventEmitter('refresh');

    setTimeout(() => {
      this.initEvents();
    }, 1000);
  }

  doRefresh() {
    console.log('REFRESH');
    this.refresh.next({
      amt: 0
    });
  }

  initEvents() {

    let sp = this.content;
    let sc = this.content.scrollElement;

    sc.addEventListener('touchmove', this._handleTouchMove);
    sc.addEventListener('touchend', this._handleTouchEnd);
    sc.addEventListener('scroll', this._handleScroll);
  }

  onDehydrate() {
    console.log('DEHYDRATION');
    let sc = this.content.scrollElement;
    sc.removeEventListener('touchmove', this._handleTouchMove);
    sc.removeEventListener('touchend', this._handleTouchEnd);
    sc.removeEventListener('scroll', this._handleScroll);
  }

  _handleTouchMove(e) {
    console.log('TOUCHMOVE', e);
  }
  _handleTouchEnd(e) {
    console.log('TOUCHEND', e);
  }
  _handleScroll(e) {
    console.log('SCROLL', e.target.scrollTop);
  }
}
