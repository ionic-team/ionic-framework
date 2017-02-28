import { Component } from '@angular/core';
import { NavParams } from '../../../../src';

@Component({
  templateUrl: 'push-page.html'
})
export class PushPage {
  myParam: string;

  constructor(params: NavParams) {
    this.myParam = params.get('myParam');
  }
}
