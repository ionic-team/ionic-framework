import {Directive} from 'angular2/angular2';

import {IonicApp} from '../app/app';

/**
* TODO
*/
@Directive({
  selector: '[aside-toggle]',
  host: {
    '(^click)': 'toggle($event)'
  }
})
export class AsideToggle {
  /**
  * TODO
  * @param {IonicApp} app  TODO
  */
  constructor(app: IonicApp) {
    //TODO(mlynch): don't hard code this, evaluate with ref system
    this.aside = app.getComponent('menu');
  }

  /**
  * TODO
  * @param {TODO} event  TODO
  */
  toggle(event) {
    this.aside && this.aside.toggle();
  }

}
