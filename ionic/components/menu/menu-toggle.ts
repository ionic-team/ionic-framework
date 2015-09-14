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
}
