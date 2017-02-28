import { Component, ViewChild } from '@angular/core';

import { Content, ScrollEvent } from '../../../../../../';

import { Page1 } from '../page1/page1';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  @ViewChild(Content) content: Content;
  page1 = Page1;
  showToolbar: boolean = false;

  onScroll(ev: ScrollEvent) {
    console.log(`scroll move: scrollTop: ${ev.scrollTop}, directionY: ${ev.directionY}, velocityY: ${ev.velocityY}`);
  }

  toggleToolbar() {
    this.showToolbar = !this.showToolbar;
    this.content.resize();
  }
}
