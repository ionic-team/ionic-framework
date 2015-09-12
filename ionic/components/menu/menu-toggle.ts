import {Directive} from 'angular2/angular2';

import {IonicApp} from '../app/app';

/**
* TODO
*/
@Directive({
  selector: '[menu-toggle]',
  properties: [
    'menuToggle'
  ],
  host: {
    '(click)': 'toggle($event)'
  }
})
export class MenuToggle {

  constructor(private app: IonicApp) {}

  onInit() {
    // Get the component with this toggleTarget tag, or use "menu" if none
    this.menu = this.app.getComponent(this.menuToggle || 'menu');
  }

  /**
  * TODO
  * @param {TODO} event  TODO
  */
  toggle(ev) {
    this.menu && this.menu.toggle();
    ev.preventDefault();
    ev.stopPropagation();
  }
}
