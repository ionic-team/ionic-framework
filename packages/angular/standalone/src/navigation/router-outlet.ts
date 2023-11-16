import { Location } from '@angular/common';
import {
  ViewChild,
  ViewContainerRef,
  Component,
  Attribute,
  Optional,
  SkipSelf,
  ElementRef,
  NgZone,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonRouterOutlet as IonRouterOutletBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-router-outlet.js';

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
})
@Component({
  selector: 'ion-router-outlet',
  standalone: true,
  template: '<ng-container #outletContent><ng-content></ng-content></ng-container>',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterOutlet extends IonRouterOutletBase {
  @ViewChild('outletContent', { read: ViewContainerRef }) outletContent: ViewContainerRef;

  /**
   * We need to pass in the correct instance of IonRouterOutlet
   * otherwise parentOutlet will be null in a nested outlet context.
   * This results in APIs such as NavController.pop not working
   * in nested outlets because the parent outlet cannot be found.
   */
  constructor(
    @Attribute('name') name: string,
    @Optional() @Attribute('tabs') tabs: string,
    commonLocation: Location,
    elementRef: ElementRef,
    router: Router,
    zone: NgZone,
    activatedRoute: ActivatedRoute,
    outletContent: ViewContainerRef,
    @SkipSelf() @Optional() readonly parentOutlet?: IonRouterOutlet
  ) {
    super(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, outletContent, parentOutlet);
  }
}
