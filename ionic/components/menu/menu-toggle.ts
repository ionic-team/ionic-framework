import {Directive, Optional} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {ViewItem} from '../view/view-item';
import {Navbar} from '../nav-bar/nav-bar';


/**
* TODO
*/
@Directive({
  selector: '[menu-toggle]',
  properties: [
    'menuToggle'
  ],
  host: {
    '(click)': 'toggle($event)',
    '[hidden]': 'isHidden'
  }
})
export class MenuToggle {

  constructor(app: IonicApp, @Optional() item: ViewItem, @Optional() navbar: Navbar) {
    this.app = app;
    this.item = item;
    this.withinNavbar = !!navbar;
  }

  /**
  * TODO
  * @param {TODO} event  TODO
  */
  toggle(ev) {
    let menu = this.app.getComponent(this.menuToggle || 'menu');
    menu && menu.toggle();
    ev.preventDefault();
    ev.stopPropagation();
  }

  get isHidden() {
    if (this.withinNavbar && this.item) {
      return !this.item.isRoot();
    }
    return false;
  }

}
