import { NavDelegate as NavDelegateBase, NAV_DELEGATE_INPUTS, NAV_DELEGATE_METHODS, ProxyCmp } from '@ionic/angular/common';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@ProxyCmp({
  inputs: NAV_DELEGATE_INPUTS,
  methods: NAV_DELEGATE_METHODS,
})
@Component({
  selector: 'ion-nav',
  standalone: true,
  imports: [CommonModule],
})
export class NavDelegate extends NavDelegateBase {}
