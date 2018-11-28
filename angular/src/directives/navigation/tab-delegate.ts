import { ComponentFactoryResolver, ContentChild, Directive, ElementRef, HostListener, Injector, ViewContainerRef } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';
import { IonRouterOutlet } from './ion-router-outlet';


@Directive({
  selector: 'ion-tab'
})
export class TabDelegate {

  @ContentChild(IonRouterOutlet) outlet?: IonRouterOutlet;

  private nativeEl: HTMLIonTabElement;

  constructor(
    elementRef: ElementRef,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
    location: ViewContainerRef
  ) {
    this.nativeEl = elementRef.nativeElement;
    this.nativeEl.delegate = angularDelegate.create(resolver, injector, location);
  }

  get tab() {
    return this.nativeEl.tab;
  }

  getLastUrl() {
    return this.outlet ? this.outlet.getLastUrl() : undefined;
  }

  @HostListener('ionRouterOutletActivated')
  async onNavChanged() {
    const tab = this.nativeEl;
    await tab.componentOnReady();
    const tabs = tab.closest('ion-tabs');
    if (tabs) {
      await tabs.componentOnReady();
      await tabs.select(tab);
    }
  }

}

