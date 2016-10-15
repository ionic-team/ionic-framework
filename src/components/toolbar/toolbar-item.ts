import { ContentChildren, Directive, ElementRef, forwardRef, Optional, Inject, Renderer } from '@angular/core';

import { Button } from '../button/button';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from '../navbar/navbar';
import { Toolbar } from './toolbar';


/**
 * @private
 */
@Directive({
  selector: 'ion-buttons,[menuToggle]'
})
export class ToolbarItem extends Ion {
  inToolbar: boolean;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(config, elementRef, renderer);

    this._setMode('bar-buttons', config.get('mode'));
    this.inToolbar = !!(toolbar || navbar);
  }

  @ContentChildren(Button)
  set _buttons(buttons: any) {
    if (this.inToolbar) {
      buttons.forEach((button: Button) => {
        button.setRole('bar-button');
      });
    }
  }
}
