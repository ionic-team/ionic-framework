import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';

import { NavController } from '../../providers/nav-controller';

import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button'
})
export class IonBackButtonDelegate {

  @Input()
  set defaultHref(value: string | undefined | null) {
    this.elementRef.nativeElement.defaultHref = value;
  }
  get defaultHref(): string | undefined | null {
    return this.elementRef.nativeElement.defaultHref;
  }

  constructor(
    @Optional() private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController,
    private elementRef: ElementRef,
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.routerOutlet && this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
      ev.preventDefault();
    } else if (this.defaultHref != null) {
      this.navCtrl.navigateBack(this.defaultHref);
      ev.preventDefault();
    }
  }
}
