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
import { IonRouterOutlet as IonRouterOutletBase } from '@ionic/angular/common';

@Component({
  selector: 'ion-router-outlet',
  template: '<ng-container #outletContent><ng-content></ng-content></ng-container>',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonRouterOutlet extends IonRouterOutletBase {
  /**
   * `static: true` must be set so the query results are resolved
   * before change detection runs. Otherwise, the view container
   * ref will be ion-router-outlet instead of ng-container, and
   * the first view will be added as a sibling of ion-router-outlet
   * instead of a child.
   */
  @ViewChild('outletContent', { read: ViewContainerRef, static: true }) outletContent: ViewContainerRef;

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
    @SkipSelf() @Optional() readonly parentOutlet?: IonRouterOutlet
  ) {
    super(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet);
  }
}
