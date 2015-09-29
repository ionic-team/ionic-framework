import {Directive, ElementRef, Optional} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {ViewController} from '../nav/view-controller';
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
    '(click)': 'toggle()',
    '[hidden]': 'isHidden'
  }
})
export class MenuToggle extends Ion {

  constructor(
    app: IonicApp,
    elementRef: ElementRef,
    @Optional() viewCtrl: ViewController,
    @Optional() navbar: Navbar
  ) {
    super(elementRef, null);
    this.app = app;
    this.viewCtrl = viewCtrl;
    this.withinNavbar = !!navbar;
  }

  /**
  * TODO
  * @param {TODO} event  TODO
  */
  toggle() {
    let menu = this.app.getComponent(this.menuToggle || 'menu');
    menu && menu.toggle();
  }

  get isHidden() {
    if (this.withinNavbar && this.viewCtrl) {
      return !this.viewCtrl.isRoot();
    }
    return false;
  }

}
