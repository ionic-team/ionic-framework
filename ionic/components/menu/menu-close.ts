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
    '(click)': 'close()'
  }
})
export class MenuClose extends Ion {

  constructor(
    app: IonicApp,
    elementRef: ElementRef
  ) {
    super(elementRef, null);
    this.app = app;
  }

  close() {
    let menu = this.app.getComponent(this.menuClose || 'menu');
    menu && menu.close();
  }

}
