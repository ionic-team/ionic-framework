import { Directive, HostListener, Input, Optional } from '@angular/core';
import { IonRouterOutlet } from './ion-router-outlet';
import { Router } from '@angular/router';

@Directive({
  selector: 'ion-back-button'
})
export class IonBackButton {

  @Input() defaultHref: string;

  constructor(
    @Optional() private router: Router,
    @Optional() private routerOutlet: IonRouterOutlet,
  ) {}

  @HostListener('click')
  onClick() {
    if (this.routerOutlet && this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
    } else if (this.router && this.defaultHref != null) {
      this.router.navigateByUrl(this.defaultHref);
    }
  }
}
