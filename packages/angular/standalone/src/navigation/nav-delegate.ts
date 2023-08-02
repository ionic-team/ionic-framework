import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavDelegate as NavDelegateBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-nav',
  standalone: true,
  imports: [CommonModule],
})
export class NavDelegate extends NavDelegateBase {}
