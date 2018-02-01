import { Component } from '@angular/core';

import { MenuController } from '../../../../../..';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  activeMenu: string = 'none';

  constructor(private menu: MenuController) { }

  menu1Active() {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
  }
}
