import { ComponentFactoryResolver, Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { AngularDelegate } from '../../providers/angular-delegate';


@Directive({
  selector: 'ion-tab'
})
export class TabDelegate {

  constructor(
    private elementRef: ElementRef,
    cfr: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
  ) {
    elementRef.nativeElement.delegate = angularDelegate.create(cfr, injector);
  }

  @HostListener('ionNavDidChange')
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

