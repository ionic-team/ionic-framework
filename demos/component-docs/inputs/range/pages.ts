import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'inputs/range/template.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class RangePage{
  constructor() {
  }
}