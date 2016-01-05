import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'inputs/range/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class RangePage{
  constructor() {
  }
}