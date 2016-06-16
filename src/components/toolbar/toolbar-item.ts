import {Directive, ElementRef, Optional, forwardRef, Inject, ContentChildren} from '@angular/core';

import {Button} from '../button/button';
import {Navbar} from '../navbar/navbar';
import {Toolbar} from './toolbar';


/**
 * @private
 */
@Directive({
  selector: 'ion-buttons,[menuToggle]'
})
export class ToolbarItem {
  inToolbar: boolean;

  constructor(
    elementRef: ElementRef,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    toolbar && toolbar.addItemRef(elementRef);
    navbar && navbar.addItemRef(elementRef);
    this.inToolbar = !!(toolbar || navbar);
  }

  @ContentChildren(Button)
  set _buttons(buttons: any) {
    if (this.inToolbar) {
      Button.setRoles(buttons, 'bar-button');
    }
  }
}
