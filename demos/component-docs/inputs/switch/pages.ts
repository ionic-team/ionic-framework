import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'inputs/switch/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class SwitchPage{
  constructor() {
  }
}
