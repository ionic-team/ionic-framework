import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, ScrollEvent } from '../../../../../../';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  @ViewChild(Content) content: Content;
  page1 = 'PageTwo';
  showToolbar: boolean = false;

  onScroll(ev: ScrollEvent) {
    console.log(`scroll move: scrollTop: ${ev.scrollTop}, directionY: ${ev.directionY}, velocityY: ${ev.velocityY}`);
  }

  toggleToolbar() {
    this.showToolbar = !this.showToolbar;
    this.content.resize();
  }
}
