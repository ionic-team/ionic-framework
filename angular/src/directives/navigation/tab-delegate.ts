import { ComponentFactoryResolver, Directive, ElementRef, HostListener, Injector, ViewContainerRef } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';


@Directive({
  selector: 'ion-tab'
})
export class TabDelegate {

  constructor(
    private elementRef: ElementRef,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
    location: ViewContainerRef
  ) {
    elementRef.nativeElement.delegate = angularDelegate.create(resolver, injector, location);
  }

  @HostListener('ionRouterOutletActivated', ['$event'])
  async onNavChanged() {
    const tab = this.elementRef.nativeElement as HTMLIonTabElement;
    await tab.componentOnReady();
    const tabs = tab.closest('ion-tabs');
    if (tabs) {
      await tabs.componentOnReady();
      await tabs.select(tab);
    }
  }

}

