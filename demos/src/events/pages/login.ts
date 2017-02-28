import { Component } from '@angular/core';
import { Events } from '../../../../src';

@Component({
  templateUrl: 'login.html'
})
export class Login {
  user = {
    name: 'Administrator',
    username: 'admin'
  };

  constructor(private events: Events) {}

  login() {
    this.events.publish('user:login');
  }
}
