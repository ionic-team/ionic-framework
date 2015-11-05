import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'inputs/checkbox/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CheckboxPage{
  constructor() {
  }
}
