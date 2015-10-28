import {App, IonicApp, Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';

@Page({
  templateUrl: 'inputs/checkbox.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class CheckboxPage{
  constructor() {
  }
}

@Page({
  templateUrl: 'inputs/radio.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class RadioPage{
  constructor() {
  }
}

@Page({
  templateUrl: 'inputs/range.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class RangePage{
  constructor() {
  }
}

@Page({
  templateUrl: 'inputs/select.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class SelectPage{
  constructor() {
  }
}

@Page({
  templateUrl: 'inputs/switch.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class SwitchPage{
  constructor() {
  }
}
