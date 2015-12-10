import {Directive, ElementRef, Optional} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {ViewController} from '../nav/view-controller';
import {Navbar} from '../navbar/navbar';
import {Menu} from './menu';


/**
* TODO
* @see {@link /docs/v2/components#menus Menu Component Docs}
* @see {@link ../../menu/Menu Menu API Docs}
*/
@Directive({
  selector: '[menu-toggle]',
  inputs: [
    'menuToggle'
  ],
  host: {
    '(click)': 'toggle()',
    '[hidden]': 'isHidden',
    'menu-toggle': '' //ensures the attr is there for css when using [menu-toggle]
  }
})
export class MenuToggle {

  constructor(
    app: IonicApp,
    elementRef: ElementRef,
    @Optional() viewCtrl: ViewController,
    @Optional() navbar: Navbar
  ) {
    this.app = app;
    this.viewCtrl = viewCtrl;
    this.withinNavbar = !!navbar;

    // Deprecation warning
    if (this.withinNavbar && elementRef.nativeElement.tagName === 'A') {
      console.warn('Menu toggles within a navbar should use <button menu-toggle> instead of <a toggle>')
    }
  }

  /**
  * @private
  */
  toggle() {
    let menu = Menu.getById(this.app, this.menuToggle);
    menu && menu.toggle();
  }

  /**
  * @private
  */
  get isHidden() {
    if (this.withinNavbar && this.viewCtrl) {
      return !this.viewCtrl.isRoot();
    }
    return false;
  }

}
