import { Component } from '@angular/core';
import { Events } from '../../../../../src';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  user = {
    name: 'Administrator',
    username: 'admin'
  };

  constructor(private events: Events) {}

  login() {
    this.events.publish('user:login');
  }
}
