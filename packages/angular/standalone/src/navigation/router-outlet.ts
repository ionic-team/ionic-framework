import { Location } from '@angular/common';
import { Directive, Attribute, Optional, SkipSelf, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet as IonRouterOutletBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-router-outlet.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Directive({
  selector: 'ion-router-outlet',
  standalone: true,
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
