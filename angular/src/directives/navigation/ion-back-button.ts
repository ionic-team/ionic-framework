import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '../../providers/nav-controller';
import { IonRouterOutlet } from './ion-router-outlet';

@Directive({
  selector: 'ion-back-button'
})
export class IonBackButton {

  @Input()
  set defaultHref(value: string) {
    this.elementRef.nativeElement.defaultHref = value;
  }
  get defaultHref() {
    return this.elementRef.nativeElement.defaultHref;
  }

  constructor(
    @Optional() private router: Router,
    @Optional() private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController,
    private elementRef: ElementRef,
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.routerOutlet && this.routerOutlet.canGoBack()) {
      this.routerOutlet.pop();
      ev.preventDefault();
    } else if (this.router && this.defaultHref != null) {
      this.navCtrl.navigateBack(this.defaultHref);
      ev.preventDefault();
    }
  }
}
