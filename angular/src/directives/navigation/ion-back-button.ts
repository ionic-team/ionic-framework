import { Directive, HostListener, Optional } from '@angular/core';
import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button'
})
export class IonBackButton {

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
  ) {}

  @HostListener('click')
  onClick() {
    if (this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
    }
  }
}
