import { Component } from '@angular/core';
import { Events } from '../../../../src';

@Component({
  templateUrl: 'logout.html'
})
export class Logout {
  constructor(private events: Events) {}

  logout() {
    this.events.publish('user:logout');
  }
}
