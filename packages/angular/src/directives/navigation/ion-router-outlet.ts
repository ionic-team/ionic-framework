import { Location } from '@angular/common';
import { Directive, Attribute, Optional, SkipSelf, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet as IonRouterOutletBase } from '@ionic/angular/common';

@Directive({
  selector: 'ion-router-outlet',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterOutlet extends IonRouterOutletBase {
  constructor(
    @Attribute('name') name: string,
    @Optional() @Attribute('tabs') tabs: string,
    commonLocation: Location,
    elementRef: ElementRef,
    router: Router,
    zone: NgZone,
    activatedRoute: ActivatedRoute,
    @SkipSelf() @Optional() readonly parentOutlet?: IonRouterOutlet
  ) {
    super(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet);
  }
}
