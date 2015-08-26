import {forwardRef, Component, Host, View, EventEmitter, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Button} from '../ion/components/button';
import {IonicConfig} from '../../config/config';
import {IonicDirective} from '../../config/annotations';

@IonicDirective({
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
    console.log('Toggling', this.aside)
    this.aside && this.aside.toggle();
  }
}
