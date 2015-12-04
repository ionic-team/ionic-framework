import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';


/**
* TODO
* @see {@link /docs/v2/components#menus Menu Component Docs}
* @see {@link ../../menu/Menu Menu API Docs}
*/
@Directive({
  selector: '[menu-close]',
  inputs: [
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
