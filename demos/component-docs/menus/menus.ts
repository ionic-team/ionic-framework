import {App, IonicApp, Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';

@Page({
  templateUrl: 'menus/menu-home.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class MenusPage{
  constructor() {
  }
}

@Page({
  templateUrl: 'menus/menu-home.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageOne{
  constructor() {
  }
}

@Page({
  templateUrl: 'menus/menu-friends.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageTwo{
}

@Page({
  templateUrl: 'menus/menu-events.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageThree{
}
