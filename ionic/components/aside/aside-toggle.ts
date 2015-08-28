import {Directive} from 'angular2/angular2';

import {IonicApp} from '../app/app';


@Directive({
  selector: '[aside-toggle]',
  host: {
    '(^click)': 'toggle($event)'
  }
})
export class AsideToggle {

  constructor(app: IonicApp) {
    //TODO(mlynch): don't hard code this, evaluate with ref system
    this.aside = app.getComponent('menu');
  }

  toggle(event) {
    this.aside && this.aside.toggle();
  }

}
