import { Component } from '@angular/core';
import { NavParams } from '../../../../../src';

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  myParam: string;

  constructor(params: NavParams) {
    this.myParam = params.get('myParam');
  }
}
