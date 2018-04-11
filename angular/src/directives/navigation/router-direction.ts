import { Directive, HostListener, Input } from '@angular/core';
import { NavController, NavIntent } from '../../providers/nav-controller';

@Directive({
  selector: '[routerDirection]',
})
export class RouterDirection {

  @Input() routerDirection: string;

  constructor(
    private navCtrl: NavController,
  ) {}

  @HostListener('click')
  onClick() {
    this.navCtrl.setIntent(textToIntent(this.routerDirection));
  }
}

function textToIntent(direction: string) {
  switch (direction) {
    case 'forward': return NavIntent.Forward;
    case 'back': return NavIntent.Back;
    case 'root': return NavIntent.Root;
    default: return NavIntent.Auto;
  }
}
