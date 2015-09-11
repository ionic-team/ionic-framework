import {Directive} from 'angular2/angular2';

import {IonicApp} from '../app/app';

/**
* TODO
*/
@Directive({
  selector: '[aside-toggle]',
  properties: [
    'asideToggle'
  ],
  host: {
    '(^click)': 'toggle($event)'
  }
})
export class AsideToggle {
  /**
  * TODO
  * @param {IonicApp} app  TODO
  */
  constructor(private app: IonicApp) {
  }
  onInit() {
    let toggleTarget = this.asideToggle;

    // Get the component with this toggleTarget tag, or use "menu" if none
    this.aside = this.app.getComponent(toggleTarget || 'menu');
  }
  /**
  * TODO
  * @param {TODO} event  TODO
  */
  toggle(event) {
    this.aside && this.aside.toggle();
  }
}
