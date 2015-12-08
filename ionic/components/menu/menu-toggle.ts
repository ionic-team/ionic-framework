import {Directive, ElementRef, Optional} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {ViewController} from '../nav/view-controller';
import {Navbar} from '../navbar/navbar';


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

    // Deprecation warning
    if (this.withinNavbar && elementRef.nativeElement.tagName === 'A') {
      console.warn('Menu toggles within a navbar should use <button menu-toggle> instead of <a toggle>')
    }
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
