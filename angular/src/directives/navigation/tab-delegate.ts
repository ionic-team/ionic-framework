import { ComponentFactoryResolver, Directive, ElementRef, HostListener, Injector, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AngularDelegate } from '../../providers/angular-delegate';


@Directive({
  selector: 'ion-tab'
})
export class TabDelegate {

  constructor(
    @Optional() private router: Router,
    ref: ElementRef,
    cfr: ComponentFactoryResolver,
    injector: Injector,
    angularDelegate: AngularDelegate,
  ) {
    ref.nativeElement.delegate = angularDelegate.create(cfr, injector);
  }

  @HostListener('ionTabbarClick', ['$event'])
  ionTabbarClick(ev: UIEvent) {
    const tabElm: HTMLIonTabElement = ev.detail as any;
    if (this.router && tabElm && tabElm.href) {
      console.log('tabElm', tabElm.href);

      this.router.navigateByUrl(tabElm.href);
    }
  }

}

