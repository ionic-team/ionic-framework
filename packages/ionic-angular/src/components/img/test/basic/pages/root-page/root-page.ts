import { Component } from '@angular/core';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  images = [
    {
      width: '100',
      height: '44',
      src: 'assets/img/batmobile.jpg'
    },
    {
      width: '100',
      height: '75',
      src: 'assets/img/knight-rider.jpg'
    },
    {
      width: '100',
      height: '68',
      src: 'assets/img/general-lee.jpg'
    }
  ];
}
