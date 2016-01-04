import {App, IonicApp, Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import * as helpers from '../../helpers';

@Page({
  templateUrl: 'menus/basic/menu-home.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class BasicPage{
  constructor(app: IonicApp) {
    this.app = app;
    this.app.getComponent('leftMenu').enable(true);
  }
}

@Page({
  templateUrl: 'menus/basic/menu-home.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageOne{
  constructor() {
  }
}

@Page({
  templateUrl: 'menus/basic/menu-friends.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageTwo{
}

@Page({
  templateUrl: 'menus/basic/menu-events.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class PageThree{
}
