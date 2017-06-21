import { Component } from '@angular/core';
import { Events } from '../../../../../src';

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  constructor(private events: Events) {}

  logout() {
    this.events.publish('user:logout');
  }
}
