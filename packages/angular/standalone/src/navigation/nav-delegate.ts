import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  NavDelegate as NavDelegateBase,
  ProxyCmp,
  NAV_DELEGATE_SELECTOR,
  NAV_DELEGATE_TEMPLATE,
} from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: NAV_DELEGATE_SELECTOR,
  template: NAV_DELEGATE_TEMPLATE,
  standalone: true,
  imports: [CommonModule],
})
export class NavDelegate extends NavDelegateBase {}
