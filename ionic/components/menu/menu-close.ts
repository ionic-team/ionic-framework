import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';


/**
* TODO
*/
@Directive({
  selector: '[menu-close]',
  properties: [
    'menuClose'
  ],
  host: {
    '(click)': 'close($event)'
  }
})
export class MenuToggle extends Ion {

  constructor(
    app: IonicApp,
    elementRef: ElementRef
  ) {
    super(elementRef, null);
    this.app = app;
  }

  close(ev) {
    let menu = this.app.getComponent(this.menuClose || 'menu');
    menu && menu.close();
    ev.preventDefault();
    ev.stopPropagation();
  }

}
