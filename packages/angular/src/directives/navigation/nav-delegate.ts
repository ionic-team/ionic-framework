import { Component } from '@angular/core';
import { NavDelegate as NavDelegateBase, NAV_DELEGATE_SELECTOR, NAV_DELEGATE_TEMPLATE } from '@ionic/angular/common';

@Component({
  selector: NAV_DELEGATE_SELECTOR,
  template: NAV_DELEGATE_TEMPLATE,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class NavDelegate extends NavDelegateBase {}
