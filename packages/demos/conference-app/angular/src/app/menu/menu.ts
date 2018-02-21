import { Component } from '@angular/core';

@Component({
  templateUrl: 'menu.html',
  selector: 'app-menu'
})
export class Menu {


  selectTab(index: number) {
    const tabs = document.querySelector('ion-tabs');
    return tabs.componentOnReady().then(() => {
      return tabs.select(index);
    });
  }
}
