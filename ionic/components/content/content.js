import {Renderer, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {SwipeHandle} from './swipe-handle';
import {NavItem} from '../nav/nav-item';


@Component({
  selector: 'ion-content'
})
@View({
  template: `
    <div class="scroll-content">
      <content></content>
    </div>
    <swipe-handle [hidden]="hideSwipeHandle"></swipe-handle>`,
  directives: [SwipeHandle]
})
export class Content {
  constructor(navItem: NavItem) {
    this.navItem = navItem;
  }

  get hideSwipeHandle() {
    return !this.navItem.enableBack;
  }
}
